import { NextRequest, NextResponse } from "next/server";

// 로그인 없이 접근 가능한 경로
const PUBLIC_PATHS = [
  "/feed",
  "/login",
  "/signup",
  "/oauth/callback",
  "/explore",
  "/profile/privacy",
  "/profile/terms",
];

function isPublicPath(pathname: string) {
  // 정확히 "/" (루트)
  if (pathname === "/") return true;

  // 공개 경로
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return true;

  // 노트 상세 (/notes/[id]) — 공개 노트 조회 가능, 단 new/edit은 보호
  if (/^\/notes\/\d+$/.test(pathname)) return true;

  // API 라우트는 middleware에서 건드리지 않음
  if (pathname.startsWith("/api/")) return true;

  // 정적 파일
  if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon")) return true;
  if (/\.\w+$/.test(pathname)) return true;

  return false;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 비로그인 + 보호 경로 → 로그인으로 리다이렉트
  const hasSession = req.cookies.has("sip-session");
  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * API 라우트, _next, 정적 파일 제외
     */
    "/((?!api/|upload/|_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|json)$).*)",
  ],
};
