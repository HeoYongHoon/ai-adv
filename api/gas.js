export default async function handler(req, res) {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxHxoExFfDbVer19Wo8-qjXHoHbD2DmOzwQ39c9D2GeCxeu2QqS11ZQ9-a_svlxSfbd/exec';
  
  try {
    const url = new URL(APPS_SCRIPT_URL);
    // 전달받은 모든 쿼리 파라미터를 GAS URL에 붙임
    Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, v));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // 서버 환경에서는 redirect 설정을 하지 않아도 기본적으로 따라가지만 명시해줍니다.
    });

    if (!response.ok) {
      throw new Error(`GAS 서버 응답 오류: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error('서버 에러 상세:', err.message);
    return res.status(500).json({ 
      error: '데이터를 가져오지 못했습니다.', 
      details: err.message 
    });
  }
}
