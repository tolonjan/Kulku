// Kulku – bussitietojen välipalvelin (Digitransit)
// POST /api/digitransit?router=hsl|waltti|finland   body: { "query": "..." }
// Avain luetaan ympäristömuuttujasta DIGITRANSIT_KEY.

const ROUTERS = new Set(['hsl', 'waltti', 'finland']);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Käytä POST-pyyntöä' });

  const router = ROUTERS.has(req.query.router) ? req.query.router : 'finland';
  const key = process.env.DIGITRANSIT_KEY;
  if (!key) return res.status(500).json({ error: 'Palvelimelta puuttuu ympäristömuuttuja DIGITRANSIT_KEY' });

  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  try {
    const r = await fetch(`https://api.digitransit.fi/routing/v2/${router}/gtfs/v1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'digitransit-subscription-key': key },
      body,
      signal: AbortSignal.timeout(9000),
    });
    const text = await r.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(r.status).send(text);
  } catch (e) {
    return res.status(502).json({ error: `api.digitransit.fi: ${e.message}` });
  }
}
