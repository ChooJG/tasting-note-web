import { NextRequest, NextResponse } from "next/server";
import { fetchPublic } from "@/lib/fetchWithAuth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");

  let path: string;
  if (keyword) {
    path = `/api/alcohols/search?keyword=${encodeURIComponent(keyword)}`;
  } else if (category) {
    path = `/api/alcohols?category=${encodeURIComponent(category)}`;
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
