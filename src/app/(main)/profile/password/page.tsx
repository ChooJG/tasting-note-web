"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const PW_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export default function PasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isNewValid = PW_REGEX.test(newPassword);
  const isMatch = newPassword === confirmPassword;
  const canSubmit = currentPassword.length > 0 && isNewValid && isMatch;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "비밀번호 변경에 실패했습니다.");
        return;
      }
      toast("비밀번호가 변경되었습니다");
      router.back();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
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
        <span className="flex-1 text-center text-[16px] font-semibold text-ink">비밀번호 변경</span>
        <div className="w-9" />
      </header>

      <div className="flex-1 space-y-5 px-5 pt-6">
        <Input
          label="현재 비밀번호"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="현재 비밀번호 입력"
        />
        <div>
          <Input
            label="새 비밀번호"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="영문+숫자 8자 이상"
            error={newPassword.length > 0 && !isNewValid ? "영문과 숫자를 포함해 8자 이상 입력해주세요" : ""}
          />
        </div>
        <Input
          label="새 비밀번호 확인"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호 다시 입력"
          error={confirmPassword.length > 0 && !isMatch ? "비밀번호가 일치하지 않습니다" : ""}
        />
        {error && <p className="text-[13px] text-[#C0392B]">{error}</p>}
      </div>

      <div className="shrink-0 px-5 pb-8">
        <Button onClick={handleSubmit} disabled={isLoading || !canSubmit}>
          {isLoading ? "변경 중..." : "변경하기"}
        </Button>
      </div>
    </div>
  );
}
