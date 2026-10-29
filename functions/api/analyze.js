
const avg = (values) =>
  values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 1;

const poisson = (lambda, goals) =>
  Math.exp(-lambda) * Math.pow(lambda, goals) /
  factorial(goals);

function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export async function onRequestGet({ request, env }) {
  const key = env.API_FOOTBALL_KEY;
  if (!key) {
    return Response.json({ error: "API key neconfigurată." }, { status: 500 });
  }

  const url = new URL(request.url);
  const homeId = url.searchParams.get("home");
  const awayId = url.searchParams.get("away");

  if (!homeId || !awayId) {
    return Response.json({ error: "Lipsesc parametrii home și away." }, { status: 400 });
  }

  const headers = { "x-apisports-key": key };

  async function teamStats(id) {
    const r = await fetch(
      `https://v3.football.api-sports.io/fixtures?team=${id}&last=10`,
      { headers }
    );
    if (!r.ok) throw new Error("Eroare la preluarea meciurilor.");
    const data = await r.json();
    const matches = data.response || [];
    let scored = [], conceded = [];

    for (const match of matches) {
      const isHome = String(match.teams.home.id) === String(id);
      const gf = isHome ? match.goals.home : match.goals.away;
      const ga = isHome ? match.goals.away : match.goals.home;
      if (Number.isFinite(gf) && Number.isFinite(ga)) {
        scored.push(gf);
        conceded.push(ga);
      }
    }
    return { attack: avg(scored), defense: avg(conceded) };
  }

  try {
    const [home, away] = await Promise.all([
      teamStats(homeId), teamStats(awayId)
    ]);

    const homeLambda = Math.min(4, Math.max(0.15, (home.attack + away.defense) / 2 * 1.12));
    const awayLambda = Math.min(4, Math.max(0.15, (away.attack + home.defense) / 2));

    let scores = [];
    let pHome = 0, pDraw = 0, pAway = 0, over25 = 0;

    for (let h = 0; h <= 8; h++) {
      for (let a = 0; a <= 8; a++) {
        const p = poisson(homeLambda, h) * poisson(awayLambda, a);
        scores.push({ score: `${h}-${a}`, probability: +(p * 100).toFixed(2) });
        if (h > a) pHome += p;
        else if (h === a) pDraw += p;
        else pAway += p;
        if (h + a > 2) over25 += p;
      }
    }

    scores.sort((a, b) => b.probability - a.probability);

    return Response.json({
      method: "Estimare statistică Poisson, nu garanție",
      expectedGoals: {
        home: +homeLambda.toFixed(2),
        away: +awayLambda.toFixed(2)
      },
      result1X2: {
        home: +(pHome * 100).toFixed(1),
        draw: +(pDraw * 100).toFixed(1),
        away: +(pAway * 100).toFixed(1)
      },
      overUnder25: {
        over: +(over25 * 100).toFixed(1),
        under: +((1 - over25) * 100).toFixed(1)
      },
      correctScores: scores.slice(0, 10)
    });
  } catch (e) {
    return Response.json({ error: e.message || "Eroare la analiză." }, { status: 502 });
  }
}
