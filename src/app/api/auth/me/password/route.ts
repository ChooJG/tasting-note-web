import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const res = await fetchWithAuth("/api/auth/me/password", {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: data.message ?? "비밀번호 변경에 실패했습니다." },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
