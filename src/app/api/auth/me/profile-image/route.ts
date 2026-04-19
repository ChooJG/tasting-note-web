import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// 세션에 프로필 이미지 URL만 저장 (파일 업로드는 클라이언트에서 직접 백엔드로)
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session.accessToken) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await req.json();
  if (body.profileImageUrl) {
    session.profileImageUrl = body.profileImageUrl;
    await session.save();
  }

  return NextResponse.json({ success: true });
}
