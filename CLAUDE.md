# Sip — Claude Project Context

## 프로젝트 개요

술 테이스팅 노트를 작성하고 공유하는 모바일 웹 앱.
가볍고 빠르게 사용할 수 있는 것을 최우선으로 한다.

## 기술 스택

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **폰트**: Pretendard (`pretendard` npm 패키지, localFont 사용)
- **HTTP**: axios (커스텀 인스턴스 `/src/lib/axios.ts`)
- **서버 상태**: @tanstack/react-query
- **폼**: react-hook-form + zod + @hookform/resolvers
- **전역 상태**: zustand
- **API 타입**: openapi-typescript로 자동 생성

## 폴더 구조

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── feed/page.tsx
│   ├── notes/
│   │   ├── page.tsx           # 내 노트 목록
│   │   ├── new/page.tsx       # 노트 작성 (술 검색 포함)
│   │   └── [id]/
│   │       ├── page.tsx       # 노트 상세
│   │       └── edit/page.tsx  # 노트 수정
│   ├── profile/page.tsx
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── ui/                    # 공통 컴포넌트 (Button, Input, Modal 등)
│   ├── notes/                 # 노트 관련 컴포넌트
│   └── layout/                # BottomNav, PageHeader 등
├── lib/
│   ├── axios.ts               # axios 인스턴스 + 인터셉터
│   └── queryClient.ts
├── api/
│   ├── auth.ts
│   ├── notes.ts
│   ├── alcohols.ts
│   └── flavors.ts
├── store/
│   └── auth.ts                # zustand auth store
├── types/
│   └── api.ts                 # openapi-typescript 자동 생성
└── middleware.ts               # 인증 라우트 보호
```

## API 서버

- **Base URL**: `http://13.124.79.235:8080`
- **Swagger**: `http://13.124.79.235:8080/swagger-ui/ㄴ.html`
- **API Docs JSON**: `http://13.124.79.235:8080/v3/api-docs`
- **인증 방식**: Bearer JWT (Access Token + Refresh Token)

## API 엔드포인트 요약

### 인증 (`/api/auth`)

| Method | Path                | 설명                                            |
| ------ | ------------------- | ----------------------------------------------- |
| POST   | `/api/auth/signup`  | 회원가입 (email, password, nickname, birthDate) |
| POST   | `/api/auth/login`   | 로그인 → accessToken, refreshToken 반환         |
| POST   | `/api/auth/reissue` | 토큰 재발급 (헤더에 Refresh-Token 필요)         |
| POST   | `/api/auth/logout`  | 로그아웃                                        |

### 노트 (`/api/notes`)

| Method | Path                      | 설명                                        |
| ------ | ------------------------- | ------------------------------------------- |
| POST   | `/api/notes`              | 노트 생성 (항상 DRAFT로 생성)               |
| GET    | `/api/notes/public`       | 공개 피드 (비로그인 가능)                   |
| GET    | `/api/notes/my`           | 내 노트 목록 (status=DRAFT\|PUBLISHED 필터) |
| GET    | `/api/notes/{id}`         | 노트 단건 조회                              |
| PATCH  | `/api/notes/{id}`         | 노트 수정                                   |
| PATCH  | `/api/notes/{id}/publish` | 노트 발행 (DRAFT → PUBLISHED)               |
| DELETE | `/api/notes/{id}`         | 노트 삭제                                   |

### 술 (`/api/alcohols`)

| Method | Path                   | 설명                                 |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/api/alcohols`        | 카테고리별 목록 (category 쿼리 필수) |
| GET    | `/api/alcohols/{id}`   | 술 단건 조회                         |
| GET    | `/api/alcohols/search` | 키워드 검색                          |

### 맛/향 (`/api/flavors`)

| Method | Path           | 설명                      |
| ------ | -------------- | ------------------------- |
| GET    | `/api/flavors` | 맛/향 제안 목록 전체 조회 |

### 신고 (`/api/notes/{id}/report`)

| Method | Path                     | 설명                                                  |
| ------ | ------------------------ | ----------------------------------------------------- |
| POST   | `/api/notes/{id}/report` | 신고 (reason: SPAM\|INAPPROPRIATE\|FALSE_INFO\|OTHER) |

## 주요 타입

```typescript
// 노트 생성/수정 시 필수 필드
type NoteCreateRequest = {
  alcoholId: number; // 필수
  tasteIds: number[]; // 필수
  aromaIds: number[]; // 필수
  rating: number; // 필수 (1~5)
  title?: string;
  pairing?: string;
  description?: string;
  drankAt?: string; // 'YYYY-MM-DD'
  location?: string;
};

// 노트 수정 시 추가 필드
type NoteUpdateRequest = NoteCreateRequest & {
  isPublic: boolean; // 필수
};

// 술 카테고리
type AlcoholCategory =
  | "WHISKEY"
  | "WINE"
  | "BEER"
  | "SOJU"
  | "MAKGEOLLI"
  | "SAKE"
  | "VODKA"
  | "GIN"
  | "RUM"
  | "TEQUILA"
  | "BRANDY"
  | "COCKTAIL"
  | "ETC";
```

## 인증 흐름

1. 로그인 성공 → `accessToken`, `refreshToken` 수신
2. `accessToken` → `localStorage` 저장 (zustand store에서 관리)
3. axios 인터셉터에서 모든 요청에 `Authorization: Bearer {token}` 자동 첨부
4. 401 응답 시 `/api/auth/reissue`로 토큰 재발급 후 재요청
5. 재발급 실패 시 로그인 페이지로 리다이렉트

## CORS 처리

`next.config.ts`에 프록시 설정으로 CORS 우회:

```ts
rewrites: [
  {
    source: "/api/:path*",
    destination: "http://13.124.79.235:8080/api/:path*",
  },
];
```

→ 프론트에서는 항상 `/api/...`로 호출

## 페이지별 인증 요구사항

| 페이지                  | 비로그인 접근 |
| ----------------------- | ------------- |
| 피드                    | ✅ 가능       |
| 노트 상세 (공개)        | ✅ 가능       |
| 노트 상세 (비공개/임시) | ❌ 불가       |
| 내 노트 목록            | ❌ 불가       |
| 노트 작성/수정          | ❌ 불가       |
| 프로필                  | ❌ 불가       |

## 노트 상태 흐름

```
생성 → DRAFT → (발행) → PUBLISHED
                ↓
           isPublic: true/false 로 공개 여부 별도 제어
```

## 개발 시 주의사항

- 노트 생성은 항상 DRAFT로 저장됨. 발행은 `/publish` 엔드포인트 별도 호출
- 같은 노트를 중복 신고 불가
- 신고 사유가 OTHER일 경우 `reasonDetail` 필드 필수
- 술 검색은 영문명, 한글명, 별칭 통합 검색
- 비밀번호 규칙: 영문+숫자 조합 8자 이상 (`^(?=.*[A-Za-z])(?=.*\d).+$`)
- 닉네임 규칙: 공백 불가, 2~20자
