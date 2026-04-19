import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ message: "url 파라미터가 필요합니다." }, { status: 400 });
  }

  const res = await fetch(url);
  if (!res.ok) {
    return new NextResponse(null, { status: res.status });
  }

  const blob = await res.blob();
  return new NextResponse(blob, {
    headers: {
      "Content-Type": blob.type,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
