"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteFormSchema, type NoteFormInput } from "@/lib/validations/note";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { components } from "@/types/api";

type AlcoholResponse = components["schemas"]["AlcoholResponse"];

const CATEGORY_ICONS: Record<string, string> = {
  WHISKEY: "\u{1F943}", WINE: "\u{1F377}", BEER: "\u{1F37A}", SAKE: "\u{1F376}",
  MAKGEOLLI: "\u{1F33E}", SOJU: "\u{1FAD9}", GIN: "\u{1F378}", RUM: "\u{1F3F9}",
  VODKA: "\u{1FAD7}", TEQUILA: "\u{1F335}", BRANDY: "\u{1F37E}", COCKTAIL: "\u{1F942}", ETC: "\u{1F377}",
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
  submitLabel = "\uC800\uC7A5\uD558\uAE30",
}: NoteFormProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NoteFormInput>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      alcoholId: alcohol.id,
      rating: 0,
      taste: "",
      aroma: "",
      isPublic: false,
      ...defaultValues,
    },
  });

  const ratingValue = watch("rating");

  const handlePhotoAdd = () => {
    if (photos.length < 3) {
      setPhotos([...photos, ""]);
    }
  };

  const handlePhotoRemove = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pb-6">
      {/* 술 선택 */}
      <div className="px-5">
        <h3 className="mb-2.5 mt-5 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          술 선택
        </h3>
        <button
          type="button"
          onClick={onChangeAlcohol}
          className="flex w-full items-center gap-3 rounded-input border-[1.5px] border-beige-dark bg-white p-3 text-left"
        >
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px] bg-beige-mid text-[17px]">
            {CATEGORY_ICONS[alcohol.category ?? "ETC"]}
          </div>
          <div className="flex-1">
            <p className="text-[14.5px] font-medium text-ink">{alcohol.nameKo ?? alcohol.name}</p>
            <p className="mt-0.5 text-[12px] text-ink-muted">
              {alcohol.name}{alcohol.categoryKo ? ` \xB7 ${alcohol.categoryKo}` : ""}
            </p>
          </div>
          <span className="text-[16px] text-ink-muted">\u2715</span>
        </button>
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* 별점 */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          별점 *
        </h3>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue("rating", star, { shouldValidate: true })}
              className={`text-[32px] leading-none ${star <= ratingValue ? "text-rating" : "text-beige-dark"}`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-[15px] font-medium text-ink-soft">
            {ratingValue > 0 ? `${ratingValue.toFixed(1)} / 5.0` : ""}
          </span>
        </div>
        {errors.rating && (
          <p className="mt-1 text-[12px] text-red-500">{errors.rating.message}</p>
        )}
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* 제목 */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          제목
        </h3>
        <Input placeholder="노트 제목" maxLength={100} {...register("title")} />
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* 맛 (Taste) - 자유 텍스트 */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          맛 (Taste)
        </h3>
        <Input
          placeholder="바닐라, 피트, 달콤 ..."
          {...register("taste")}
        />
        <p className="mt-1 text-[11px] text-ink-muted">쉼표로 구분해서 입력하세요</p>
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* 향 (Aroma) - 자유 텍스트 */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          향 (Aroma)
        </h3>
        <Input
          placeholder="스모키, 오크, 꽃향 ..."
          {...register("aroma")}
        />
        <p className="mt-1 text-[11px] text-ink-muted">쉼표로 구분해서 입력하세요</p>
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* 사진 */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          사진 (최대 3장)
        </h3>
        <div className="flex gap-2.5">
          {photos.map((_, idx) => (
            <div
              key={idx}
              className="relative flex h-[86px] w-[86px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-beige-mid"
            >
              <span className="text-[22px] text-beige-dark">{CATEGORY_ICONS[alcohol.category ?? "ETC"]}</span>
              <button
                type="button"
                onClick={() => handlePhotoRemove(idx)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-[11px] text-white"
              >
                ✕
              </button>
            </div>
          ))}
          {photos.length < 3 && (
            <button
              type="button"
              onClick={handlePhotoAdd}
              className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-[12px] border-[1.5px] border-dashed border-beige-dark bg-white/70"
            >
              <span className="text-[22px] text-beige-dark">+</span>
            </button>
          )}
        </div>
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* 테이스팅 노트 */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          테이스팅 노트
        </h3>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="이 술에 대한 인상을 자유롭게 적어주세요"
          className="w-full resize-none rounded-input border-[1.5px] border-beige-dark bg-white/65 px-3.5 py-3 text-[15px] font-light leading-[1.65] text-ink placeholder:text-ink-muted focus:border-wine-light focus:bg-white/90 focus:outline-none"
        />
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* 더 보기 (collapsible) */}
      <button
        type="button"
        onClick={() => setMoreOpen(!moreOpen)}
        className="flex items-center justify-between border-b border-t border-beige-mid px-5 py-3.5"
      >
        <span className="text-[14px] font-medium text-ink-soft">더 보기</span>
        <span className={`text-[16px] text-ink-muted transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${moreOpen ? "max-h-[400px]" : "max-h-0"}`}
      >
        <div className="space-y-3.5 px-5 py-4">
          <div>
            <label className="mb-1.5 block text-[11.5px] font-medium uppercase tracking-[0.07em] text-ink-soft">
              페어링
            </label>
            <Input placeholder="어울리는 음식/안주" {...register("pairing")} />
          </div>
          <div>
            <label className="mb-1.5 block text-[11.5px] font-medium uppercase tracking-[0.07em] text-ink-soft">
              장소
            </label>
            <Input placeholder="어디서 마셨나요?" maxLength={100} {...register("location")} />
          </div>
          <div>
            <label className="mb-1.5 block text-[11.5px] font-medium uppercase tracking-[0.07em] text-ink-soft">
              마신 날짜
            </label>
            <Input type="date" {...register("drankAt")} />
          </div>
        </div>
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* 공개 여부 토글 */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          공개 여부
        </h3>
        <div className="flex items-center justify-between rounded-input border-[1.5px] border-beige-dark bg-white px-3.5 py-3.5">
          <span className="text-[15px] text-ink">공개 노트로 발행</span>
          <button
            type="button"
            onClick={() => setValue("isPublic", !watch("isPublic"))}
            className={`relative h-[27px] w-[46px] rounded-full transition-colors ${watch("isPublic") ? "bg-wine" : "bg-beige-dark"}`}
          >
            <div
              className={`absolute top-[3px] h-[21px] w-[21px] rounded-full bg-white transition-[left] ${watch("isPublic") ? "left-[22px]" : "left-[3px]"}`}
            />
          </button>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="mt-5 px-5">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
