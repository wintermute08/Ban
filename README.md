# 휴대폰 본인인증 화면

설치 없이 `index.html`을 브라우저에서 열면 실행됩니다. 로컬 서버를 사용하려면 이 폴더에서 `python3 -m http.server 8000`을 실행하고 `http://localhost:8000`에 접속하세요.

모바일·데스크톱 반응형 화면으로, 이름·통신사·휴대폰 번호·6자리 인증번호 입력, 입력값 검증, 2:56 카운트다운과 재요청 시 초기화를 지원합니다. 실제 SMS 발송 및 본인인증 API는 포함하지 않습니다. 입력 정보는 저장하거나 외부로 전송하지 않습니다.

## Vercel 배포

이 폴더를 Git 저장소로 올리고 Vercel에서 가져옵니다.

- Framework Preset: **Other**
- Root Directory: **프로젝트 루트**
- Build Command: **비워 두기**
- Output Directory: **`.`**
- Install Command: **비워 두기**

빌드나 패키지 설치가 필요 없는 정적 HTML/CSS/JS 프로젝트입니다. Vercel CLI가 설치되어 있다면 이 폴더에서 `vercel`로 배포할 수도 있습니다.
