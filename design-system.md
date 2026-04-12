# Sip — Design System

## 디자인 방향

- **키워드**: 가볍고 모던한 테이스팅 저널
- **톤**: 깔끔한 미니멀, 따뜻한 베이지 베이스에 적갈색 포인트
- **폰트**: Pretendard 단일 사용 (굵기 대비로 위계 표현)
- **레이아웃**: 모바일 퍼스트 (기준 width: 390px)

---

## 색상 토큰

```css
:root {
  /* Background */
  --beige: #f0eae0; /* 메인 배경 */
  --beige-mid: #e8e0d4; /* 카드 내부 태그, 섹션 구분 */
  --beige-dark: #d9cfbf; /* 보더, 구분선 */

  /* Point */
  --wine: #7b2d2d; /* 주요 포인트 (버튼, 헤더, 강조) */
  --wine-light: #8f3535; /* 호버/액티브 상태 */
  --wine-pale: #f9f0ee; /* 배지 배경, 연한 강조 */

  /* Text */
  --ink: #1e1208; /* 본문 텍스트 */
  --ink-soft: #5c4020; /* 보조 텍스트 */
  --ink-muted: #9a8060; /* 힌트, 플레이스홀더, 메타 */

  /* Semantic */
  --success: #27ae60; /* 발행됨 상태 */
  --rating: #d4941a; /* 별점 색상 */

  /* Border Radius */
  --radius: 14px; /* 카드, 버튼 */
  --radius-sm: 8px; /* 인풋, 작은 요소 */
}
```

### Tailwind 커스텀 설정 (`tailwind.config.ts`)

```ts
colors: {
  beige: {
    DEFAULT: '#F0EAE0',
    mid: '#E8E0D4',
    dark: '#D9CFBF',
  },
  wine: {
    DEFAULT: '#7B2D2D',
    light: '#8F3535',
    pale: '#F9F0EE',
  },
  ink: {
    DEFAULT: '#1E1208',
    soft: '#5C4020',
    muted: '#9A8060',
  },
},
borderRadius: {
  card: '14px',
  input: '8px',
  pill: '20px',
  device: '48px',
},
```

---

## 타이포그래피

폰트: **Pretendard** 단일 패밀리

| 역할          | size    | weight | letter-spacing |
| ------------- | ------- | ------ | -------------- |
| 페이지 타이틀 | 22px    | 600    | -0.03em        |
| 섹션 타이틀   | 17px    | 600    | -0.02em        |
| 카드 제목     | 16px    | 500    | -0.02em        |
| 본문          | 15px    | 300    | -              |
| 보조 텍스트   | 13px    | 400    | -              |
| 배지 / 레이블 | 11~12px | 500    | +0.06~0.1em    |
| 히어로 타이틀 | 24~28px | 600    | -0.03em        |

> **규칙**: 굵기는 300 / 400 / 500 / 600 네 단계만 사용. 700은 사용 안 함.

---

## 컴포넌트 스펙

### Button

```
Primary   : bg-wine, text-beige, radius-card, padding 15px, font-weight 500
Secondary : bg-white/70, border beige-dark, text-ink
Ghost     : bg-transparent, text-wine, font-weight 500
FAB       : 52×52px, border-radius 50%, bg-wine, shadow wine/35%
```

### Input Field

```
background : rgba(255,255,255,0.6)
border     : 1.5px solid beige-dark
radius     : radius-input (8px)
padding    : 13px 14px
font       : 15px / weight 300
focus      : border-color wine-light, box-shadow 0 0 0 3px wine/8%
placeholder: ink-muted
```

### Card (Note)

```
background  : #ffffff
border-radius: 18px
padding     : 18px
shadow      : 0 1px 3px ink/6%, 0 4px 12px ink/4%
image-height: 180px (있을 경우 상단 full-bleed, 16px top-radius)
image-overlay: linear-gradient(to bottom, transparent 40%, ink/20%)
```

### Tag / Chip

```
기본    : bg-beige-mid, text-ink-soft, radius-pill, 4px 10px
선택됨  : bg-wine, text-beige, border-wine
카테고리 배지: bg-wine-pale, text-wine, 3px 10px
```

### Bottom Navigation

```
height    : 80px
background: beige
border-top: 1px solid beige-dark
아이콘 크기: 22×22px
활성 색상 : wine
비활성   : ink-muted
FAB 위치 : 중앙, 약간 위로 돌출 (margin-bottom: 4px)
```

### Modal (Bottom Sheet)

```
overlay   : rgba(ink, 0.5)
sheet bg  : beige
border-radius: 24px 24px 0 0
handle    : 36×4px, beige-dark, margin 12px auto
animation : slideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1)
```

### Hero (Detail / Profile)

```
background: wine
text      : #F0EAE0 (기본), rgba(240,234,224,0.6~0.75) (보조)
뒤로가기 버튼: rgba(240,234,224,0.15) 배경
```

### Toast

```
background : ink
text       : beige
padding    : 10px 20px
radius     : 20px
위치       : bottom 100px, 가로 중앙
animation  : fadeIn + translateY(-10px → 0)
duration   : 2.2초 후 자동 사라짐
```

---

## 간격 시스템

| 토큰        | 값   | 사용처           |
| ----------- | ---- | ---------------- |
| page-x      | 20px | 페이지 좌우 패딩 |
| card-gap    | 12px | 카드 간격        |
| section-gap | 24px | 폼 섹션 간격     |
| card-pad    | 18px | 카드 내부 패딩   |

---

## 애니메이션

```css
/* 페이지 진입 */
pageIn  : opacity 0→1, translateX(24px→0), 0.25s cubic-bezier(0.22, 1, 0.36, 1)
pageBack: opacity 0→1, translateX(-24px→0), 0.25s cubic-bezier(0.22, 1, 0.36, 1)

/* 모달 */
slideUp : translateY(100%→0), 0.25s cubic-bezier(0.22, 1, 0.36, 1)
fadeIn  : opacity 0→1, 0.2s ease

/* 토스트 */
toastIn : opacity 0→1, translateY(10px→0), 0.25s ease
```

---

## 아이콘 원칙

- 직접 인라인 SVG 사용 (외부 라이브러리 최소화)
- stroke 기반, stroke-width: 1.5~1.8
- 크기: 16×16 (소), 18×18 (중), 22×22 (내비)
- 색상은 CSS `currentColor` 사용

---

## 로고 / 브랜드

```
이름    : sip (소문자 고정)
폰트    : Pretendard, weight 600, letter-spacing 0.04em
색상    : wine (#7B2D2D)
아이콘  : 물방울 형태 SVG (stroke 기반)
```

---

## 반응형 원칙

- 기준: 모바일 390px
- 데스크탑에서는 390×844px 디바이스 프레임으로 센터 표시
- 실제 앱 배포 시 `max-width: 430px`, `margin: 0 auto`
- 태블릿/데스크탑 별도 레이아웃은 현재 스코프 외

---

## DO / DON'T

### DO ✅

- 베이지 배경에 흰 카드로 레이어 표현
- 적갈색(`#7B2D2D`)을 포인트로만 제한적으로 사용
- Pretendard 굵기 대비로 위계 표현
- 라운드 코너 일관되게 유지 (14px / 8px / 20px)
- 버튼·인풋은 충분한 터치 영역 확보 (min 44px)

### DON'T ❌

- 보라색 계열 사용 금지
- font-weight 700 사용 금지
- 외곽선(stroke) 없는 플랫 아이콘 금지
- 카드 안에 카드 중첩 2단계 이상 금지
- 색상 임의 추가 금지 (토큰 외 hex 직접 사용 금지)
