"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useMyNotes } from "@/hooks/useNotes";
import { toast } from "@/components/ui/Toast";

export default function ProfilePage() {
  const router = useRouter();
  const { nickname, clearAuth } = useAuthStore();
  const { data: allNotes } = useMyNotes();

  const publishedCount = allNotes?.filter((n) => n.status === "PUBLISHED").length ?? 0;

  const displayName = nickname ?? "\uC0AC\uC6A9\uC790";
  const initial = displayName.charAt(0);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAuth();
    toast("\uB85C\uADF8\uC544\uC6C3 \uB418\uC5C8\uC2B5\uB2C8\uB2E4");
    router.push("/feed");
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <div className="flex shrink-0 flex-col items-center bg-wine px-5 pb-8 pt-7">
        <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-beige/30 bg-beige/20 text-[26px] font-semibold text-beige">
          {initial}
        </div>
        <p className="mt-2 text-[18px] font-semibold text-beige">
          내 프로필
        </p>

        {/* Stats */}
        <div className="mt-1.5 flex">
          <div className="flex flex-col items-center px-5">
            <span className="text-[19px] font-semibold text-beige">
              {publishedCount}
            </span>
            <span className="mt-0.5 text-[11px] text-beige/55">발행된 노트</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-2 rounded-pill border border-beige/25 bg-beige/15 px-[18px] py-[7px] text-[13px] text-beige/80"
        >
          로그아웃
        </button>
      </div>

      {/* Settings */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6">
        {/* 계정 */}
        <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          계정
        </p>
        <div className="mb-5 overflow-hidden rounded-card border-[1.5px] border-beige-dark bg-white">
          <SettingsRow label="닉네임 변경" />
          <SettingsRow label="비밀번호 변경" />
          <SettingsRow label="알림 설정" />
        </div>

        {/* 지원 */}
        <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
          지원
        </p>
        <div className="mb-5 overflow-hidden rounded-card border-[1.5px] border-beige-dark bg-white">
          <SettingsRow label="피드백 보내기" />
          <SettingsRow label="이용약관" />
          <SettingsRow label="개인정보 처리방침" />
        </div>

        {/* 위험 영역 */}
        <div className="overflow-hidden rounded-card border-[1.5px] border-beige-dark bg-white">
          <SettingsRow label="회원 탈퇴" danger />
        </div>
      </div>
    </div>
  );
}

function SettingsRow({ label, danger }: { label: string; danger?: boolean }) {
  return (
    <button className="flex w-full items-center justify-between border-t border-beige-mid px-4 py-[14px] text-left first:border-t-0">
      <span className={`text-[15px] ${danger ? "text-[#C0392B]" : "text-ink"}`}>
        {label}
      </span>
      <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
        <path d="M5.5 3.5L9.5 7.5L5.5 11.5" stroke="#9A8060" strokeWidth={1.4} strokeLinecap="round" />
      </svg>
    </button>
  );
}
