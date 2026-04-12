"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicNotes, getMyNotes, getNote } from "@/api/notes";

export function usePublicNotes() {
  return useQuery({
    queryKey: ["notes", "public"],
    queryFn: getPublicNotes,
  });
}

export function useMyNotes(status?: "DRAFT" | "PUBLISHED") {
  return useQuery({
    queryKey: ["notes", "my", status],
    queryFn: () => getMyNotes(status),
  });
}

export function useNote(noteId: number) {
  return useQuery({
    queryKey: ["notes", noteId],
    queryFn: () => getNote(noteId),
    enabled: !!noteId,
  });
}
