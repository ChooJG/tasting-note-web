async function getToken(): Promise<string> {
  const res = await fetch("/api/auth/me/token");
  if (!res.ok) throw new Error("인증이 필요합니다.");
  const data = await res.json();
  return data.accessToken;
}

export async function uploadProfileImage(file: File): Promise<{ profileImageUrl: string }> {
  const token = await getToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/upload/profile-image", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? "이미지 업로드에 실패했습니다.");
  }
  return res.json();
}

export async function uploadNoteImages(noteId: number, files: File[]): Promise<void> {
  const token = await getToken();
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`/upload/notes/${noteId}/images`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("uploadNoteImages error:", res.status, text);
    let message = "이미지 업로드에 실패했습니다.";
    try { message = JSON.parse(text).message ?? message; } catch {}
    throw new Error(message);
  }
}
