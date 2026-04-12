"use client";

import Link from "next/link";
import type { components } from "@/types/api";
import Rating from "@/components/ui/Rating";
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

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function NoteCard({
  note,
  showAuthor = false,
  showStatus = false,
}: NoteCardProps) {
  const allTags = [
    ...(note.aromas ?? []),
    ...(note.tastes ?? []),
  ];

  return (
    <Link href={`/notes/${note.id}`} className="block">
      <article className="rounded-[18px] bg-white p-[18px] shadow-[0_1px_3px_rgba(30,18,8,0.06),0_4px_12px_rgba(30,18,8,0.04)]">
        {/* Eyebrow */}
        <div className="mb-2.5 flex items-center justify-between">
          {note.alcoholName && (
            <Tag variant="category">
              {note.alcoholNameKo ?? note.alcoholName}
            </Tag>
          )}
          <span className="text-[11px] text-ink-muted">
            {formatDate(note.drankAt ?? note.createdAt)}
          </span>
        </div>

        {/* Title */}
        {note.title && (
          <h3 className="mb-1 text-[16px] font-medium tracking-[-0.02em] text-ink">
            {note.title}
          </h3>
        )}

        {/* Alcohol name */}
        <p className="mb-2.5 text-[13px] text-ink-soft">
          {note.alcoholName}
        </p>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {allTags.slice(0, 5).map((tag) => (
              <Tag key={tag.id}>{tag.name}</Tag>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {showStatus && note.status ? (
            <span
              className={`rounded-pill px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[note.status]}`}
            >
              {STATUS_LABELS[note.status]}
            </span>
          ) : showAuthor ? (
            <div className="flex items-center gap-2">
              <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-wine text-[11px] font-semibold text-beige">
                {(note.userId ?? 0) % 2 === 0 ? "김" : "박"}
              </div>
              <span className="text-[12px] text-ink-muted">
                user_{note.userId}
              </span>
            </div>
          ) : (
            <div />
          )}
          <Rating value={note.rating ?? 0} size="sm" readonly />
        </div>
      </article>
    </Link>
  );
}
