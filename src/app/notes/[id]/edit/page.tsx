"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useNote } from "@/hooks/useNotes";
import { useUpdateNote } from "@/hooks/useUpdateNote";
import { usePublishNote } from "@/hooks/useNoteMutations";
import NoteForm from "@/components/notes/NoteForm";
import AlcoholSearch from "@/components/notes/AlcoholSearch";
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

  const { data: note, isLoading } = useNote(noteId);
  const updateNote = useUpdateNote(noteId);
  const publishNote = usePublishNote();

  const [pickingAlcohol, setPickingAlcohol] = useState(false);
  const [alcohol, setAlcohol] = useState<AlcoholResponse | null>(null);

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

  const currentAlcohol: AlcoholResponse = alcohol ?? {
    id: note.alcoholId,
    name: note.alcoholName,
    nameKo: note.alcoholNameKo,
  };

  const handleSubmit = (data: NoteFormInput) => {
    updateNote.mutate({
      alcoholId: data.alcoholId,
      customAlcoholName: data.customAlcoholName,
      title: data.title || undefined,
      rating: data.rating,
      taste: data.taste || undefined,
      aroma: data.aroma || undefined,
      pairing: data.pairing || undefined,
      description: data.description || undefined,
      drankAt: data.drankAt || undefined,
      location: data.location || undefined,
      isPublic: data.isPublic ?? false,
    });
  };

  const handlePublish = () => {
    publishNote.mutate(noteId);
  };

  if (pickingAlcohol) {
    return (
      <AlcoholSearch
        onSelect={(alc) => {
          setAlcohol(alc);
          setPickingAlcohol(false);
        }}
        onBack={() => setPickingAlcohol(false)}
      />
    );
  }

  const isDraft = note.status === "DRAFT";

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="flex shrink-0 items-center px-5 pb-3 pt-4">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
        >
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4L6 9L11 14" />
          </svg>
        </button>
        <span className="flex-1 text-center text-[17px] font-semibold text-ink">
          노트 수정
        </span>
        <div className="w-9" />
      </header>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <NoteForm
          alcohol={currentAlcohol}
          onChangeAlcohol={() => setPickingAlcohol(true)}
          onSubmit={handleSubmit}
          isSubmitting={updateNote.isPending}
          submitLabel="저장"
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
              onClick={handlePublish}
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
