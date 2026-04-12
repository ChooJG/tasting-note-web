import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
  const res = await fetchWithAuth(`/api/notes/${noteId}/publish`, {
    method: "PATCH",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
