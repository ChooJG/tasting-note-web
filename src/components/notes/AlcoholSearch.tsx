"use client";

import { useState, useEffect } from "react";
import { useAlcoholsByCategory, useAlcoholSearch } from "@/hooks/useAlcohols";
import type { components } from "@/types/api";

type AlcoholResponse = components["schemas"]["AlcoholResponse"];
type AlcoholCategory = NonNullable<AlcoholResponse["category"]>;

const CATEGORIES: { label: string; value: AlcoholCategory }[] = [
  { label: "🥃 위스키", value: "WHISKEY" },
  { label: "🍷 와인", value: "WINE" },
  { label: "🍺 맥주", value: "BEER" },
  { label: "🍶 사케", value: "SAKE" },
  { label: "🌾 막걸리", value: "MAKGEOLLI" },
  { label: "🫙 소주", value: "SOJU" },
  { label: "🍸 진", value: "GIN" },
  { label: "🥂 칵테일", value: "COCKTAIL" },
  { label: "🍾 브랜디", value: "BRANDY" },
  { label: "기타", value: "ETC" },
];

const CATEGORY_ICONS: Record<string, string> = {
  WHISKEY: "🥃", WINE: "🍷", BEER: "🍺", SAKE: "🍶",
  MAKGEOLLI: "🌾", SOJU: "🫙", GIN: "🍸", RUM: "🍹",
  VODKA: "🫗", TEQUILA: "🌵", BRANDY: "🍾", COCKTAIL: "🥂", ETC: "🍷",
};

interface AlcoholSearchProps {
  onSelect: (alcohol: AlcoholResponse) => void;
  onBack: () => void;
}

export default function AlcoholSearch({ onSelect, onBack }: AlcoholSearchProps) {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AlcoholCategory | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const searchQuery = useAlcoholSearch(debouncedKeyword);
  const categoryQuery = useAlcoholsByCategory(
    debouncedKeyword ? null : selectedCategory
  );

  const isSearching = debouncedKeyword.length >= 1;
  const alcohols = isSearching ? searchQuery.data : categoryQuery.data;
  const isLoading = isSearching ? searchQuery.isLoading : categoryQuery.isLoading;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="flex shrink-0 items-center px-5 pb-3 pt-4">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
        >
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4L6 9L11 14" />
          </svg>
        </button>
        <span className="flex-1 text-center text-[17px] font-semibold text-ink">
          술 선택
        </span>
        <div className="w-9" />
      </header>

      {/* Search */}
      <div className="shrink-0 px-4 pb-3">
        <div className="flex items-center gap-2.5 rounded-input border-[1.5px] border-beige-dark bg-white/70 px-3.5 py-[11px]">
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <circle cx={7} cy={7} r={5} stroke="#9A8060" strokeWidth={1.5} />
            <path d="M11 11L14 14" stroke="#9A8060" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="이름으로 검색…"
            className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-muted"
          />
        </div>
      </div>

      {/* Category chips */}
      {!isSearching && (
        <div className="flex shrink-0 gap-2 overflow-x-auto px-4 pb-4 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(
                selectedCategory === cat.value ? null : cat.value
              )}
              className={`shrink-0 rounded-pill border-[1.5px] px-4 py-[7px] text-[13px] transition-colors ${
                selectedCategory === cat.value
                  ? "border-wine bg-wine text-beige"
                  : "border-beige-dark bg-white/60 text-ink-soft"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="py-16 text-center text-[14px] text-ink-muted">
            검색 중...
          </div>
        )}
        {alcohols?.map((alc) => (
          <button
            key={alc.id}
            onClick={() => onSelect(alc)}
            className="flex w-full items-center gap-3.5 px-5 py-3.5 text-left active:bg-beige-mid/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-beige-mid text-[20px]">
              {CATEGORY_ICONS[alc.category ?? "ETC"]}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-ink">{alc.name}</p>
              <p className="mt-0.5 text-[12px] text-ink-muted">
                {alc.nameKo ?? ""}
                {alc.nameKo && alc.categoryKo ? " · " : ""}
                {alc.categoryKo ?? ""}
              </p>
            </div>
            <span className="rounded-pill bg-wine-pale px-2 py-0.5 text-[11px] font-medium text-wine">
              {alc.category}
            </span>
          </button>
        ))}
        {alcohols && alcohols.length === 0 && (
          <div className="py-16 text-center text-[14px] text-ink-muted">
            결과가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
