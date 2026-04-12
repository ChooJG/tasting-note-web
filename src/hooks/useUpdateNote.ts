"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateNote } from "@/api/notes";
import { toast } from "@/components/ui/Toast";
import type { components } from "@/types/api";

type NoteUpdateRequest = components["schemas"]["NoteUpdateRequest"];

export function useUpdateNote(noteId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (body: NoteUpdateRequest) => updateNote(noteId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast("수정되었습니다");
      router.push(`/notes/${noteId}`);
    },
    onError: (err: Error) => toast(err.message),
  });
}
