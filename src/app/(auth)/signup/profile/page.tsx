"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { uploadProfileImage } from "@/lib/uploadImage";
import { toast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SipLogo from "@/components/ui/SipLogo";

type CheckStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export default function SignupProfilePage() {
  const router = useRouter();
  const { nickname: currentNickname, profileImageUrl, setAuth } = useAuthStore();

  const [nickname, setNickname] = useState("");
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [nicknameError, setNicknameError] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormatValid =
    nickname.trim().length >= 2 &&
    nickname.trim().length <= 20 &&
    !/\s/.test(nickname);

  const canSubmit = isFormatValid && checkStatus === "available" && !isSubmitting;

  const displayImage = preview ?? profileImageUrl;
  const displayInitial = (nickname || currentNickname || "S").charAt(0);

  // 닉네임 중복 체크 (디바운스)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!isFormatValid) {
      setCheckStatus(nickname.length > 0 ? "invalid" : "idle");
      return;
    }

    setCheckStatus("checking");

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`
        );
        setCheckStatus(res.ok ? "available" : "taken");
        if (!res.ok) setNicknameError("이미 사용 중인 닉네임입니다");
        else setNicknameError("");
      } catch {
        setCheckStatus("idle");
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nickname, isFormatValid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      // 1. 닉네임 저장
      const nicknameRes = await fetch("/api/auth/me/nickname", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });
      if (!nicknameRes.ok) {
        const data = await nicknameRes.json().catch(() => ({}));
        setNicknameError(data.message ?? "닉네임 설정에 실패했습니다.");
        return;
      }

      // 2. 프로필 이미지 변경 (선택한 경우만)
      let newImageUrl = profileImageUrl;
      if (selectedFile) {
        try {
          const data = await uploadProfileImage(selectedFile);
          newImageUrl = data.profileImageUrl;
          await fetch("/api/auth/me/profile-image", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profileImageUrl: newImageUrl }),
          }).catch(() => {});
        } catch {
          toast("이미지 업로드에 실패했지만 닉네임은 저장되었습니다.");
        }
      }

      setAuth({ isLoggedIn: true, nickname, profileImageUrl: newImageUrl });
      router.replace("/feed");
    } catch {
      toast("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusMessage = () => {
    switch (checkStatus) {
      case "checking":
        return <span className="text-[12px] text-ink-muted">확인 중...</span>;
      case "available":
        return <span className="text-[12px] text-success">사용 가능한 닉네임입니다</span>;
      case "taken":
        return <span className="text-[12px] text-[#C0392B]">이미 사용 중인 닉네임입니다</span>;
      case "invalid":
        return <span className="text-[12px] text-[#C0392B]">공백 없이 2~20자로 입력해주세요</span>;
      default:
        return <span className="text-[12px] text-ink-muted">공백 없이 2~20자로 입력해주세요</span>;
    }
  };

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-10 pt-14">
      <div className="mb-10">
        <SipLogo variant="dark" size={32} />
      </div>

      <div className="flex flex-1 flex-col">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-wine">
          프로필 설정
        </p>
        <h1 className="text-[28px] font-medium tracking-[-0.03em] text-ink">
          환영합니다!
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
          사용할 닉네임과 프로필 사진을 설정해주세요.
        </p>

        {/* 프로필 이미지 */}
        <div className="mt-8 flex flex-col items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full border-[3px] border-beige-dark bg-beige-mid"
          >
            {displayImage ? (
              <img src={displayImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[40px] font-semibold text-ink-muted/40">
                {displayInitial}
              </span>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-active:opacity-100">
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8}>
                <rect x={2} y={5} width={20} height={16} rx={2} />
                <circle cx={12} cy={13} r={4} />
                <path d="M8 5L9.5 2H14.5L16 5" />
              </svg>
            </div>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2.5 text-[13px] font-medium text-wine"
          >
            {preview ? "사진 변경" : "사진 선택"}
          </button>
          {profileImageUrl && !preview && (
            <p className="mt-1 text-[11px] text-ink-muted">소셜 계정 프로필 사진</p>
          )}
        </div>

        {/* 닉네임 입력 */}
        <div className="mt-8">
          <Input
            label="닉네임"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameError("");
            }}
            placeholder="공백 없이 2~20자"
          />
          <div className="mt-1.5">{statusMessage()}</div>
          {nicknameError && (
            <p className="mt-1 text-[12px] text-[#C0392B]">{nicknameError}</p>
          )}
        </div>

        <div className="mt-auto pt-8">
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isSubmitting ? "저장 중..." : "시작하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
