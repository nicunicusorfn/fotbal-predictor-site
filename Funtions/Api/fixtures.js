
export async function onRequestGet({ request, env }) {
  const apiKey = env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "API key nu este configurată." },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const date = url.searchParams.get("date") ||
    new Date().toISOString().slice(0, 10);

  const response = await fetch(
    `https://v3.football.api-sports.io/fixtures?date=${date}`,
    {
      headers: { "x-apisports-key": apiKey }
    }
  );

  const data = await response.json();

  return Response.json(data, {
    status: response.ok ? 200 : response.status
  });
}
