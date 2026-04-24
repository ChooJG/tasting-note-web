"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useMyNotes } from "@/hooks/useNotes";
import { toast } from "@/components/ui/Toast";
import { uploadProfileImage } from "@/lib/uploadImage";

export default function ProfilePage() {
  const router = useRouter();
  const { nickname, profileImageUrl, isLoggedIn, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login?callbackUrl=/profile");
    }
  }, [isLoggedIn, router]);
  const { data: allNotes } = useMyNotes();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const publishedCount = allNotes?.content.filter((n) => n.status === "PUBLISHED").length ?? 0;

  const displayName = nickname ?? "\uC0AC\uC6A9\uC790";
  const initial = displayName.charAt(0);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAuth();
    toast("\uB85C\uADF8\uC544\uC6C3 \uB418\uC5C8\uC2B5\uB2C8\uB2E4");
    window.location.href = "/feed";
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await uploadProfileImage(file);
      setAuth({ isLoggedIn: true, nickname, profileImageUrl: data.profileImageUrl });
      await fetch("/api/auth/me/profile-image", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImageUrl: data.profileImageUrl }),
      }).catch(() => {});
      toast("\uD504\uB85C\uD544 \uC774\uBBF8\uC9C0\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4");
    } catch {
      toast("\uB124\uD2B8\uC6CC\uD06C \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4");
    }
    e.target.value = "";
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <div className="flex shrink-0 flex-col items-center bg-wine px-5 pb-8 pt-7">
        {/* 프로필 이미지 (탭하면 변경) */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        <button
          onClick={handleProfileImageClick}
          className="relative flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full border-2 border-beige/30 bg-beige/20"
        >
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[26px] font-semibold text-beige">{initial}</span>
          )}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors active:bg-black/20">
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="opacity-0 transition-opacity active:opacity-100">
              <path d="M2 11V14H5L13 6L10 3L2 11Z" fill="white" />
            </svg>
          </div>
        </button>
        <p className="mt-0.5 text-[11px] text-beige/50">탭하여 변경</p>

        <p className="mt-1 text-[18px] font-semibold text-beige">
          {displayName}
        </p>

        {/* Stats */}
        <div className="mt-1.5 flex">
          <div className="flex flex-col items-center px-5">
            <span className="text-[19px] font-semibold text-beige">{publishedCount}</span>
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
      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-5">
        {/* 계정 */}
        <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">계정</p>
        <div className="mb-5 overflow-hidden rounded-card border-[1.5px] border-beige-dark bg-white">
          <SettingsLink href="/profile/image" label="프로필 이미지 변경" />
          <SettingsLink href="/profile/nickname" label="닉네임 변경" />
          <SettingsLink href="/profile/password" label="비밀번호 변경" />
        </div>

        {/* 지원 */}
        <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">지원</p>
        <div className="mb-5 overflow-hidden rounded-card border-[1.5px] border-beige-dark bg-white">
          <SettingsLink href="/profile/feedback" label="피드백 보내기" />
          <SettingsLink href="/profile/terms" label="이용약관" />
          <SettingsLink href="/profile/privacy" label="개인정보 처리방침" />
        </div>

        {/* 위험 영역 */}
        <div className="overflow-hidden rounded-card border-[1.5px] border-beige-dark bg-white">
          <SettingsRow label="회원 탈퇴" danger />
        </div>
      </div>
    </div>
  );
}

function SettingsLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex w-full items-center justify-between border-t border-beige-mid px-4 py-[14px] first:border-t-0">
      <span className="text-[15px] text-ink">{label}</span>
      <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
        <path d="M5.5 3.5L9.5 7.5L5.5 11.5" stroke="#9A8060" strokeWidth={1.4} strokeLinecap="round" />
      </svg>
    </Link>
  );
}

function SettingsRow({ label, danger }: { label: string; danger?: boolean }) {
  return (
    <button className="flex w-full items-center justify-between border-t border-beige-mid px-4 py-[14px] text-left first:border-t-0">
      <span className={`text-[15px] ${danger ? "text-[#C0392B]" : "text-ink"}`}>{label}</span>
      <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
        <path d="M5.5 3.5L9.5 7.5L5.5 11.5" stroke="#9A8060" strokeWidth={1.4} strokeLinecap="round" />
      </svg>
    </button>
  );
}
