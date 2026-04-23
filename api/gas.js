// api/gas.js
export default async function handler(req, res) {
  const APPS_SCRIPT_URL = 'https://google.com';
  
  const url = new URL(APPS_SCRIPT_URL);
  // 브라우저에서 보낸 쿼리스트링(?action=...)을 그대로 전달
  Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const response = await fetch(url.toString(), { redirect: 'follow' });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
