export default async function handler(req, res) {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxHxoExFfDbVer19Wo8-qjXHoHbD2DmOzwQ39c9D2GeCxeu2QqS11ZQ9-a_svlxSfbd/exec';
  
  try {
    const url = new URL(APPS_SCRIPT_URL);
    // 전달받은 모든 쿼리 파라미터를 GAS URL에 붙임
    Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, v));

    const MAX_RETRIES = 3; // 최대 재시도 횟수
    let delay = 300;       // 재시도 간격 (0.3초)
    let response;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      // 정상 응답(200 OK 등)이 오면 재시도 루프를 즉시 탈출합니다.
      if (response.ok) {
        break;
      }

      // 가끔 발생하는 404 등의 에러일 경우, 지정된 횟수만큼 잠시 대기 후 재시도합니다.
      if (attempt < MAX_RETRIES) {
        console.warn(`[시도 ${attempt}/${MAX_RETRIES}] GAS 응답 오류(${response.status}). ${delay}ms 후 재시도합니다.`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // 다음 대기 시간은 0.6초, 그 다음은 1.2초로 늘림 (지수 백오프)
      } else {
        // 마지막 시도마저 실패한 경우 에러를 던져 catch 블록으로 보냅니다.
        throw new Error(`GAS 서버 응답 오류: ${response.status}`);
      }
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
