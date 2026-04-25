import { NextRequest, NextResponse } from "next/server";

// 로그인 없이 접근 가능한 경로
const PUBLIC_PATHS = [
  "/feed",
  "/explore",
  "/profile/privacy",
  "/profile/terms",
];

// 로그인 상태에서 접근하면 피드로 리다이렉트할 경로
const AUTH_ONLY_PATHS = ["/login", "/signup", "/oauth/callback"];

function isPublicPath(pathname: string) {
  if (pathname === "/") return true;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return true;
  if (AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p))) return true;
  if (/^\/notes\/\d+$/.test(pathname)) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon")) return true;
  if (/\.\w+$/.test(pathname)) return true;
  return false;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has("sip-session");
  console.log(`[proxy] ${pathname} | session: ${hasSession}`);

  // 로그인 상태에서 로그인/회원가입 페이지 접근 → 피드로
  if (hasSession && AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  // 루트 → 피드
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  // 공개 경로는 통과
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 비로그인 + 보호 경로 → 로그인으로 리다이렉트
  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|upload/|_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|json)$).*)",
  ],
};
