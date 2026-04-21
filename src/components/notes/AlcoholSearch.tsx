"use client";

import { useState, useEffect, useRef } from "react";
import { useAlcoholsByCategory, useAlcoholSearch } from "@/hooks/useAlcohols";
import type { components } from "@/types/api";

type AlcoholResponse = components["schemas"]["AlcoholResponse"];
type AlcoholCategory = NonNullable<AlcoholResponse["category"]>;

const CATEGORIES: { label: string; value: AlcoholCategory }[] = [
  { label: "\u{1F943} \uC704\uC2A4\uD0A4", value: "WHISKEY" },
  { label: "\u{1F377} \uC640\uC778", value: "WINE" },
  { label: "\u{1F37A} \uB9E5\uC8FC", value: "BEER" },
  { label: "\u{1F376} \uC0AC\uCF00", value: "SAKE" },
  { label: "\u{1F33E} \uB9C9\uAC78\uB9AC", value: "MAKGEOLLI" },
  { label: "\u{1FAD9} \uC18C\uC8FC", value: "SOJU" },
  { label: "\u{1F378} \uC9C4", value: "GIN" },
  { label: "\u{1F942} \uCE35\uD14C\uC77C", value: "COCKTAIL" },
  { label: "\u{1F37E} \uBE0C\uB79C\uB514", value: "BRANDY" },
  { label: "\uAE30\uD0C0", value: "ETC" },
];

const CATEGORY_ICONS: Record<string, string> = {
  WHISKEY: "\u{1F943}", WINE: "\u{1F377}", BEER: "\u{1F37A}", SAKE: "\u{1F376}",
  MAKGEOLLI: "\u{1F33E}", SOJU: "\u{1FAD9}", GIN: "\u{1F378}", RUM: "\u{1F3F9}",
  VODKA: "\u{1FAD7}", TEQUILA: "\u{1F335}", BRANDY: "\u{1F37E}", COCKTAIL: "\u{1F942}", ETC: "\u{1F377}",
};

export interface AlcoholSelection {
  type: "search" | "custom";
  alcohol?: AlcoholResponse;
  customName?: string;
}

interface AlcoholSearchProps {
  onSelect: (selection: AlcoholSelection) => void;
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

  const sentinelRef = useRef<HTMLDivElement>(null);

  const isSearching = debouncedKeyword.length >= 1;
  const activeQuery = isSearching ? searchQuery : categoryQuery;
  const alcohols = activeQuery.data?.pages.flatMap((p) => p.content) ?? [];
  const isLoading = activeQuery.isLoading;
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = activeQuery;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasNextPage) fetchNextPage(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

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
        {alcohols.map((alc) => (
          <button
            key={alc.id}
            onClick={() => onSelect({ type: "search", alcohol: alc })}
            className="flex w-full items-center gap-3.5 px-5 py-3.5 text-left active:bg-beige-mid/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-beige-mid text-[20px]">
              {CATEGORY_ICONS[alc.category ?? "ETC"]}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-ink">{alc.name}</p>
              <p className="mt-0.5 text-[12px] text-ink-muted">
                {alc.nameKo ?? ""}
                {alc.nameKo && alc.categoryKo ? " \xB7 " : ""}
                {alc.categoryKo ?? ""}
              </p>
            </div>
            <span className="rounded-pill bg-wine-pale px-2 py-0.5 text-[11px] font-medium text-wine">
              {alc.category}
            </span>
          </button>
        ))}

        {/* 직접 입력 옵션 — 검색어가 있을 때 항상 표시 */}
        {isSearching && !isLoading && (
          <button
            onClick={() => onSelect({ type: "custom", customName: keyword.trim() })}
            className="flex w-full items-center gap-3.5 border-t border-beige-mid px-5 py-4 text-left active:bg-beige-mid/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-dashed border-wine/40 text-[18px]">
              ✏️
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-wine">
                &quot;{keyword.trim()}&quot; 직접 입력
              </p>
              <p className="mt-0.5 text-[12px] text-ink-muted">
                목록에 없는 술을 직접 이름으로 기록합니다
              </p>
            </div>
          </button>
        )}

        {!isSearching && alcohols.length === 0 && !isLoading && (
          <div className="py-16 text-center text-[14px] text-ink-muted">
            카테고리를 선택하세요
          </div>
        )}
        <div ref={sentinelRef} className="h-1" />
        {isFetchingNextPage && (
          <div className="py-4 text-center text-[14px] text-ink-muted">
            불러오는 중...
          </div>
        )}
      </div>
    </div>
  );
}
