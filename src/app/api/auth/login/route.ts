import { NextRequest, NextResponse } from "next/server";
import { getSession, parseJwtPayload } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { success: false, message: data.message ?? "로그인에 실패했습니다." },
      { status: res.status }
    );
  }

  // 새 스펙: TokenResponse가 바로 반환됨 (success 래핑 없음)
  const tokenData = data.data ?? data;
  const accessToken = tokenData.accessToken;
  const refreshToken = tokenData.refreshToken;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "토큰을 받지 못했습니다." },
      { status: 500 }
    );
  }

  const session = await getSession();
  session.accessToken = accessToken;
  session.refreshToken = refreshToken;

  const jwt = parseJwtPayload(accessToken);
  if (jwt.sub) session.userId = Number(jwt.sub);
  if (jwt.nickname) session.nickname = String(jwt.nickname);

  await session.save();

  return NextResponse.json({
    success: true,
    userId: session.userId,
    nickname: session.nickname,
  });
}
