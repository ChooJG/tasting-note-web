import { NextRequest, NextResponse } from "next/server";
import { fetchPublic } from "@/lib/fetchWithAuth";

export async function GET(req: NextRequest) {
  const nickname = req.nextUrl.searchParams.get("nickname");
  if (!nickname) {
    return NextResponse.json({ message: "닉네임을 입력해주세요." }, { status: 400 });
  }

  const res = await fetchPublic(`/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`);
  return NextResponse.json(
    res.ok ? { available: true } : { available: false },
    { status: res.status }
  );
}
