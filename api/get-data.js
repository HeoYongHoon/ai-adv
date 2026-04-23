export default async function handler(req, res) {
  // 원래 사용하시던 구글 주소
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxHxoExFfDbVer19Wo8-qjXHoHbD2DmOzwQ39c9D2GeCxeu2QqS11ZQ9-a_svlxSfbd/exec';
  
  // 브라우저가 보낸 모든 파라미터를 구글 주소 뒤에 붙여줍니다.
  const url = new URL(APPS_SCRIPT_URL);
  Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    });
    const data = await response.json();
    
    // 구글에서 받은 결과를 다시 내 브라우저로 전달합니다.
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: '구글 연결 실패: ' + err.message });
  }
}
