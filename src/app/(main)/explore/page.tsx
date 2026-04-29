"use client";

import { useState, useEffect, useRef } from "react";
import { useAlcoholsByCategory, useAlcoholSearch } from "@/hooks/useAlcohols";
import type { components } from "@/types/api";

type AlcoholCategory = NonNullable<components["schemas"]["AlcoholResponse"]["category"]>;

const CATEGORIES: { key: AlcoholCategory; emoji: string; label: string }[] = [
  { key: "WHISKEY", emoji: "🥃", label: "위스키" },
  { key: "WINE", emoji: "🍷", label: "와인" },
  { key: "BEER", emoji: "🍺", label: "맥주" },
  { key: "SOJU", emoji: "🫙", label: "소주" },
  { key: "MAKGEOLLI", emoji: "🌾", label: "막걸리" },
  { key: "SAKE", emoji: "🍶", label: "사케" },
  { key: "VODKA", emoji: "🫗", label: "보드카" },
  { key: "GIN", emoji: "🍸", label: "진" },
  { key: "RUM", emoji: "🏴‍☠️", label: "럼" },
  { key: "TEQUILA", emoji: "🌵", label: "테킬라" },
  { key: "BRANDY", emoji: "🥃", label: "브랜디" },
  { key: "COCKTAIL", emoji: "🍹", label: "칵테일" },
  { key: "ETC", emoji: "🍾", label: "기타" },
];

const CATEGORY_ICONS: Record<string, string> = {
  WHISKEY: "🥃", WINE: "🍷", BEER: "🍺", SAKE: "🍶",
  MAKGEOLLI: "🌾", SOJU: "🫙", GIN: "🍸", RUM: "🏴‍☠️",
  VODKA: "🫗", TEQUILA: "🌵", BRANDY: "🥃", COCKTAIL: "🍹", ETC: "🍾",
};

type View = "categories" | "results";

export default function ExplorePage() {
  const [view, setView] = useState<View>("categories");
  const [selectedCat, setSelectedCat] = useState<AlcoholCategory | null>(null);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const isSearching = debouncedKeyword.length >= 1;

  const searchQuery = useAlcoholSearch(debouncedKeyword, view === "results" ? selectedCat : null);
  const categoryQuery = useAlcoholsByCategory(
    isSearching ? null : (view === "results" ? selectedCat : null)
  );

  const activeQuery = isSearching ? searchQuery : categoryQuery;
  const alcohols = activeQuery.data?.pages.flatMap((p) => p.content) ?? [];
  const isLoading = activeQuery.isLoading;
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = activeQuery;

  const sentinelRef = useRef<HTMLDivElement>(null);
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

  const selectedCategory = CATEGORIES.find((c) => c.key === selectedCat);

  const handleCategoryClick = (key: AlcoholCategory) => {
    setSelectedCat(key);
    setView("results");
    setKeyword("");
    setDebouncedKeyword("");
  };

  const showResults = isSearching || view === "results";

  return (
    <>
      {!showResults ? (
        <>
          <header className="px-5 pb-3 pt-4">
            <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
              탐색
            </h1>
          </header>

          <div className="relative shrink-0 px-4 pb-3">
            <div className="flex items-center gap-2.5 rounded-input border-[1.5px] border-beige-dark bg-white/70 px-3.5 py-2.5">
              <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
                <circle cx={6.5} cy={6.5} r={5} stroke="#9A8060" strokeWidth={1.4} />
                <path d="M10.5 10.5L13.5 13.5" stroke="#9A8060" strokeWidth={1.4} strokeLinecap="round" />
              </svg>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="술 이름을 검색해보세요"
                className="flex-1 bg-transparent text-[14.5px] text-ink outline-none placeholder:text-ink-muted"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-6">
            <p className="mb-3 px-4 text-[12px] font-medium uppercase tracking-[0.08em] text-ink-muted">
              카테고리
            </p>
            <div className="grid grid-cols-3 gap-2.5 px-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className="flex flex-col items-center gap-2 rounded-[14px] bg-white px-2.5 py-4 shadow-[0_1px_3px_rgba(30,18,8,0.05)] transition-all active:bg-wine-pale active:shadow-[0_0_0_1.5px_var(--color-wine)]"
                >
                  <span className="text-[26px]">{cat.emoji}</span>
                  <span className="text-[12px] font-medium text-ink-soft">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex shrink-0 items-center gap-2.5 border-b border-beige-dark px-4 py-2.5">
            <button
              onClick={() => {
                setView("categories");
                setSelectedCat(null);
                setKeyword("");
                setDebouncedKeyword("");
              }}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/70"
            >
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path d="M9.5 3.5L5.5 8L9.5 12.5" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isSearching ? (
              <div className="flex flex-1 items-center gap-2 rounded-input border-[1.5px] border-beige-dark bg-white/70 px-3 py-1.5">
                <svg width={14} height={14} viewBox="0 0 15 15" fill="none">
                  <circle cx={6.5} cy={6.5} r={5} stroke="#9A8060" strokeWidth={1.4} />
                  <path d="M10.5 10.5L13.5 13.5" stroke="#9A8060" strokeWidth={1.4} strokeLinecap="round" />
                </svg>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  autoFocus
                  className="flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-muted"
                />
              </div>
            ) : (
              <>
                <div className="flex flex-1 items-center gap-2 rounded-input border-[1.5px] border-beige-dark bg-white/70 px-3 py-1.5"
                  onClick={() => setKeyword(" ")}
                >
                  <svg width={14} height={14} viewBox="0 0 15 15" fill="none">
                    <circle cx={6.5} cy={6.5} r={5} stroke="#9A8060" strokeWidth={1.4} />
                    <path d="M10.5 10.5L13.5 13.5" stroke="#9A8060" strokeWidth={1.4} strokeLinecap="round" />
                  </svg>
                  <span className="text-[14px] text-ink-muted">술 이름을 검색해보세요</span>
                </div>
                <span className="text-[15px] font-semibold text-ink">
                  {selectedCategory?.emoji} {selectedCategory?.label}
                </span>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="py-20 text-center text-[14px] text-ink-muted">검색 중...</div>
            ) : alcohols.length === 0 ? (
              <div className="py-20 text-center text-[14px] text-ink-muted">
                {isSearching ? "검색 결과가 없습니다." : "등록된 술이 없습니다."}
              </div>
            ) : (
              alcohols.map((alc) => (
                <div
                  key={alc.id}
                  className="flex cursor-pointer items-center gap-3.5 border-b border-beige-mid bg-white px-5 py-3.5 first:border-t first:border-beige-mid active:bg-beige"
                >
                  <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-beige-mid text-[18px]">
                    {CATEGORY_ICONS[alc.category ?? "ETC"]}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14.5px] font-medium text-ink">{alc.name}</p>
                    <p className="mt-0.5 text-[12px] text-ink-muted">
                      {alc.nameKo ?? ""}
                      {alc.nameKo && alc.categoryKo ? " · " : ""}
                      {alc.categoryKo ?? ""}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={sentinelRef} className="h-1" />
            {isFetchingNextPage && (
              <div className="py-4 text-center text-[14px] text-ink-muted">불러오는 중...</div>
            )}
          </div>
        </>
      )}
    </>
  );
}
