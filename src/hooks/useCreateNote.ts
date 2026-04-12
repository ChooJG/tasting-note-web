"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote } from "@/api/notes";
import { toast } from "@/components/ui/Toast";
import type { components } from "@/types/api";

type NoteCreateRequest = components["schemas"]["NoteCreateRequest"];

export function useCreateNote() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (body: NoteCreateRequest) => createNote(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast("노트가 저장되었습니다");
      router.push(`/notes/${data.id}`);
    },
    onError: (err: Error) => toast(err.message),
  });
}
