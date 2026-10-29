FOTBALPREDICTOR — STARTER SITE

Include:
- index.html: interfață mobilă dark/green.
- functions/api/fixtures.js: programul meciurilor prin API-Football.
- functions/api/analyze.js: analiză Poisson pentru 1/X/2, peste/sub 2.5, scor corect (top 10), pauză/final orientativ.
- Cheia API se păstrează în secretul serverului API_FOOTBALL_KEY.

Publicare gratuită din browserul telefonului:
1. Creează cont GitHub și Cloudflare: https://github.com/ și https://dash.cloudflare.com/
2. Creează repository GitHub public sau privat numit fotbal-predictor-site.
3. În repository apasă Add file → Upload files și încarcă index.html plus folderul functions/api cu cele două fișiere JavaScript. Păstrează structura folderelor.
4. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git; conectează repository-ul.
5. Framework preset: None. Build command: lasă gol. Build output directory: / (dacă nu acceptă /, încearcă .).
6. După deploy, în setările proiectului adaugă variabila/secretul API_FOOTBALL_KEY cu cheia din contul API-Football/API-Sports.
7. Fă redeploy și deschide adresa *.pages.dev.
8. Apasă Încarcă în site.

API key:
- Înregistrează-te la https://www.api-football.com/ și verifică planurile/limitele actuale.
- Nu publica cheia în HTML, GitHub sau comentarii.
- Planul gratuit poate avea limite și acoperire limitată.

LIMITĂRI:
- Acesta este codul inițial, nu un site deja publicat.
- Scorul corect este foarte greu de anticipat. Modelul oferă probabilități aproximative, nu garanții.
- Pauză/final este orientativ și folosește o aproximație simplificată.
- Istoricul salvează analize în browser; verificarea automată a câștigurilor și rata reală de reușită nu sunt încă implementate.
- API-ul poate limita numărul de solicitări.
