"use client";

import { useState } from "react";
import { useMyNotes } from "@/hooks/useNotes";
import NoteCard from "@/components/notes/NoteCard";

type StatusFilter = "ALL" | "PUBLISHED" | "DRAFT";

const TABS: { label: string; value: StatusFilter }[] = [
  { label: "전체", value: "ALL" },
  { label: "발행됨", value: "PUBLISHED" },
  { label: "임시저장", value: "DRAFT" },
];

export default function MyNotesPage() {
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const queryStatus = filter === "ALL" ? undefined : filter;
  const { data: notes, isLoading } = useMyNotes(queryStatus as "DRAFT" | "PUBLISHED" | undefined);

  return (
    <>
      {/* Header */}
      <header className="px-5 pb-3 pt-4">
        <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
          내 노트
        </h1>
      </header>

      {/* Tabs */}
      <div className="flex shrink-0 border-b border-beige-dark px-5">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`-mb-px border-b-2 px-4 py-3 text-[14px] transition-colors ${
              filter === tab.value
                ? "border-wine font-medium text-wine"
                : "border-transparent text-ink-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-3">
        {isLoading && (
          <div className="py-20 text-center text-[14px] text-ink-muted">
            불러오는 중...
          </div>
        )}
        {notes && notes.length === 0 && (
          <div className="py-20 text-center text-[14px] text-ink-muted">
            {filter === "DRAFT"
              ? "임시저장된 노트가 없습니다."
              : filter === "PUBLISHED"
                ? "발행된 노트가 없습니다."
                : "작성한 노트가 없습니다."}
          </div>
        )}
        <div className="flex flex-col gap-3">
          {notes?.map((note) => (
            <NoteCard key={note.id} note={note} showStatus />
          ))}
        </div>
      </div>
    </>
  );
}
