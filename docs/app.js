// ⚠️ 본인의 정보로 수정하세요!
const OWNER = 'Junghyun99'; 
const REPO = 'test-page';
const FILE_PATH = 'config.json'; 

let currentSha = ''; // 파일 덮어쓰기를 위해 기존 파일의 고유값(sha)이 필요함

// 1. 페이지 로드 시 기존 설정과 토큰 불러오기
window.onload = async () => {
    const savedToken = localStorage.getItem('gh_token');
    if (savedToken) document.getElementById('gh_token').value = savedToken;

    document.getElementById('status').innerText = "설정 불러오는 중...";
    
    // 캐시 무시를 위해 현재 시간(t)을 파라미터로 추가
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?t=${new Date().getTime()}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        currentSha = data.sha; // 매우 중요! 업데이트할 때 필요함
        
        // Base64로 인코딩된 파일 내용을 디코딩하여 JSON으로 파싱
        const decodedContent = decodeURIComponent(escape(atob(data.content)));
        const config = JSON.parse(decodedContent);

        // 화면 입력창에 값 채워넣기
        document.getElementById('ticker').value = config.ticker;
        document.getElementById('ma_days').value = config.moving_average;
        document.getElementById('amount').value = config.trade_amount;
        
        document.getElementById('status').innerText = "불러오기 완료!";
    } catch (error) {
        document.getElementById('status').innerText = "불러오기 실패 (주소 확인 필요)";
    }
};

// 2. 설정 저장 버튼 클릭 시 깃허브로 전송
async function saveConfig() {
    const token = document.getElementById('gh_token').value;
    if (!token) {
        alert("GitHub 토큰을 입력해주세요!");
        return;
    }
    
    // 토큰을 브라우저에 저장 (다음 접속 시 편하게)
    localStorage.setItem('gh_token', token);
    document.getElementById('status').innerText = "깃허브에 저장하는 중...";

    // 화면의 값을 읽어와서 JSON 객체 생성
    const newConfig = {
        ticker: document.getElementById('ticker').value,
        moving_average: parseInt(document.getElementById('ma_days').value),
        trade_amount: parseInt(document.getElementById('amount').value)
    };

    // JSON을 문자열로 바꾸고, 다시 Base64로 암호화 (한글 깨짐 방지 처리 포함)
    const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(newConfig, null, 2))));

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
    
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: "🤖 UI에서 알고리즘 설정 업데이트", // 커밋 메시지
            content: encodedContent,
            sha: currentSha // 기존 파일 덮어쓰기
        })
    });

    if (response.ok) {
        const data = await response.json();
        currentSha = data.content.sha; // 다음 저장을 위해 sha 갱신
        document.getElementById('status').innerText = "저장 완료! (커밋됨)";
    } else {
        document.getElementById('status').innerText = "저장 실패! (토큰 권한 확인)";
    }
}
