"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote, publishNote, reportNote } from "@/api/notes";
import { toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (noteId: number) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast("삭제되었습니다");
      router.push("/notes");
    },
    onError: (err: Error) => toast(err.message),
  });
}

export function usePublishNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: number) => publishNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast("노트가 발행되었습니다");
    },
    onError: (err: Error) => toast(err.message),
  });
}

export function useReportNote() {
  return useMutation({
    mutationFn: ({
      noteId,
      reason,
      reasonDetail,
    }: {
      noteId: number;
      reason: string;
      reasonDetail?: string;
    }) => reportNote(noteId, { reason, reasonDetail }),
    onSuccess: () => toast("신고가 접수되었습니다"),
    onError: (err: Error) => toast(err.message),
  });
}
