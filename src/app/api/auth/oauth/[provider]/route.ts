import { NextRequest, NextResponse } from "next/server";
import { getSession, parseJwtPayload } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/api/auth/oauth/${provider}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { success: false, message: data.message ?? "소셜 로그인에 실패했습니다." },
      { status: res.status }
    );
  }

  const tokenData = data.data ?? data;
  const { accessToken, refreshToken, isNewUser } = tokenData;

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
    isNewUser: !!isNewUser,
    userId: session.userId,
    nickname: session.nickname,
  });
}
