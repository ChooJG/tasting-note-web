"use client";

import { use, useState, useRef } from "react";
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

function parseTags(str?: string): string[] {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const touchStartX = useRef(0);

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
  const tasteTags = parseTags(note.taste);
  const aromaTags = parseTags(note.aroma);
  const hasImages = note.imageUrls && note.imageUrls.length > 0;

  return (
    <div className="flex min-h-dvh flex-col bg-beige">
      {/* Carousel / Hero image area */}
      <div
        className="relative shrink-0 overflow-hidden"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (!hasImages || note.imageUrls!.length <= 1) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 50) setCarouselIndex((i) => Math.min(i + 1, note.imageUrls!.length - 1));
          if (diff < -50) setCarouselIndex((i) => Math.max(i - 1, 0));
        }}
      >
        {hasImages ? (
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
          >
            {note.imageUrls!.map((url, i) => (
              <img key={i} src={url} alt="" className="h-[240px] w-full shrink-0 object-cover" />
            ))}
          </div>
        ) : (
          <div className="flex h-[240px] items-center justify-center bg-beige-mid text-[56px]">
            🍷
          </div>
        )}

        {/* Overlay buttons */}
        <button
          onClick={() => router.push("/feed")}
          className="absolute left-3.5 top-3.5 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-black/35"
        >
          <svg width={17} height={17} viewBox="0 0 17 17" fill="none">
            <path d="M10.5 3.5L6 8.5L10.5 13.5" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {isLoggedIn && (
          <button
            onClick={() => setOptionsOpen(true)}
            className="absolute right-3.5 top-3.5 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-black/35"
          >
            <svg width={17} height={17} viewBox="0 0 17 17" fill="white">
              <circle cx={8.5} cy={3.5} r={1.3} />
              <circle cx={8.5} cy={8.5} r={1.3} />
              <circle cx={8.5} cy={13.5} r={1.3} />
            </svg>
          </button>
        )}

        {/* Carousel arrows + dots */}
        {hasImages && note.imageUrls!.length > 1 && (
          <>
            {carouselIndex > 0 && (
              <button
                onClick={() => setCarouselIndex((i) => i - 1)}
                className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30"
              >
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            {carouselIndex < note.imageUrls!.length - 1 && (
              <button
                onClick={() => setCarouselIndex((i) => i + 1)}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30"
              >
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-[5px]">
              {note.imageUrls!.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === carouselIndex ? "w-[18px] bg-white" : "w-1.5 bg-white/50"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Basic info */}
        <div className="border-b border-beige-mid px-5 pb-4 pt-[18px]">
          <div className="mb-1.5 flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
                {note.alcoholNameKo ?? note.alcoholName ?? note.customAlcoholName}
              </h1>
              {note.alcoholName && (
                <p className="mt-0.5 text-[13px] text-ink-muted">
                  {note.alcoholName}
                </p>
              )}
            </div>
          </div>

          <div className="mb-1.5 flex items-center gap-1.5">
            {stars.map((filled, i) => (
              <span key={i} className={`text-[13px] ${filled ? "text-rating" : "text-beige-dark"}`}>
                ★
              </span>
            ))}
            <span className="ml-0.5 text-[14px] font-medium text-ink-soft">
              {note.rating?.toFixed(1)}
            </span>
          </div>
          <p className="text-[13px] text-ink-muted">
            {note.nickname ?? `유저 #${note.userId}`} · {formatDate(note.drankAt ?? note.createdAt)}
          </p>
        </div>

        {/* Taste */}
        {tasteTags.length > 0 && (
          <section className="px-5 pt-[18px]">
            <h2 className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              맛
            </h2>
            <div className="flex flex-wrap gap-[6px]">
              {tasteTags.map((t, i) => (
                <span key={i} className="rounded-pill bg-beige-mid px-3 py-[5px] text-[13px] text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Aroma */}
        {aromaTags.length > 0 && (
          <section className="px-5 pt-[18px]">
            <h2 className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              향
            </h2>
            <div className="flex flex-wrap gap-[6px]">
              {aromaTags.map((a, i) => (
                <span key={i} className="rounded-pill bg-beige-mid px-3 py-[5px] text-[13px] text-ink-soft">
                  {a}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        {note.description && (
          <section className="px-5 pt-[18px]">
            <h2 className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              테이스팅 노트
            </h2>
            <p className="whitespace-pre-line text-[15px] font-light leading-[1.75] text-ink-soft">
              {note.description}
            </p>
          </section>
        )}

        {/* Pairing */}
        {note.pairing && (
          <section className="px-5 pt-[18px]">
            <h2 className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              페어링
            </h2>
            <p className="flex items-center gap-1.5 text-[13px] text-ink-muted">
              🍽️ {note.pairing}
            </p>
          </section>
        )}

        {/* Location & date */}
        <section className="px-5 pt-[18px]">
          {note.location && (
            <p className="flex items-center gap-1.5 text-[13px] text-ink-muted">
              📍 {note.location}
            </p>
          )}
          {(note.drankAt || note.createdAt) && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-ink-muted">
              📅 {formatDate(note.drankAt ?? note.createdAt)}
            </p>
          )}
        </section>

        {/* Actions */}
        <div className="mt-5 flex gap-2.5 px-5">
          {isOwner && (
            <Button
              variant="secondary"
              onClick={() => router.push(`/notes/${noteId}/edit`)}
            >
              수정
            </Button>
          )}
          {isOwner && isDraft && (
            <Button onClick={() => publishMutation.mutate(noteId)}>
              발행
            </Button>
          )}
          {!isOwner && isLoggedIn && (
            <Button onClick={() => setReportOpen(true)}>
              신고
            </Button>
          )}
        </div>
      </div>

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
              className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left active:bg-beige"
            >
              <span className="w-6 text-center text-[17px]">✏️</span>
              <span className="text-[15px] text-ink">수정하기</span>
            </button>
          )}
          {!isOwner && (
            <button
              onClick={() => {
                setOptionsOpen(false);
                setReportOpen(true);
              }}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left active:bg-beige"
            >
              <span className="w-6 text-center text-[17px]">🚩</span>
              <span className="text-[15px] text-ink">신고하기</span>
            </button>
          )}
          {isOwner && (
            <button
              onClick={() => {
                setOptionsOpen(false);
                deleteMutation.mutate(noteId);
              }}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left active:bg-beige"
            >
              <span className="w-6 text-center text-[17px]">🗑️</span>
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
