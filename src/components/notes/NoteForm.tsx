"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteFormSchema, type NoteFormInput } from "@/lib/validations/note";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import FlavorPicker from "./FlavorPicker";
import type { components } from "@/types/api";

type AlcoholResponse = components["schemas"]["AlcoholResponse"];

const CATEGORY_ICONS: Record<string, string> = {
  WHISKEY: "🥃", WINE: "🍷", BEER: "🍺", SAKE: "🍶",
  MAKGEOLLI: "🌾", SOJU: "🫙", GIN: "🍸", RUM: "🍹",
  VODKA: "🫗", TEQUILA: "🌵", BRANDY: "🍾", COCKTAIL: "🥂", ETC: "🍷",
};

interface NoteFormProps {
  alcohol: AlcoholResponse;
  onChangeAlcohol: () => void;
  onSubmit: (data: NoteFormInput) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<NoteFormInput>;
  submitLabel?: string;
}

export default function NoteForm({
  alcohol,
  onChangeAlcohol,
  onSubmit,
  isSubmitting,
  defaultValues,
  submitLabel = "저장하기",
}: NoteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NoteFormInput>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      alcoholId: alcohol.id!,
      rating: 0,
      tasteIds: [],
      aromaIds: [],
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pb-6">
      {/* Selected alcohol */}
      <div className="px-5">
        <h3 className="mb-3 mt-6 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          선택한 술
        </h3>
        <button
          type="button"
          onClick={onChangeAlcohol}
          className="flex w-full items-center gap-3 rounded-card border-[1.5px] border-beige-dark bg-white p-3.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-beige-mid text-[18px]">
            {CATEGORY_ICONS[alcohol.category ?? "ETC"]}
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-medium text-ink">{alcohol.name}</p>
            <p className="mt-0.5 text-[12px] text-ink-muted">
              {alcohol.nameKo ?? ""}{alcohol.nameKo && alcohol.categoryKo ? " · " : ""}{alcohol.categoryKo ?? ""}
            </p>
          </div>
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="#9A8060" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <div className="mt-6 px-5">
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          제목
        </h3>
        <Input
          placeholder="이 술을 한 마디로 표현하면?"
          {...register("title")}
        />
      </div>

      {/* Rating */}
      <div className="mt-6 px-5">
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          평점
        </h3>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => field.onChange(star)}
                  className={`text-[28px] ${star <= field.value ? "text-rating" : "text-beige-dark"}`}
                >
                  ★
                </button>
              ))}
            </div>
          )}
        />
        {errors.rating && (
          <p className="mt-1 text-[12px] text-red-500">{errors.rating.message}</p>
        )}
      </div>

      {/* Aroma */}
      <div className="mt-6 px-5">
        <Controller
          name="aromaIds"
          control={control}
          render={({ field }) => (
            <FlavorPicker
              label="향 (Aroma)"
              selectedIds={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.aromaIds && (
          <p className="mt-1 text-[12px] text-red-500">{errors.aromaIds.message}</p>
        )}
      </div>

      {/* Taste */}
      <div className="mt-6 px-5">
        <Controller
          name="tasteIds"
          control={control}
          render={({ field }) => (
            <FlavorPicker
              label="맛 (Taste)"
              selectedIds={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.tasteIds && (
          <p className="mt-1 text-[12px] text-red-500">{errors.tasteIds.message}</p>
        )}
      </div>

      {/* Pairing */}
      <div className="mt-6 px-5">
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          페어링
        </h3>
        <Input placeholder="어울리는 음식은?" {...register("pairing")} />
      </div>

      {/* Description */}
      <div className="mt-6 px-5">
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          메모
        </h3>
        <Textarea placeholder="자유롭게 기록해보세요" {...register("description")} />
      </div>

      {/* Date */}
      <div className="mt-6 px-5">
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          마신 날짜
        </h3>
        <Input type="date" {...register("drankAt")} />
      </div>

      {/* Location */}
      <div className="mt-6 px-5">
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          장소
        </h3>
        <Input placeholder="어디서 마셨나요?" {...register("location")} />
      </div>

      {/* Submit */}
      <div className="mt-6 px-5">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
