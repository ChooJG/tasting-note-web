"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

type FeedbackCategory = "BUG" | "FEEDBACK" | "SUGGESTION";

const CATEGORIES: { value: FeedbackCategory; label: string; desc: string }[] = [
  { value: "BUG", label: "\uBC84\uADF8 \uC2E0\uACE0", desc: "\uC624\uB958\uB098 \uC624\uC791\uB3D9\uC744 \uC54C\uB824\uC8FC\uC138\uC694" },
  { value: "FEEDBACK", label: "\uD53C\uB4DC\uBC31", desc: "\uC0AC\uC6A9 \uACBD\uD5D8\uC5D0 \uB300\uD55C \uC758\uACAC\uC744 \uB4E4\uB824\uC8FC\uC138\uC694" },
  { value: "SUGGESTION", label: "\uAC1C\uC120 \uC81C\uC548", desc: "\uC0C8\uB85C\uC6B4 \uAE30\uB2A5\uC774\uB098 \uAC1C\uC120 \uC544\uC774\uB514\uC5B4\uB97C \uC81C\uC548\uD574\uC8FC\uC138\uC694" },
];

export default function FeedbackPage() {
  const router = useRouter();
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = category !== null && content.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          content: content.trim(),
          appVersion: "1.0.0",
        }),
      });
      if (res.ok) {
        toast("\uD53C\uB4DC\uBC31\uC774 \uC804\uC1A1\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uAC10\uC0AC\uD569\uB2C8\uB2E4!");
        router.back();
      } else {
        const data = await res.json().catch(() => ({}));
        toast(data.message ?? "\uC804\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4");
      }
    } catch {
      toast("\uB124\uD2B8\uC6CC\uD06C \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex shrink-0 items-center border-b border-beige-dark px-5 pb-3 pt-4">
        <button onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70">
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4L6 9L11 14" />
          </svg>
        </button>
        <span className="flex-1 text-center text-[16px] font-semibold text-ink">피드백 보내기</span>
        <div className="w-9" />
      </header>

      <div className="flex-1 overflow-y-auto px-5 pt-6">
        {/* 카테고리 선택 */}
        <h3 className="mb-2.5 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          유형 선택
        </h3>
        <div className="mb-6 space-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`flex w-full flex-col rounded-card border-[1.5px] px-4 py-3.5 text-left transition-colors ${
                category === cat.value
                  ? "border-wine bg-wine-pale"
                  : "border-beige-dark bg-white"
              }`}
            >
              <span className={`text-[15px] font-medium ${category === cat.value ? "text-wine" : "text-ink"}`}>
                {cat.label}
              </span>
              <span className="mt-0.5 text-[12px] text-ink-muted">{cat.desc}</span>
            </button>
          ))}
        </div>

        {/* 내용 입력 */}
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          내용
        </h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          maxLength={2000}
          placeholder="자세히 알려주시면 더 빠르게 개선할 수 있어요"
          className="w-full resize-none rounded-input border-[1.5px] border-beige-dark bg-white/65 px-3.5 py-3 text-[15px] font-light leading-[1.65] text-ink placeholder:text-ink-muted focus:border-wine-light focus:bg-white/90 focus:outline-none"
        />
        <p className="mt-1 text-right text-[11px] text-ink-muted">
          {content.length} / 2000
        </p>
      </div>

      <div className="shrink-0 px-5 pb-8">
        <Button onClick={handleSubmit} disabled={isSubmitting || !canSubmit}>
          {isSubmitting ? "전송 중..." : "보내기"}
        </Button>
      </div>
    </div>
  );
}
