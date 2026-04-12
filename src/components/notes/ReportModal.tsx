"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const REASONS = [
  { value: "SPAM", icon: "📢", label: "스팸" },
  { value: "INAPPROPRIATE", icon: "⚠️", label: "부적절한 내용" },
  { value: "FALSE_INFO", icon: "❌", label: "허위 정보" },
  { value: "OTHER", icon: "💬", label: "기타" },
] as const;

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, reasonDetail?: string) => void;
}

export default function ReportModal({
  open,
  onClose,
  onSubmit,
}: ReportModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState("");

  const handleSubmit = () => {
    if (!selected) return;
    onSubmit(selected, selected === "OTHER" ? detail : undefined);
    setSelected(null);
    setDetail("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="신고 사유 선택">
      <div className="flex flex-col gap-1">
        {REASONS.map((r) => (
          <button
            key={r.value}
            onClick={() => setSelected(r.value)}
            className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-left transition-colors ${selected === r.value ? "bg-wine-pale" : ""}`}
          >
            <span className="text-[18px]">{r.icon}</span>
            <span className="text-[15px] text-ink">{r.label}</span>
          </button>
        ))}
      </div>

      {selected === "OTHER" && (
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="신고 사유를 입력해주세요"
          className="mt-3 w-full resize-none rounded-input border-[1.5px] border-beige-dark bg-white/60 px-3.5 py-3 text-[15px] font-light text-ink placeholder:text-ink-muted focus:border-wine-light focus:outline-none"
          rows={3}
        />
      )}

      <div className="mt-4 flex gap-2.5">
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={!selected}>
          신고하기
        </Button>
      </div>
    </Modal>
  );
}
