"use client";

import { useRef, useState, type KeyboardEvent } from "react";
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

const TASTE_SUGGESTIONS = [
  "바닐라", "꿀", "캐러멜", "초콜릿",
  "시트러스", "견과류", "피트",
  "달콤", "쌉쌀함", "스파이시",
];

const AROMA_SUGGESTIONS = [
  "스모키", "오크", "바닐라",
  "꽃향", "과일향", "허브",
  "피트", "가죽", "요오드", "토피",
];

interface PhotoItem {
  file?: File;
  preview: string;
  isExisting?: boolean;
}

interface NoteFormProps {
  selectedAlcohol: AlcoholResponse | null;
  customAlcoholName: string;
  onCustomAlcoholNameChange: (name: string) => void;
  onSearchAlcohol: () => void;
  onClearAlcohol: () => void;
  onSubmit: (data: NoteFormInput, photos: File[]) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<NoteFormInput>;
  submitLabel?: string;
  existingImageUrls?: string[];
}

export default function NoteForm({
  selectedAlcohol,
  customAlcoholName,
  onCustomAlcoholNameChange,
  onSearchAlcohol,
  onClearAlcohol,
  onSubmit,
  isSubmitting,
  defaultValues,
  submitLabel = "저장하기",
  existingImageUrls,
}: NoteFormProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    if (existingImageUrls && existingImageUrls.length > 0) {
      return existingImageUrls.map((url) => ({ preview: url, isExisting: true }));
    }
    return [];
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<NoteFormInput>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      alcoholId: selectedAlcohol?.id,
      rating: 0,
      taste: "",
      aroma: "",
      isPublic: false,
      ...defaultValues,
    },
  });

  const ratingValue = watch("rating");
  const hasAlcohol = selectedAlcohol !== null || customAlcoholName.length > 0;

  // ── 해시태그 state ──
  const [tasteTags, setTasteTags] = useState<string[]>(() => {
    const v = defaultValues?.taste ?? "";
    return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
  });
  const [aromaTags, setAromaTags] = useState<string[]>(() => {
    const v = defaultValues?.aroma ?? "";
    return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
  });
  const [tasteInput, setTasteInput] = useState("");
  const [aromaInput, setAromaInput] = useState("");

  const syncTaste = (tags: string[]) => {
    setTasteTags(tags);
    setValue("taste", tags.join(", "));
  };
  const syncAroma = (tags: string[]) => {
    setAromaTags(tags);
    setValue("aroma", tags.join(", "));
  };

  const addTag = (field: "taste" | "aroma", tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (field === "taste") {
      if (!tasteTags.includes(trimmed)) syncTaste([...tasteTags, trimmed]);
      setTasteInput("");
    } else {
      if (!aromaTags.includes(trimmed)) syncAroma([...aromaTags, trimmed]);
      setAromaInput("");
    }
  };

  const removeTag = (field: "taste" | "aroma", tag: string) => {
    if (field === "taste") syncTaste(tasteTags.filter((t) => t !== tag));
    else syncAroma(aromaTags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (field: "taste" | "aroma", e: KeyboardEvent<HTMLInputElement>) => {
    const value = field === "taste" ? tasteInput : aromaInput;
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(field, value);
    }
    if (e.key === "Backspace" && value === "") {
      if (field === "taste" && tasteTags.length > 0) syncTaste(tasteTags.slice(0, -1));
      if (field === "aroma" && aromaTags.length > 0) syncAroma(aromaTags.slice(0, -1));
    }
  };

  const toggleSuggestion = (field: "taste" | "aroma", tag: string) => {
    const tags = field === "taste" ? tasteTags : aromaTags;
    if (tags.includes(tag)) removeTag(field, tag);
    else addTag(field, tag);
  };

  // ── 반개 단위 별점 ──
  const handleStarClick = (starIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeftHalf = clickX < rect.width / 2;
    const newRating = isLeftHalf ? starIndex - 0.5 : starIndex;
    setValue("rating", newRating, { shouldValidate: true });
  };

  const renderStarFill = (starIndex: number) => {
    if (ratingValue >= starIndex) return "full";
    if (ratingValue >= starIndex - 0.5) return "half";
    return "none";
  };

  // ── 사진 ──
  const handlePhotoSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 3 - photos.length;
    const newFiles = Array.from(files).slice(0, remaining);
    const newPhotos: PhotoItem[] = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  };

  const handlePhotoRemove = (idx: number) => {
    setPhotos((prev) => {
      if (!prev[idx].isExisting) URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const onFormSubmit = async (data: NoteFormInput) => {
    if (photos.length === 0) {
      onSubmit(data, []);
      return;
    }
    // 모든 사진을 File로 변환 (기존 URL은 프록시 경유, 새 파일은 그대로)
    const files: File[] = await Promise.all(
      photos.map(async (p, i) => {
        if (p.file) return p.file;
        // 기존 이미지 URL → 프록시로 가져와서 File 변환
        const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(p.preview)}`);
        const blob = await res.blob();
        const ext = blob.type.split("/")[1] ?? "jpg";
        return new File([blob], `existing_${i}.${ext}`, { type: blob.type });
      })
    );
    onSubmit(data, files);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit, (errors) => console.log("Form validation errors:", errors))} className="flex flex-col pb-6">
      {/* ── 술 선택 ── */}
      <div className="px-5">
        <h3 className="mb-2.5 mt-5 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          어떤 술을 마셨나요? *
        </h3>

        {selectedAlcohol ? (
          <div className="flex items-center gap-3 rounded-input border-[1.5px] border-beige-dark bg-white p-3">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px] bg-beige-mid text-[17px]">
              {CATEGORY_ICONS[selectedAlcohol.category ?? "ETC"]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14.5px] font-medium text-ink">
                {selectedAlcohol.nameKo ?? selectedAlcohol.name}
              </p>
              <p className="mt-0.5 truncate text-[12px] text-ink-muted">
                {selectedAlcohol.name}
                {selectedAlcohol.categoryKo ? ` \xB7 ${selectedAlcohol.categoryKo}` : ""}
              </p>
            </div>
            <button type="button" onClick={onClearAlcohol} className="shrink-0 text-[16px] text-ink-muted">
              ✕
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={customAlcoholName}
              onChange={(e) => onCustomAlcoholNameChange(e.target.value)}
              placeholder="술 이름을 직접 입력"
              className="flex-1 rounded-input border-[1.5px] border-beige-dark bg-white/65 px-3.5 py-3 text-[15px] font-light text-ink placeholder:text-ink-muted focus:border-wine-light focus:bg-white/90 focus:outline-none"
            />
            <button
              type="button"
              onClick={onSearchAlcohol}
              className="shrink-0 rounded-input border-[1.5px] border-wine bg-wine-pale px-3.5 py-3 text-[13px] font-medium text-wine"
            >
              검색
            </button>
          </div>
        )}
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* ── 별점 (반개 단위) ── */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          별점 *
        </h3>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const fill = renderStarFill(star);
            return (
              <button
                key={star}
                type="button"
                onClick={(e) => handleStarClick(star, e)}
                className="relative cursor-pointer text-[32px] leading-none select-none"
              >
                <span className="text-beige-dark">★</span>
                <span
                  className="absolute left-0 top-0 overflow-hidden text-rating"
                  style={{ width: fill === "full" ? "100%" : fill === "half" ? "50%" : "0%" }}
                >
                  ★
                </span>
              </button>
            );
          })}
          <span className="ml-2 text-[15px] font-medium text-ink-soft">
            {ratingValue > 0 ? `${ratingValue.toFixed(1)} / 5.0` : ""}
          </span>
        </div>
        {errors.rating && (
          <p className="mt-1 text-[12px] text-red-500">{errors.rating.message}</p>
        )}
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* ── 제목 ── */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          제목
        </h3>
        <Input
          {...register("title")}
          placeholder="이 술을 한 마디로 표현하면?"
          maxLength={100}
        />
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* ── 맛 (해시태그) ── */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          맛 (Taste)
        </h3>
        <input type="hidden" {...register("taste")} />
        <div className="flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-input border-[1.5px] border-beige-dark bg-white/65 px-2.5 py-2 focus-within:border-wine-light focus-within:bg-white/90">
          {tasteTags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-pill bg-wine px-2.5 py-[3px] text-[13px] font-medium text-beige">
              #{tag}
              <button type="button" onClick={() => removeTag("taste", tag)} className="flex h-4 w-4 items-center justify-center rounded-full bg-beige/25 text-[11px] leading-none text-beige">×</button>
            </span>
          ))}
          <input
            value={tasteInput}
            onChange={(e) => setTasteInput(e.target.value)}
            onKeyDown={(e) => handleTagKeyDown("taste", e)}
            placeholder={tasteTags.length === 0 ? "태그 입력 후 Enter" : ""}
            className="min-w-[80px] flex-1 border-none bg-transparent px-1 py-1 text-[14px] font-light text-ink outline-none placeholder:text-ink-muted"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-[6px]">
          <span className="mr-0.5 text-[11px] font-medium text-ink-muted">추천</span>
          {TASTE_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleSuggestion("taste", tag)}
              className={`rounded-pill border px-2.5 py-[3px] text-[12.5px] transition-colors ${
                tasteTags.includes(tag)
                  ? "border-wine bg-wine text-beige"
                  : "border-beige-dark bg-white/60 text-ink-soft hover:border-wine hover:text-wine"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* ── 향 (해시태그) ── */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          향 (Aroma)
        </h3>
        <input type="hidden" {...register("aroma")} />
        <div className="flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-input border-[1.5px] border-beige-dark bg-white/65 px-2.5 py-2 focus-within:border-wine-light focus-within:bg-white/90">
          {aromaTags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-pill bg-wine px-2.5 py-[3px] text-[13px] font-medium text-beige">
              #{tag}
              <button type="button" onClick={() => removeTag("aroma", tag)} className="flex h-4 w-4 items-center justify-center rounded-full bg-beige/25 text-[11px] leading-none text-beige">×</button>
            </span>
          ))}
          <input
            value={aromaInput}
            onChange={(e) => setAromaInput(e.target.value)}
            onKeyDown={(e) => handleTagKeyDown("aroma", e)}
            placeholder={aromaTags.length === 0 ? "태그 입력 후 Enter" : ""}
            className="min-w-[80px] flex-1 border-none bg-transparent px-1 py-1 text-[14px] font-light text-ink outline-none placeholder:text-ink-muted"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-[6px]">
          <span className="mr-0.5 text-[11px] font-medium text-ink-muted">추천</span>
          {AROMA_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleSuggestion("aroma", tag)}
              className={`rounded-pill border px-2.5 py-[3px] text-[12.5px] transition-colors ${
                aromaTags.includes(tag)
                  ? "border-wine bg-wine text-beige"
                  : "border-beige-dark bg-white/60 text-ink-soft hover:border-wine hover:text-wine"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* ── 사진 (실제 파일 첨부) ── */}
      <div className="px-5">
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          사진 (최대 3장)
        </h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex gap-2.5">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-[12px]"
            >
              <img
                src={photo.preview}
                alt=""
                className="h-full w-full object-cover"
              />
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
              onClick={handlePhotoSelect}
              className="flex h-[86px] w-[86px] shrink-0 flex-col items-center justify-center gap-1 rounded-[12px] border-[1.5px] border-dashed border-beige-dark bg-white/70"
            >
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="#D9CFBF" strokeWidth={1.5}>
                <rect x={2} y={4} width={16} height={13} rx={2} />
                <circle cx={7} cy={9} r={1.5} />
                <path d="M2 14L7 10L10 13L14 9L18 13" strokeLinejoin="round" />
              </svg>
              <span className="text-[11px] text-ink-muted">추가</span>
            </button>
          )}
        </div>
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* ── 테이스팅 노트 ── */}
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

      {/* ── 더 보기 ── */}
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
      <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${moreOpen ? "max-h-[400px]" : "max-h-0"}`}>
        <div className="space-y-3.5 px-5 py-4">
          <div>
            <label className="mb-1.5 block text-[11.5px] font-medium uppercase tracking-[0.07em] text-ink-soft">페어링</label>
            <Input placeholder="어울리는 음식/안주" {...register("pairing")} />
          </div>
          <div>
            <label className="mb-1.5 block text-[11.5px] font-medium uppercase tracking-[0.07em] text-ink-soft">장소</label>
            <Input placeholder="어디서 마셨나요?" maxLength={100} {...register("location")} />
          </div>
          <div>
            <label className="mb-1.5 block text-[11.5px] font-medium uppercase tracking-[0.07em] text-ink-soft">마신 날짜</label>
            <Input type="date" {...register("drankAt")} />
          </div>
        </div>
      </div>

      <div className="my-4 h-2 bg-beige-mid" />

      {/* ── 공개 여부 ── */}
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
            <div className={`absolute top-[3px] h-[21px] w-[21px] rounded-full bg-white transition-[left] ${watch("isPublic") ? "left-[22px]" : "left-[3px]"}`} />
          </button>
        </div>
      </div>

      {/* ── 저장 버튼 ── */}
      <div className="mt-5 px-5">
        <Button type="submit" disabled={isSubmitting || !hasAlcohol}>
          {isSubmitting ? "저장 중..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
