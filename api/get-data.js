// Node.js 환경에서 실행되는 서버 코드입니다.
export default async function handler(req, res) {
  const GAS_URL = process.env.GAS_URL; // 보안을 위해 환경변수 권장

  try {
    const response = await fetch(GAS_URL);
    const data = await response.json();

    // 브라우저에 데이터 전달 (CORS 문제도 자동 해결됨)
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'GAS 연결 실패' });
  }
}
