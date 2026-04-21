"use client";

import { useEffect, useRef } from "react";
import { usePublicNotes } from "@/hooks/useNotes";
import { useAuthStore } from "@/store/auth";
import NoteCard from "@/components/notes/NoteCard";
import Link from "next/link";

function FeedHeader() {
  const { isLoggedIn, nickname, profileImageUrl } = useAuthStore();
  const initial = (nickname ?? "\uC0AC").charAt(0);

  return (
    <header className="flex items-center justify-between px-5 pb-3 pt-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
          피드
        </h1>
        <p className="mt-0.5 text-[13px] text-ink-muted">
          모두의 테이스팅 노트
        </p>
      </div>
      {isLoggedIn ? (
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-wine text-[14px] font-semibold text-beige"
        >
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </Link>
      ) : (
        <Link
          href="/login"
          className="text-[13px] font-medium text-wine"
        >
          로그인
        </Link>
      )}
    </header>
  );
}

export default function FeedPage() {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = usePublicNotes();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasNextPage) fetchNextPage(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const notes = data?.pages.flatMap((p) => p.content) ?? [];

  return (
    <>
      <FeedHeader />
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {isLoading && (
          <div className="flex justify-center py-20 text-[14px] text-ink-muted">
            불러오는 중...
          </div>
        )}
        {error && (
          <div className="flex justify-center py-20 text-[14px] text-ink-muted">
            피드를 불러올 수 없습니다.
          </div>
        )}
        {!isLoading && notes.length === 0 && (
          <div className="flex justify-center py-20 text-[14px] text-ink-muted">
            아직 공개된 노트가 없습니다.
          </div>
        )}
        <div className="flex flex-col gap-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} showAuthor />
          ))}
        </div>
        <div ref={sentinelRef} className="h-1" />
        {isFetchingNextPage && (
          <div className="py-4 text-center text-[14px] text-ink-muted">
            불러오는 중...
          </div>
        )}
      </div>
    </>
  );
}
