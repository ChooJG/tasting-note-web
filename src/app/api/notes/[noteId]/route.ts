import { NextRequest, NextResponse } from "next/server";
import { fetchWithAuth, fetchPublic } from "@/lib/fetchWithAuth";
import { getSession } from "@/lib/session";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
  const session = await getSession();

  const fetcher = session.accessToken ? fetchWithAuth : fetchPublic;
  const res = await fetcher(`/api/notes/${noteId}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
  const body = await req.json();
  const res = await fetchWithAuth(`/api/notes/${noteId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
  const res = await fetchWithAuth(`/api/notes/${noteId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
