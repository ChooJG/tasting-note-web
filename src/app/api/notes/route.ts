import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const path = status ? `/api/notes/my?status=${status}` : "/api/notes/my";

  const res = await fetchWithAuth(path);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetchWithAuth("/api/notes", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
