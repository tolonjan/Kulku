// Kulku – lentotietojen välipalvelin (Finavia)
// GET /api/flights?dir=dep|arr&apt=HEL
// Avain luetaan ympäristömuuttujasta FINAVIA_KEY (valinnainen FINAVIA_APP_ID).

const ENDPOINTS = [
  (dir, apt) => `https://api.finavia.fi/flights/public/v0/flights/${dir}/${apt}`,
  (dir, apt) => `https://apigw.finavia.fi/flights/public/v0/flights/${dir}/${apt}`,
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const dir = ['dep', 'arr'].includes(req.query.dir) ? req.query.dir : 'dep';
  const apt = /^[A-Z]{3}$/.test(req.query.apt || '') ? req.query.apt : 'HEL';
  const key = process.env.FINAVIA_KEY;
  if (!key) return res.status(500).json({ error: 'Palvelimelta puuttuu ympäristömuuttuja FINAVIA_KEY' });

  const headers = { app_key: key, 'Ocp-Apim-Subscription-Key': key, Accept: 'application/xml' };
  if (process.env.FINAVIA_APP_ID) headers.app_id = process.env.FINAVIA_APP_ID;

  const errors = [];
  for (const make of ENDPOINTS) {
    const url = make(dir, apt);
    const host = new URL(url).host;
    try {
      const r = await fetch(url, { headers, signal: AbortSignal.timeout(9000) });
      if (!r.ok) { errors.push(`${host}: HTTP ${r.status}`); continue; }
      const body = await r.text();
      res.setHeader('Content-Type', r.headers.get('content-type') || 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
      return res.status(200).send(body);
    } catch (e) {
      errors.push(`${host}: ${e.name === 'TimeoutError' ? 'aikakatkaisu' : e.message}`);
    }
  }
  return res.status(502).json({ error: errors.join(' · ') });
}
