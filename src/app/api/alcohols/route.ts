import { NextRequest, NextResponse } from "next/server";
import { fetchPublic } from "@/lib/fetchWithAuth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");
  const cursor = searchParams.get("cursor");
  const size = searchParams.get("size");

  const extra = new URLSearchParams();
  if (cursor) extra.set("cursor", cursor);
  if (size) extra.set("size", size);

  let path: string;
  if (keyword) {
    extra.set("keyword", keyword);
    path = `/api/alcohols/search?${extra}`;
  } else if (category) {
    extra.set("category", category);
    path = `/api/alcohols?${extra}`;
  } else {
    return NextResponse.json(
      { success: false, message: "category 또는 keyword 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  const res = await fetchPublic(path);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
