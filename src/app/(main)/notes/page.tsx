"use client";

import { useState } from "react";
import Link from "next/link";
import { useMyNotes } from "@/hooks/useNotes";

type StatusFilter = "PUBLISHED" | "DRAFT";

const TABS: { label: string; value: StatusFilter }[] = [
  { label: "\uBC1C\uD589\uB41C", value: "PUBLISHED" },
  { label: "\uC784\uC2DC\uC800\uC7A5", value: "DRAFT" },
];


export default function MyNotesPage() {
  const [filter, setFilter] = useState<StatusFilter>("PUBLISHED");
  const { data: notes, isLoading } = useMyNotes(filter);

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

      {/* Grid */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="py-20 text-center text-[14px] text-ink-muted">
            불러오는 중...
          </div>
        )}
        {notes && notes.length === 0 && (
          <div className="py-20 text-center text-[14px] text-ink-muted">
            {filter === "DRAFT"
              ? "임시저장된 노트가 없습니다."
              : "발행된 노트가 없습니다."}
          </div>
        )}
        {notes && notes.length > 0 && (
          <div className="grid grid-cols-3 gap-[2px] p-[2px]">
            {notes.map((note) => {
              const hasImage = note.imageUrls && note.imageUrls.length > 0;
              return (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden bg-beige-mid"
                >
                  {hasImage ? (
                    <img src={note.imageUrls![0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[13px] text-rating">
                        ★ {note.rating?.toFixed(1) ?? "-"}
                      </span>
                      <span className="px-1 text-center text-[10px] text-ink-muted">
                        {note.alcoholNameKo ?? note.alcoholName}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
