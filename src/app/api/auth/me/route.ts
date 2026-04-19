import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function GET() {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ isLoggedIn: false });
  }

  // 백엔드 /api/auth/me 호출해서 최신 유저 정보 가져오기
  try {
    const res = await fetchWithAuth("/api/auth/me");
    if (res.ok) {
      const user = await res.json();
      // 세션에도 저장
      if (user.nickname) session.nickname = user.nickname;
      if (user.profileImageUrl) session.profileImageUrl = user.profileImageUrl;
      await session.save();

      return NextResponse.json({
        isLoggedIn: true,
        userId: session.userId ?? null,
        nickname: user.nickname ?? session.nickname ?? null,
        profileImageUrl: user.profileImageUrl ?? session.profileImageUrl ?? null,
      });
    }
  } catch {}

  // 백엔드 호출 실패 시 세션 데이터로 폴백
  return NextResponse.json({
    isLoggedIn: true,
    userId: session.userId ?? null,
    nickname: session.nickname ?? null,
    profileImageUrl: session.profileImageUrl ?? null,
  });
}
