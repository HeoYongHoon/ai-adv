export default async function handler(req, res) {
  const APPS_SCRIPT_URL = 'https://google.com';
  
  const url = new URL(APPS_SCRIPT_URL);
  Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, v));

  const MAX_RETRIES = 3; // 최대 재시도 횟수
  let delay = 300;       // 재시도 간격 (0.3초)

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      // ⚠️ 404를 포함한 에러 응답 시 재시도하도록 설정
      if (!response.ok) {
        throw new Error(`GAS 서버 응답 오류: ${response.status}`);
      }

      // 성공 시 데이터 반환 후 루프 종료
      const data = await response.json();
      return res.status(200).json(data);

    } catch (err) {
      console.warn(`[시도 ${attempt}/${MAX_RETRIES}] 에러 발생: ${err.message}`);
      
      // 마지막 시도에서도 실패하면 catch 블록 밖으로 에러를 던짐
      if (attempt === MAX_RETRIES) {
        console.error('최종 실패: 모든 재시도 횟수를 초과했습니다.');
        return res.status(500).json({ 
          error: '데이터를 가져오지 못했습니다.', 
          details: err.message 
        });
      }

      // 잠시 대기 후 재시도 (점진적으로 대기 시간 증가)
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // 다음 대기 시간은 0.6초, 그 다음은 1.2초
    }
  }
}
