"use client";

import { useFlavors } from "@/hooks/useFlavors";

interface FlavorPickerProps {
  label: string;
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export default function FlavorPicker({
  label,
  selectedIds,
  onChange,
}: FlavorPickerProps) {
  const { data: flavors, isLoading } = useFlavors();

  const toggle = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id]
    );
  };

  return (
    <div>
      <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
        {label}
      </h3>
      {isLoading ? (
        <p className="text-[13px] text-ink-muted">불러오는 중...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {flavors?.map((f) => {
            const selected = selectedIds.includes(f.id!);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggle(f.id!)}
                className={`rounded-pill border-[1.5px] px-3.5 py-[6px] text-[13px] transition-colors ${
                  selected
                    ? "border-wine bg-wine text-beige"
                    : "border-beige-dark bg-white/60 text-ink-soft"
                }`}
              >
                {f.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
