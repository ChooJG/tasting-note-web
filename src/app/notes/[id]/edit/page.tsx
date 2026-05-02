"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useNote } from "@/hooks/useNotes";
import { useUpdateNote } from "@/hooks/useUpdateNote";
import { usePublishNote } from "@/hooks/useNoteMutations";
import { toast } from "@/components/ui/Toast";
import NoteForm from "@/components/notes/NoteForm";
import { uploadNoteImages } from "@/lib/uploadImage";
import AlcoholSearch from "@/components/notes/AlcoholSearch";
import type { AlcoholSelection } from "@/components/notes/AlcoholSearch";
import Button from "@/components/ui/Button";
import type { components } from "@/types/api";
import type { NoteFormInput } from "@/lib/validations/note";

type AlcoholResponse = components["schemas"]["AlcoholResponse"];

export default function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const noteId = Number(id);
  const router = useRouter();

  const queryClient = useQueryClient();
  const { data: note, isLoading } = useNote(noteId);
  const updateNote = useUpdateNote(noteId);
  const publishNote = usePublishNote();

  const [pickingAlcohol, setPickingAlcohol] = useState(false);
  const [selectedAlcohol, setSelectedAlcohol] = useState<AlcoholResponse | null>(null);
  const [customAlcoholName, setCustomAlcoholName] = useState<string | null>(null);

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

  // 초기값: 기존 노트 데이터에서 가져옴
  const effectiveAlcohol: AlcoholResponse | null = selectedAlcohol ?? (
    note.alcoholId ? { id: note.alcoholId, name: note.alcoholName, nameKo: note.alcoholNameKo } : null
  );
  const effectiveCustomName = customAlcoholName ?? note.customAlcoholName ?? "";

  const handleSubmit = (data: NoteFormInput, photos: File[]) => {
    updateNote.mutate(
      {
        alcoholId: effectiveAlcohol?.id ?? undefined,
        customAlcoholName: effectiveAlcohol ? undefined : (effectiveCustomName || undefined),
        title: data.title || undefined,
        rating: data.rating,
        taste: data.taste || undefined,
        aroma: data.aroma || undefined,
        pairing: data.pairing || undefined,
        description: data.description || undefined,
        drankAt: data.drankAt || undefined,
        location: data.location || undefined,
        isPublic: data.isPublic ?? false,
      },
      {
        onSuccess: async () => {
          if (photos.length > 0) {
            await uploadNoteImages(noteId, photos).catch(() => {});
          }
          await queryClient.invalidateQueries({ queryKey: ["notes"] });
          toast("수정되었습니다");
          router.push(`/notes/${noteId}`);
        },
      }
    );
  };

  if (pickingAlcohol) {
    return (
      <AlcoholSearch
        onSelect={(selection: AlcoholSelection) => {
          if (selection.type === "search" && selection.alcohol) {
            setSelectedAlcohol(selection.alcohol);
            setCustomAlcoholName("");
          } else if (selection.type === "custom" && selection.customName) {
            setSelectedAlcohol(null);
            setCustomAlcoholName(selection.customName);
          }
          setPickingAlcohol(false);
        }}
        onBack={() => setPickingAlcohol(false)}
      />
    );
  }

  const isDraft = note.status === "DRAFT";

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex shrink-0 items-center border-b border-beige-dark px-5 pb-3 pt-4">
        <button
          onClick={() => router.back()}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/70"
        >
          <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
          </svg>
        </button>
        <span className="flex-1 text-center text-[16px] font-semibold text-ink">
          노트 수정
        </span>
        <div className="w-[34px]" />
      </header>

      <div className="flex-1 overflow-y-auto">
        <NoteForm
          selectedAlcohol={effectiveAlcohol}
          customAlcoholName={effectiveCustomName}
          onSearchAlcohol={() => setPickingAlcohol(true)}
          onCustomAlcoholNameChange={(name) => { setCustomAlcoholName(name); setSelectedAlcohol(null); }}
          onClearAlcohol={() => {
            setSelectedAlcohol(null);
            setCustomAlcoholName("");
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateNote.isPending}
          submitLabel="저장"
          existingImageUrls={note.imageUrls}
          defaultValues={{
            alcoholId: note.alcoholId,
            title: note.title ?? "",
            rating: note.rating ?? 0,
            taste: note.taste ?? "",
            aroma: note.aroma ?? "",
            pairing: note.pairing ?? "",
            description: note.description ?? "",
            drankAt: note.drankAt ?? "",
            location: note.location ?? "",
            isPublic: note.isPublic ?? false,
          }}
        />

        {isDraft && (
          <div className="px-5 pb-6">
            <Button
              variant="secondary"
              onClick={() => publishNote.mutate(noteId)}
              disabled={publishNote.isPending}
            >
              {publishNote.isPending ? "발행 중..." : "발행하기"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
