# sip

술 테이스팅 노트를 작성하고 공유하는 모바일 웹 앱

## About

**sip**은 다양한 주류의 테이스팅 경험을 기록하고, 다른 사람들과 공유할 수 있는 서비스입니다.
가볍고 빠르게 사용할 수 있는 것을 최우선으로 합니다.

### 주요 기능

- 테이스팅 노트 작성 (맛, 향, 평점, 페어링 등)
- 위스키, 와인, 맥주 등 13개 카테고리의 주류 검색
- 노트 공개/비공개 설정 및 피드 공유
- 임시 저장(Draft) → 발행(Publish) 워크플로우

## Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Font | Pretendard |
| HTTP Client | Axios |
| Server State | TanStack React Query |
| Form | React Hook Form + Zod |
| Client State | Zustand |

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## Project Structure

```
app/
├── (auth)/          # 로그인, 회원가입
├── feed/            # 공개 피드
├── notes/           # 노트 CRUD
├── profile/         # 프로필
└── layout.tsx

components/
├── ui/              # 공통 컴포넌트
├── notes/           # 노트 관련 컴포넌트
└── layout/          # 네비게이션, 헤더

lib/                 # axios, queryClient 등 유틸
api/                 # API 호출 함수
store/               # zustand 스토어
types/               # 타입 정의
```
