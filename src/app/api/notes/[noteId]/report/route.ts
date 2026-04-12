import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
  const body = await req.json();
  const res = await fetchWithAuth(`/api/notes/${noteId}/report`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
