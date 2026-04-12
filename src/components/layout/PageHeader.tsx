"use client";

import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

export default function PageHeader({
  title,
  showBack = false,
  right,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex h-[56px] items-center justify-between bg-beige px-5">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink"
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <h1 className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
          {title}
        </h1>
      </div>
      {right && <div>{right}</div>}
    </header>
  );
}
