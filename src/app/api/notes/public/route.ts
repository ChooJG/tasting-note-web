import { NextResponse } from "next/server";
import { fetchPublic } from "@/lib/fetchWithAuth";

export async function GET() {
  const res = await fetchPublic("/api/notes/public");
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
