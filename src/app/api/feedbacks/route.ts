import { NextRequest, NextResponse } from "next/server";
import { fetchPublic } from "@/lib/fetchWithAuth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetchPublic("/api/feedbacks", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: data.message ?? "피드백 전송에 실패했습니다." },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
