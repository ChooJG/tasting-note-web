import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL!;

export const runtime = "nodejs";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  // 클라이언트 FormData에서 파일들 추출
  const incoming = await req.formData();
  const files = incoming.getAll("images") as File[];

  if (files.length === 0) {
    return NextResponse.json({ message: "파일이 없습니다." }, { status: 400 });
  }

  // 백엔드용 FormData 새로 구성
  const outgoing = new FormData();
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = new Blob([buffer], { type: file.type });
    outgoing.append("images", blob, file.name);
  }

  const res = await fetch(`${BACKEND_URL}/api/notes/${noteId}/images`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: outgoing,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { message: data.message ?? "이미지 업로드에 실패했습니다." },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
