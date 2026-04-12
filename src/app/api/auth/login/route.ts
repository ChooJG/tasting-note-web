import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return NextResponse.json(
      { success: false, message: data.message ?? "로그인에 실패했습니다." },
      { status: res.status }
    );
  }

  const session = await getSession();
  session.accessToken = data.data.accessToken;
  session.refreshToken = data.data.refreshToken;
  await session.save();

  return NextResponse.json({ success: true });
}
