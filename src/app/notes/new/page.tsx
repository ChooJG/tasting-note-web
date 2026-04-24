"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateNote } from "@/hooks/useCreateNote";
import { toast } from "@/components/ui/Toast";
import { uploadNoteImages } from "@/lib/uploadImage";
import { useAuthStore } from "@/store/auth";
import AlcoholSearch from "@/components/notes/AlcoholSearch";
import type { AlcoholSelection } from "@/components/notes/AlcoholSearch";
import NoteForm from "@/components/notes/NoteForm";
import type { components } from "@/types/api";
import type { NoteFormInput } from "@/lib/validations/note";

type AlcoholResponse = components["schemas"]["AlcoholResponse"];

export default function NewNotePage() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const [pickingAlcohol, setPickingAlcohol] = useState(false);

  useEffect(() => {
    if (hasHydrated && !isLoggedIn) {
      router.replace("/login?callbackUrl=/notes/new");
    }
  }, [hasHydrated, isLoggedIn, router]);
  const [selectedAlcohol, setSelectedAlcohol] = useState<AlcoholResponse | null>(null);
  const [customAlcoholName, setCustomAlcoholName] = useState("");
  const queryClient = useQueryClient();
  const createNote = useCreateNote();

  const handleAlcoholSelect = (selection: AlcoholSelection) => {
    if (selection.type === "search" && selection.alcohol) {
      setSelectedAlcohol(selection.alcohol);
      setCustomAlcoholName("");
    } else if (selection.type === "custom" && selection.customName) {
      setSelectedAlcohol(null);
      setCustomAlcoholName(selection.customName);
    }
    setPickingAlcohol(false);
  };

  const handleClearAlcohol = () => {
    setSelectedAlcohol(null);
    setCustomAlcoholName("");
  };

  const handleSubmit = (data: NoteFormInput, photos: File[]) => {
    const finalCustomName = customAlcoholName || data.customAlcoholName;
    createNote.mutate(
      {
        alcoholId: selectedAlcohol?.id ?? undefined,
        customAlcoholName: selectedAlcohol ? undefined : (finalCustomName || undefined),
        title: data.title || undefined,
        rating: data.rating,
        taste: data.taste || undefined,
        aroma: data.aroma || undefined,
        pairing: data.pairing || undefined,
        description: data.description || undefined,
        drankAt: data.drankAt || undefined,
        location: data.location || undefined,
        isPublic: data.isPublic,
      },
      {
        onSuccess: async (note) => {
          if (photos.length > 0 && note.id) {
            await uploadNoteImages(note.id, photos).catch(() => {});
          }
          await queryClient.invalidateQueries({ queryKey: ["notes"] });
          toast("노트가 저장되었습니다");
          router.push(`/notes/${note.id}`);
        },
      }
    );
  };

  const handleDraft = () => {
    toast("임시저장 되었습니다");
  };

  // 술 검색 화면
  if (pickingAlcohol) {
    return (
      <AlcoholSearch
        onSelect={handleAlcoholSelect}
        onBack={() => setPickingAlcohol(false)}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
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
          노트 작성
        </span>
        <button
          onClick={handleDraft}
          className="text-[14px] font-medium text-wine"
        >
          저장
        </button>
      </header>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <NoteForm
          selectedAlcohol={selectedAlcohol}
          customAlcoholName={customAlcoholName}
          onCustomAlcoholNameChange={setCustomAlcoholName}
          onSearchAlcohol={() => setPickingAlcohol(true)}
          onClearAlcohol={handleClearAlcohol}
          onSubmit={handleSubmit}
          isSubmitting={createNote.isPending}
        />
      </div>
    </div>
  );
}
