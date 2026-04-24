import type { components } from "@/types/api";

type NoteResponse = components["schemas"]["NoteResponse"];
type NoteCreateRequest = components["schemas"]["NoteCreateRequest"];
type NoteUpdateRequest = components["schemas"]["NoteUpdateRequest"];

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    let message = "요청에 실패했습니다.";
    try {
      const json = JSON.parse(text);
      message = json.message ?? message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function getPublicNotes(): Promise<NoteResponse[]> {
  const res = await fetch("/api/notes/public");
  const data = await handleResponse<{ content: NoteResponse[] }>(res);
  return data.content ?? [];
}

export async function getMyNotes(status?: "DRAFT" | "PUBLISHED"): Promise<NoteResponse[]> {
  const params = status ? `?status=${status}` : "";
  const res = await fetch(`/api/notes${params}`);
  const data = await handleResponse<{ content: NoteResponse[] }>(res);
  return data.content ?? [];
}

export async function getNote(noteId: number): Promise<NoteResponse> {
  const res = await fetch(`/api/notes/${noteId}`);
  return handleResponse(res);
}

export async function createNote(body: NoteCreateRequest): Promise<NoteResponse> {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function updateNote(noteId: number, body: NoteUpdateRequest): Promise<NoteResponse> {
  const res = await fetch(`/api/notes/${noteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function publishNote(noteId: number): Promise<NoteResponse> {
  const res = await fetch(`/api/notes/${noteId}/publish`, { method: "PATCH" });
  return handleResponse(res);
}

export async function deleteNote(noteId: number): Promise<void> {
  const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    let message = "삭제에 실패했습니다.";
    try { message = JSON.parse(text).message ?? message; } catch {}
    throw new Error(message);
  }
}

export async function reportNote(
  noteId: number,
  body: { reason: string; reasonDetail?: string }
): Promise<void> {
  const res = await fetch(`/api/notes/${noteId}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    let message = "신고에 실패했습니다.";
    try { message = JSON.parse(text).message ?? message; } catch {}
    throw new Error(message);
  }
}
