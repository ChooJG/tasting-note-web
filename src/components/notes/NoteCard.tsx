"use client";

import { useState } from "react";
import Link from "next/link";
import type { components } from "@/types/api";
import Tag from "@/components/ui/Tag";

type NoteResponse = components["schemas"]["NoteResponse"];

interface NoteCardProps {
  note: NoteResponse;
  showAuthor?: boolean;
  showStatus?: boolean;
}

const STATUS_STYLES = {
  PUBLISHED: "bg-[#E8F8EE] text-success",
  DRAFT: "bg-wine-pale text-wine",
} as const;

const STATUS_LABELS = {
  PUBLISHED: "발행됨",
  DRAFT: "임시저장",
} as const;

function parseTags(str?: string): string[] {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

function ImageCarousel({ urls }: { urls: string[] }) {
  const [index, setIndex] = useState(0);
  const multi = urls.length > 1;

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {urls.map((url, i) => (
          <img key={i} src={url} alt="" className="h-[200px] w-full shrink-0 object-cover" />
        ))}
      </div>

      {multi && (
        <>
          {/* 왼쪽 화살표 */}
          {index > 0 && (
            <button
              onClick={(e) => { e.preventDefault(); setIndex((i) => i - 1); }}
              className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white"
            >
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                <path d="M8.5 3L4.5 7L8.5 11" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {/* 오른쪽 화살표 */}
          {index < urls.length - 1 && (
            <button
              onClick={(e) => { e.preventDefault(); setIndex((i) => i + 1); }}
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white"
            >
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                <path d="M5.5 3L9.5 7L5.5 11" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-[5px]">
            {urls.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-[18px] bg-white" : "w-1.5 bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function NoteCard({
  note,
  showAuthor = false,
  showStatus = false,
}: NoteCardProps) {
  const allTags = [...parseTags(note.taste), ...parseTags(note.aroma)];
  const stars = Array.from({ length: 5 }, (_, i) => i < (note.rating ?? 0));
  const hasImages = note.imageUrls && note.imageUrls.length > 0;

  return (
    <article className="overflow-hidden rounded-[18px] bg-white shadow-[0_1px_3px_rgba(30,18,8,0.05),0_4px_12px_rgba(30,18,8,0.04)]">
      {/* Image carousel or placeholder */}
      {hasImages ? (
        <ImageCarousel urls={note.imageUrls!} />
      ) : (
        <div className="flex h-[200px] items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <span className="text-[40px]">🍷</span>
        </div>
      )}

      <Link href={`/notes/${note.id}`} className="block p-4 active:bg-beige/30">
        {/* Meta row */}
        <div className="mb-1.5 flex items-center justify-between">
          {(note.alcoholName || note.customAlcoholName) && (
            <Tag variant="category">
              {note.alcoholNameKo ?? note.alcoholName ?? note.customAlcoholName}
            </Tag>
          )}
          {showStatus && note.status ? (
            <span className={`rounded-pill px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[note.status]}`}>
              {STATUS_LABELS[note.status]}
            </span>
          ) : showAuthor ? (
            <span className="text-[12px] text-ink-muted">
              {note.nickname ?? `유저 #${note.userId}`}
            </span>
          ) : null}
        </div>

        {/* Rating */}
        <div className="mb-2 flex items-center gap-[5px]">
          <div className="flex gap-0.5">
            {stars.map((filled, i) => (
              <span key={i} className={`text-[13px] ${filled ? "text-rating" : "text-beige-dark"}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-[13px] font-medium text-ink-soft">
            {note.rating?.toFixed(1)}
          </span>
        </div>

        {/* Alcohol name */}
        <p className="mb-1 text-[13px] text-ink-soft">
          {note.alcoholNameKo ?? note.alcoholName ?? note.customAlcoholName}
        </p>

        {/* Title or Description preview */}
        {note.title ? (
          <h3 className="mb-2 text-[16px] font-medium tracking-[-0.02em] text-ink">
            {note.title}
          </h3>
        ) : note.description ? (
          <p className="mb-2 line-clamp-1 text-[14px] text-ink-soft">
            {note.description}
          </p>
        ) : null}

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-[5px]">
            {allTags.slice(0, 5).map((tag, i) => (
              <Tag key={i}>{tag}</Tag>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
