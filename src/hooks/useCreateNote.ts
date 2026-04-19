"use client";

import { useMutation } from "@tanstack/react-query";
import { createNote } from "@/api/notes";
import { toast } from "@/components/ui/Toast";
import type { components } from "@/types/api";

type NoteCreateRequest = components["schemas"]["NoteCreateRequest"];

export function useCreateNote() {
  return useMutation({
    mutationFn: (body: NoteCreateRequest) => createNote(body),
    onError: (err: Error) => toast(err.message),
  });
}
