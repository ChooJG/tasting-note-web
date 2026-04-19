"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/Toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type CheckStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export default function NicknamePage() {
  const router = useRouter();
  const { nickname: currentNickname, setAuth } = useAuthStore();
  const [nickname, setNickname] = useState(currentNickname ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFormatValid = nickname.trim().length >= 2 && nickname.trim().length <= 20 && !/\s/.test(nickname);
  const isChanged = nickname !== currentNickname;
  const canSubmit = isFormatValid && isChanged && checkStatus === "available";

  // 디바운스: 0.5초 동안 입력 없으면 중복확인 요청
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // 현재 닉네임과 같으면 체크 불필요
    if (nickname === currentNickname) {
      setCheckStatus("idle");
      setError("");
      return;
    }

    // 형식 유효하지 않으면
    if (!isFormatValid) {
      if (nickname.length > 0) {
        setCheckStatus("invalid");
      } else {
        setCheckStatus("idle");
      }
      return;
    }

    setCheckStatus("checking");

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`);
        if (res.ok) {
          setCheckStatus("available");
          setError("");
        } else {
          setCheckStatus("taken");
          setError("이미 사용 중인 닉네임입니다");
        }
      } catch {
        setCheckStatus("idle");
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nickname, currentNickname, isFormatValid]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/me/nickname", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "닉네임 변경에 실패했습니다.");
        return;
      }
      setAuth({ isLoggedIn: true, nickname });
      toast("닉네임이 변경되었습니다");
      router.back();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
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
    <div className="flex flex-1 flex-col">
      <header className="flex shrink-0 items-center border-b border-beige-dark px-5 pb-3 pt-4">
        <button onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70">
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4L6 9L11 14" />
          </svg>
        </button>
        <span className="flex-1 text-center text-[16px] font-semibold text-ink">닉네임 변경</span>
        <div className="w-9" />
      </header>

      <div className="flex-1 px-5 pt-6">
        <Input
          label="새 닉네임"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setError("");
          }}
          placeholder="공백 없이 2~20자"
          error={error}
        />
        <div className="mt-1.5">{statusMessage()}</div>
      </div>

      <div className="shrink-0 px-5 pb-8">
        <Button onClick={handleSubmit} disabled={isLoading || !canSubmit}>
          {isLoading ? "변경 중..." : "변경하기"}
        </Button>
      </div>
    </div>
  );
}
