# FUTURE CINEMA 🎬

AI·로봇·하이테크 SF 영화를 추천하는 넷플릭스 스타일 웹사이트입니다.

## 프로젝트 소개

TMDB API를 활용해 SF, AI/로봇, 사이버펑크, 우주·외계, 디스토피아 등 테마별 영화를 카테고리로 보여주고, 트레일러 재생·영화 상세·다국어(한/영/일)를 지원합니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **언어**: TypeScript
- **데이터**: TMDB API (영화 정보, 트레일러, 유사 영화)
- **다국어**: Kr / En / Jp (Context + 번역 객체)

## 주요 기능

- **히어로 배너**: 주간 트렌딩 영화, Play Now(트레일러) / More Info
- **현재 상영 중**: `now_playing` + region/language 연동 (한국·미국·일본)
- **카테고리 행**: AI·로봇, 인기 SF, 사이버펑크, 우주·외계, 디스토피아 (가로 스크롤)
- **언어 전환**: 상단 Kr / En / Jp — 목록·모달·TMDB 응답 모두 해당 언어로 전환
- **영화 상세 모달**: 줄거리, 장르, 주연, 예고편 재생, 유사 영화
- **트레일러 모달**: 풀스크린 YouTube 임베드, ESC/바깥 클릭으로 닫기
- **스크롤 잠금**: 모달 열림 시 `useScrollLock` 훅으로 배경 스크롤 고정 및 복원
- **반응형**: 네비게이션(데스크톱/모바일), 카드 호버 시 scale (휠 이벤트 캡처 방지 처리)

## 스크린샷

_(나중에 추가 예정)_

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치 방법

```bash
git clone https://github.com/Choi-sungjin/AIF-movie.git
cd AIF-movie
# 프로젝트가 ai-movie-hub 하위 폴더에 있다면: cd ai-movie-hub
npm install
```

### 환경변수 설정

```bash
cp .env.example .env.local
# .env.local 파일을 열어서 TMDB API 키 등을 입력하세요.
```

### 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

## TMDB API 키 발급 방법

1. [https://www.themoviedb.org](https://www.themoviedb.org) 에서 회원가입
2. **Settings** → **API** → **API 키(Request an API Key)** 발급
3. 발급받은 API Key를 `.env.local`의 `NEXT_PUBLIC_TMDB_API_KEY`에 넣어주세요.

## 라이선스

MIT
