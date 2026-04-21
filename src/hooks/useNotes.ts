"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getPublicNotes, getMyNotes, getNote } from "@/api/notes";
import { useAuthStore } from "@/store/auth";

export function usePublicNotes() {
  return useInfiniteQuery({
    queryKey: ["notes", "public"],
    queryFn: ({ pageParam }) => getPublicNotes(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
  });
}

export function useMyNotes(status?: "DRAFT" | "PUBLISHED") {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return useQuery({
    queryKey: ["notes", "my", status],
    queryFn: () => getMyNotes(status),
    enabled: isLoggedIn,
  });
}

export function useNote(noteId: number) {
  return useQuery({
    queryKey: ["notes", noteId],
    queryFn: () => getNote(noteId),
    enabled: !!noteId,
  });
}
