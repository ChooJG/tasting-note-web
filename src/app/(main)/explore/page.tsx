"use client";

import { useState } from "react";

const CATEGORIES = [
  { key: "WHISKEY", emoji: "\u{1F943}", label: "\uC704\uC2A4\uD0A4" },
  { key: "WINE", emoji: "\u{1F377}", label: "\uC640\uC778" },
  { key: "BEER", emoji: "\u{1F37A}", label: "\uB9E5\uC8FC" },
  { key: "SOJU", emoji: "\u{1FAD9}", label: "\uC18C\uC8FC" },
  { key: "MAKGEOLLI", emoji: "\u{1F33E}", label: "\uB9C9\uAC78\uB9AC" },
  { key: "SAKE", emoji: "\u{1F376}", label: "\uC0AC\uCF00" },
  { key: "VODKA", emoji: "\u{1F942}", label: "\uBCF4\uB4DC\uCE74" },
  { key: "GIN", emoji: "\u{1F378}", label: "\uC9C4" },
  { key: "RUM", emoji: "\u{1F3F4}\u200D\u2620\uFE0F", label: "\uB7FC" },
  { key: "TEQUILA", emoji: "\u{1F335}", label: "\uD14C\uD0AC\uB77C" },
  { key: "BRANDY", emoji: "\u{1F943}", label: "\uBE0C\uB79C\uB514" },
] as const;

// 데모 데이터 (API 연결 전)
const DEMO_RESULTS: Record<string, { nameKo: string; name: string; meta: string; emoji: string }[]> = {
  WHISKEY: [
    { nameKo: "\uB77C\uD504\uB85C\uC775 10\uB144", name: "Laphroaig 10 Year", meta: "\uC2A4\uCF54\uD2C0\uB79C\uB4DC \xB7 43%", emoji: "\u{1F943}" },
    { nameKo: "\uB9E5\uCE98\uB780 12 \uC170\uB9AC", name: "Macallan 12 Sherry", meta: "\uC2A4\uCF54\uD2C0\uB79C\uB4DC \xB7 40%", emoji: "\u{1F943}" },
    { nameKo: "\uC870\uB2C8\uC6CC\uCEE4 \uBE14\uB799\uB77C\uBCA8", name: "Johnnie Walker Black Label", meta: "\uC2A4\uCF54\uD2C0\uB79C\uB4DC \xB7 40%", emoji: "\u{1F943}" },
    { nameKo: "\uBC1C\uBCA0\uB2C8 \uB354\uBE14\uC6B0\uB4DC 12", name: "Balvenie DoubleWood 12", meta: "\uC2A4\uCF54\uD2C0\uB79C\uB4DC \xB7 40%", emoji: "\u{1F943}" },
    { nameKo: "\uAE00\uB80C\uD53C\uB515 15\uB144", name: "Glenfiddich 15", meta: "\uC2A4\uCF54\uD2C0\uB79C\uB4DC \xB7 40%", emoji: "\u{1F943}" },
  ],
  WINE: [
    { nameKo: "\uC0E4\uD1A0 \uB9C8\uACE0 2018", name: "Ch\xE2teau Margaux 2018", meta: "\uBCF4\uB974\uB3C4 \xB7 \uD504\uB791\uC2A4", emoji: "\u{1F377}" },
    { nameKo: "\uC81C\uBE0C\uB808 \uC0F4\uBCA0\uB974\uD0F1 2020", name: "Gevrey-Chambertin 2020", meta: "\uBD80\uB974\uACE0\uB274 \xB7 \uD504\uB791\uC2A4", emoji: "\u{1F377}" },
  ],
  BEER: [
    { nameKo: "\uAD6C\uC2A4 \uC544\uC77C\uB79C\uB4DC IPA", name: "Goose Island IPA", meta: "\uBBF8\uAD6D \xB7 5.9%", emoji: "\u{1F37A}" },
  ],
};

type View = "categories" | "results";

export default function ExplorePage() {
  const [view, setView] = useState<View>("categories");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const selectedCategory = CATEGORIES.find((c) => c.key === selectedCat);
  const results = selectedCat ? DEMO_RESULTS[selectedCat] ?? [] : [];

  // 검색어에 따른 간단한 자동완성 필터
  const allAlcohols = Object.values(DEMO_RESULTS).flat();
  const filtered = searchQuery.length > 0
    ? allAlcohols.filter(
        (a) =>
          a.nameKo.includes(searchQuery) ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleCategoryClick = (key: string) => {
    setSelectedCat(key);
    setView("results");
  };

  return (
    <>
      {view === "categories" ? (
        <>
          {/* Header */}
          <header className="px-5 pb-3 pt-4">
            <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">
              탐색
            </h1>
          </header>

          {/* Search */}
          <div className="relative shrink-0 px-4 pb-3">
            <div className="flex items-center gap-2.5 rounded-input border-[1.5px] border-beige-dark bg-white/70 px-3.5 py-2.5">
              <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
                <circle cx={6.5} cy={6.5} r={5} stroke="#9A8060" strokeWidth={1.4} />
                <path d="M10.5 10.5L13.5 13.5" stroke="#9A8060" strokeWidth={1.4} strokeLinecap="round" />
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAutocomplete(e.target.value.length > 0);
                }}
                onFocus={() => searchQuery.length > 0 && setShowAutocomplete(true)}
                onBlur={() => setTimeout(() => setShowAutocomplete(false), 150)}
                placeholder="술 이름을 검색해보세요"
                className="flex-1 bg-transparent text-[14.5px] text-ink outline-none placeholder:text-ink-muted"
              />
            </div>

            {/* Autocomplete */}
            {showAutocomplete && filtered.length > 0 && (
              <div className="absolute left-4 right-4 z-10 mt-1 overflow-hidden rounded-input border-[1.5px] border-beige-dark bg-white shadow-[0_4px_16px_rgba(30,18,8,0.08)]">
                {filtered.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex cursor-pointer items-center gap-2.5 border-b border-beige-mid px-3.5 py-3 last:border-b-0 active:bg-beige"
                  >
                    <div>
                      <p className="text-[14.5px] font-medium text-ink">{item.name}</p>
                      <p className="mt-0.5 text-[12px] text-ink-muted">{item.nameKo} · {item.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category grid */}
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
          {/* Category result header */}
          <div className="flex shrink-0 items-center gap-2.5 border-b border-beige-dark px-4 py-2.5">
            <button
              onClick={() => {
                setView("categories");
                setSelectedCat(null);
              }}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/70"
            >
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path d="M9.5 3.5L5.5 8L9.5 12.5" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="text-[16px] font-semibold text-ink">
              {selectedCategory?.emoji} {selectedCategory?.label}
            </span>
          </div>

          {/* Results list */}
          <div className="flex-1 overflow-y-auto">
            {results.length === 0 ? (
              <div className="py-20 text-center text-[14px] text-ink-muted">
                등록된 술이 없습니다.
              </div>
            ) : (
              results.map((item, idx) => (
                <div
                  key={idx}
                  className="flex cursor-pointer items-center gap-3.5 border-b border-beige-mid bg-white px-5 py-3.5 first:border-t first:border-beige-mid active:bg-beige"
                >
                  <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-beige-mid text-[18px]">
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14.5px] font-medium text-ink">{item.nameKo}</p>
                    <p className="mt-0.5 text-[12px] text-ink-muted">{item.name} · {item.meta}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </>
  );
}
