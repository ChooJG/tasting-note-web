"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateNote } from "@/hooks/useCreateNote";
import { toast } from "@/components/ui/Toast";
import AlcoholSearch from "@/components/notes/AlcoholSearch";
import NoteForm from "@/components/notes/NoteForm";
import type { components } from "@/types/api";
import type { NoteFormInput } from "@/lib/validations/note";

type AlcoholResponse = components["schemas"]["AlcoholResponse"];

type Step = "search" | "form";

export default function NewNotePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("search");
  const [selectedAlcohol, setSelectedAlcohol] = useState<AlcoholResponse | null>(null);
  const createNote = useCreateNote();

  const handleSelectAlcohol = (alcohol: AlcoholResponse) => {
    setSelectedAlcohol(alcohol);
    setStep("form");
  };

  const handleSubmit = (data: NoteFormInput) => {
    createNote.mutate({
      alcoholId: data.alcoholId,
      title: data.title || undefined,
      rating: data.rating,
      tasteIds: data.tasteIds,
      aromaIds: data.aromaIds,
      pairing: data.pairing || undefined,
      description: data.description || undefined,
      drankAt: data.drankAt || undefined,
      location: data.location || undefined,
    });
  };

  const handleDraft = () => {
    toast("임시저장 되었습니다");
  };

  if (step === "search") {
    return (
      <AlcoholSearch
        onSelect={handleSelectAlcohol}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="flex shrink-0 items-center px-5 pb-3 pt-4">
        <button
          onClick={() => setStep("search")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
        >
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4L6 9L11 14" />
          </svg>
        </button>
        <span className="flex-1 text-center text-[17px] font-semibold text-ink">
          노트 작성
        </span>
        <button
          onClick={handleDraft}
          className="text-[13px] font-medium text-wine"
        >
          임시저장
        </button>
      </header>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <NoteForm
          alcohol={selectedAlcohol!}
          onChangeAlcohol={() => setStep("search")}
          onSubmit={handleSubmit}
          isSubmitting={createNote.isPending}
        />
      </div>
    </div>
  );
}
