import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/notes", "/profile"];
const AUTH_PATHS = ["/login", "/signup"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has("sip-session");

  // 비로그인 + 보호 경로 → 로그인으로
  if (!hasSession && PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 로그인 상태 + 인증 페이지 → 피드로
  if (hasSession && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/login", "/signup"],
};
