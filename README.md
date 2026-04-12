<div align="center">

# Tasting Note

**나만의 술 테이스팅 경험을 기록하고 공유하는 모바일 웹 앱**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white)

</div>

<br />

## Overview

위스키, 와인, 맥주 등 다양한 주류의 테이스팅 경험을 간편하게 기록하세요.
맛, 향, 평점, 페어링까지 한 번에 정리하고, 다른 사람들과 공유할 수 있습니다.

### Features

- **테이스팅 노트 작성** — 맛, 향, 평점, 페어링, 장소까지 상세 기록
- **주류 검색** — 13개 카테고리, 한글/영문/별칭 통합 검색
- **피드 공유** — 공개/비공개 설정으로 나만 보거나 모두와 공유
- **Draft → Publish** — 임시 저장 후 준비되면 발행

<br />

## Tech Stack

```
Framework     Next.js 16 (App Router)
Language      TypeScript
Styling       Tailwind CSS 4
Font          Pretendard
HTTP          Axios
Server State  TanStack React Query
Form          React Hook Form + Zod
Client State  Zustand
```

<br />

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev
```

<br />

## Project Structure

```
app/
├── (auth)/              # 로그인 · 회원가입
├── feed/                # 공개 피드
├── notes/               # 노트 CRUD
│   ├── new/             # 작성
│   └── [id]/            # 상세 · 수정
├── profile/             # 프로필
└── layout.tsx

components/
├── ui/                  # Button, Input, Modal ...
├── notes/               # 노트 카드, 폼 등
└── layout/              # BottomNav, PageHeader

lib/                     # axios 인스턴스, queryClient
api/                     # API 호출 함수
store/                   # zustand 스토어
types/                   # 타입 정의
```

<br />

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 실행 |
