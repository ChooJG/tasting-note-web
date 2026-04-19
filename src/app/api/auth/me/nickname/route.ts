import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getSession } from "@/lib/session";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const res = await fetchWithAuth("/api/auth/me/nickname", {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: data.message ?? "닉네임 변경에 실패했습니다." },
      { status: res.status }
    );
  }

  // 세션에 닉네임 업데이트
  const session = await getSession();
  session.nickname = body.nickname;
  await session.save();

  return NextResponse.json({ success: true });
}
