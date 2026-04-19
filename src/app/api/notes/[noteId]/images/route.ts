import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  // raw body + Content-Type(boundary 포함)을 그대로 백엔드에 전달
  const contentType = req.headers.get("content-type");
  const body = await req.arrayBuffer();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };
  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  const res = await fetch(`${BACKEND_URL}/api/notes/${noteId}/images`, {
    method: "PUT",
    headers,
    body,
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
