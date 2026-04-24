import { NextRequest, NextResponse } from "next/server";
import { fetchPublic } from "@/lib/fetchWithAuth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get("cursor");
  const size = searchParams.get("size");

  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  if (size) params.set("size", size);

  const query = params.toString();
  const res = await fetchPublic(`/api/notes/public${query ? `?${query}` : ""}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
