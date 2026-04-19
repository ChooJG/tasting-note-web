"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote } from "@/api/notes";
import { toast } from "@/components/ui/Toast";
import type { components } from "@/types/api";

type NoteUpdateRequest = components["schemas"]["NoteUpdateRequest"];

export function useUpdateNote(noteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: NoteUpdateRequest) => updateNote(noteId, body),
    onError: (err: Error) => toast(err.message),
  });
}
