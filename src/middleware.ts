import { NextRequest, NextResponse } from "next/server";

// 로그인 필요한 경로 (노트 생성/수정, 내 노트, 프로필)
// 노트 상세(/notes/[id])는 공개 노트도 있으므로 보호하지 않음
const PROTECTED_PATHS = ["/notes/new", "/notes/my", "/profile"];

function isProtected(pathname: string) {
  // /notes/[id]/edit 패턴도 보호
  if (/^\/notes\/\d+\/edit/.test(pathname)) return true;
  return PROTECTED_PATHS.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has("sip-session");

  // 비로그인 + 보호 경로 → 로그인으로 (callbackUrl 포함)
  if (!hasSession && isProtected(pathname)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*"],
};
