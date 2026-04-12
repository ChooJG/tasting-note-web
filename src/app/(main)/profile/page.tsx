"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useMyNotes } from "@/hooks/useNotes";
import { toast } from "@/components/ui/Toast";

export default function ProfilePage() {
  const router = useRouter();
  const { nickname, clearAuth } = useAuthStore();
  const { data: allNotes } = useMyNotes();

  const totalCount = allNotes?.length ?? 0;
  const publishedCount = allNotes?.filter((n) => n.status === "PUBLISHED").length ?? 0;
  const draftCount = allNotes?.filter((n) => n.status === "DRAFT").length ?? 0;

  const displayName = nickname ?? "사용자";
  const initial = displayName.charAt(0);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAuth();
    toast("로그아웃 되었습니다");
    router.push("/feed");
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <div className="flex shrink-0 flex-col items-center bg-wine px-5 pb-10 pt-8">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-beige/30 bg-beige/20 text-[28px] font-semibold text-beige">
          {initial}
        </div>
        <p className="mt-2.5 text-[20px] font-semibold text-beige">
          {displayName}
        </p>

        {/* Stats */}
        <div className="mt-4 flex">
          <div className="flex flex-col items-center px-6">
            <span className="text-[20px] font-semibold text-beige">
              {totalCount}
            </span>
            <span className="mt-0.5 text-[11px] text-beige/55">전체 노트</span>
          </div>
          <div className="flex flex-col items-center border-l border-beige/20 px-6">
            <span className="text-[20px] font-semibold text-beige">
              {publishedCount}
            </span>
            <span className="mt-0.5 text-[11px] text-beige/55">발행됨</span>
          </div>
          <div className="flex flex-col items-center border-l border-beige/20 px-6">
            <span className="text-[20px] font-semibold text-beige">
              {draftCount}
            </span>
            <span className="mt-0.5 text-[11px] text-beige/55">임시저장</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="flex-1 px-5 pt-5">
        <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          기타
        </p>
        <div className="overflow-hidden rounded-card border-[1.5px] border-beige-dark bg-white">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between px-4 py-[15px] text-left"
          >
            <span className="text-[15px] text-[#C0392B]">로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
}
