import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL!;

export const runtime = "nodejs";

export async function PATCH(req: NextRequest) {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  // 클라이언트 FormData에서 파일 추출
  const incoming = await req.formData();
  const file = incoming.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ message: "파일이 없습니다." }, { status: 400 });
  }

  // 백엔드용 FormData 새로 구성
  const outgoing = new FormData();
  const buffer = Buffer.from(await file.arrayBuffer());
  const blob = new Blob([buffer], { type: file.type });
  outgoing.append("file", blob, file.name);

  const res = await fetch(`${BACKEND_URL}/api/auth/me/profile-image`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: outgoing,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: data.message ?? "프로필 이미지 변경에 실패했습니다." },
      { status: res.status }
    );
  }

  const data = await res.json();
  session.profileImageUrl = data.profileImageUrl;
  await session.save();

  return NextResponse.json(data);
}
