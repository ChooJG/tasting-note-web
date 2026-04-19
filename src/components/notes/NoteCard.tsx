"use client";

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
  PUBLISHED: "\uBC1C\uD589\uB428",
  DRAFT: "\uC784\uC2DC\uC800\uC7A5",
} as const;

function parseTags(str?: string): string[] {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

export default function NoteCard({
  note,
  showAuthor = false,
  showStatus = false,
}: NoteCardProps) {
  const allTags = [...parseTags(note.taste), ...parseTags(note.aroma)];
  const stars = Array.from({ length: 5 }, (_, i) => i < (note.rating ?? 0));
  const hasImage = note.imageUrls && note.imageUrls.length > 0;

  return (
    <Link href={`/notes/${note.id}`} className="block">
      <article className="overflow-hidden rounded-[18px] bg-white shadow-[0_1px_3px_rgba(30,18,8,0.05),0_4px_12px_rgba(30,18,8,0.04)] active:scale-[0.985]">
        {/* Image / Placeholder */}
        {hasImage ? (
          <img
            src={note.imageUrls![0]}
            alt=""
            className="h-[200px] w-full object-cover"
          />
        ) : (
          <div className="flex h-[200px] items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-[40px]">{"\u{1F377}"}</span>
          </div>
        )}

        <div className="p-4">
          {/* Meta row */}
          <div className="mb-1.5 flex items-center justify-between">
            {note.alcoholName && (
              <Tag variant="category">
                {note.alcoholNameKo ?? note.alcoholName}
              </Tag>
            )}
            {showStatus && note.status ? (
              <span className={`rounded-pill px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[note.status]}`}>
                {STATUS_LABELS[note.status]}
              </span>
            ) : showAuthor ? (
              <span className="text-[12px] text-ink-muted">
                유저 #{note.userId}
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
            {note.alcoholNameKo ?? note.alcoholName}
          </p>

          {/* Title */}
          {note.title && (
            <h3 className="mb-2 text-[16px] font-medium tracking-[-0.02em] text-ink">
              {note.title}
            </h3>
          )}

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-[5px]">
              {allTags.slice(0, 5).map((tag, i) => (
                <Tag key={i}>{tag}</Tag>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
