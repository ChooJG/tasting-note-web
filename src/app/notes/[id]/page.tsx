"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useNote } from "@/hooks/useNotes";
import {
  useDeleteNote,
  usePublishNote,
  useReportNote,
} from "@/hooks/useNoteMutations";
import { useAuthStore } from "@/store/auth";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ReportModal from "@/components/notes/ReportModal";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const noteId = Number(id);
  const router = useRouter();
  const { isLoggedIn, userId } = useAuthStore();

  const { data: note, isLoading } = useNote(noteId);
  const deleteMutation = useDeleteNote();
  const publishMutation = usePublishNote();
  const reportMutation = useReportNote();

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[14px] text-ink-muted">
        불러오는 중...
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[14px] text-ink-muted">
        노트를 찾을 수 없습니다.
      </div>
    );
  }

  const isDraft = note.status === "DRAFT";
  const isOwner = isLoggedIn && userId != null && note.userId === userId;
  const stars = Array.from({ length: 5 }, (_, i) => i < (note.rating ?? 0));

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Hero */}
      <div className="shrink-0 bg-wine px-5 pb-7 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-beige/15"
          >
            <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
              <path
                d="M11 4L6 9L11 14"
                stroke="#F0EAE0"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {isLoggedIn && (
            <button
              onClick={() => setOptionsOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-beige/15 text-beige"
            >
              <svg width={18} height={18} viewBox="0 0 18 18" fill="currentColor">
                <circle cx={9} cy={4} r={1.5} />
                <circle cx={9} cy={9} r={1.5} />
                <circle cx={9} cy={14} r={1.5} />
              </svg>
            </button>
          )}
        </div>

        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-beige/60">
          {note.alcoholNameKo ?? note.alcoholName}
        </p>
        <h1 className="mb-1 text-[24px] font-semibold tracking-[-0.03em] text-beige">
          {note.title ?? "테이스팅 노트"}
        </h1>
        <p className="mb-4 text-[14px] text-beige/75">{note.alcoholName}</p>
        <div className="flex items-center gap-1.5">
          {stars.map((filled, i) => (
            <span
              key={i}
              className={`text-[16px] ${filled ? "text-rating" : "text-beige/30"}`}
            >
              ★
            </span>
          ))}
          <span className="ml-1 text-[16px] font-medium text-beige">
            {note.rating?.toFixed(1)}
          </span>
          <span className="text-[12px] text-beige/50">
            · {formatDate(note.drankAt ?? note.createdAt)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Aroma */}
        {note.aromas && note.aromas.length > 0 && (
          <section className="px-5 pt-5">
            <h2 className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              향 (Aroma)
            </h2>
            <div className="flex flex-wrap gap-[7px]">
              {note.aromas.map((a) => (
                <span
                  key={a.id}
                  className="rounded-pill bg-beige-mid px-3 py-[5px] text-[13px] text-ink-soft"
                >
                  {a.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Taste */}
        {note.tastes && note.tastes.length > 0 && (
          <section className="px-5 pt-5">
            <h2 className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              맛 (Taste)
            </h2>
            <div className="flex flex-wrap gap-[7px]">
              {note.tastes.map((t) => (
                <span
                  key={t.id}
                  className="rounded-pill bg-beige-mid px-3 py-[5px] text-[13px] text-ink-soft"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Pairing */}
        {note.pairing && (
          <section className="px-5 pt-5">
            <h2 className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              페어링
            </h2>
            <p className="text-[15px] font-light leading-[1.7] text-ink-soft">
              {note.pairing}
            </p>
          </section>
        )}

        {/* Description */}
        {note.description && (
          <section className="px-5 pt-5">
            <h2 className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              노트
            </h2>
            <p className="text-[15px] font-light leading-[1.7] text-ink-soft">
              {note.description}
            </p>
          </section>
        )}

        {/* Location */}
        {note.location && (
          <section className="mt-4 px-5">
            <p className="flex items-center gap-1.5 text-[13px] text-ink-muted">
              <svg width={14} height={14} viewBox="0 0 14 14" fill="currentColor">
                <path d="M7 1C4.8 1 3 2.8 3 5C3 7.5 7 13 7 13S11 7.5 11 5C11 2.8 9.2 1 7 1ZM7 6.5C6.2 6.5 5.5 5.8 5.5 5S6.2 3.5 7 3.5 8.5 4.2 8.5 5 7.8 6.5 7 6.5Z" />
              </svg>
              {note.location}
            </p>
          </section>
        )}
      </div>

      {/* Actions — 본인 노트에만 표시 */}
      {isOwner && (
        <div className="shrink-0 flex gap-2.5 px-5 pb-6">
          <Button
            variant="secondary"
            onClick={() => router.push(`/notes/${noteId}/edit`)}
          >
            수정
          </Button>
          {isDraft && (
            <Button onClick={() => publishMutation.mutate(noteId)}>
              발행
            </Button>
          )}
        </div>
      )}

      {/* Options Modal */}
      <Modal
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        title="노트 옵션"
      >
        <div className="flex flex-col gap-1">
          {isOwner && (
            <button
              onClick={() => {
                setOptionsOpen(false);
                router.push(`/notes/${noteId}/edit`);
              }}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left"
            >
              <span className="text-[18px]">✏️</span>
              <span className="text-[15px] text-ink">수정하기</span>
            </button>
          )}
          {!isOwner && (
            <button
              onClick={() => {
                setOptionsOpen(false);
                setReportOpen(true);
              }}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left"
            >
              <span className="text-[18px]">🚩</span>
              <span className="text-[15px] text-ink">신고하기</span>
            </button>
          )}
          {isOwner && (
            <button
              onClick={() => {
                setOptionsOpen(false);
                deleteMutation.mutate(noteId);
              }}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left"
            >
              <span className="text-[18px]">🗑️</span>
              <span className="text-[15px] text-[#C0392B]">삭제하기</span>
            </button>
          )}
        </div>
        <div className="mt-3">
          <Button variant="secondary" onClick={() => setOptionsOpen(false)}>
            취소
          </Button>
        </div>
      </Modal>

      {/* Report Modal */}
      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={(reason, reasonDetail) =>
          reportMutation.mutate({ noteId, reason, reasonDetail })
        }
      />
    </div>
  );
}
