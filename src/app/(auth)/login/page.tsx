"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function SipLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 3C16 3 7 12 7 19C7 23.97 11.03 28 16 28C20.97 28 25 23.97 25 19C25 12 16 3 16 3Z"
          fill="rgba(123,45,45,0.15)"
          stroke="#7B2D2D"
          strokeWidth="1.2"
        />
        <path
          d="M16 12C16 12 11 17.5 11 21C11 23.76 13.24 26 16 26"
          stroke="#7B2D2D"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <span className="text-[24px] font-semibold tracking-[0.04em] text-wine">
        sip
      </span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/feed";
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast(json.message ?? "로그인에 실패했습니다.");
        return;
      }

      setAuth({ isLoggedIn: true });
      router.push(callbackUrl);
    } catch {
      toast("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <SipLogo />
      <h1 className="mt-10 text-[28px] font-medium tracking-[-0.03em] text-ink">
        다시 만나요
      </h1>
      <p className="mt-1 text-[14px] text-ink-muted">
        테이스팅 노트를 이어서 작성해보세요
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 flex flex-col gap-4"
      >
        <Input
          label="이메일"
          type="email"
          placeholder="hello@example.com"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button type="submit" disabled={isLoading} className="mt-6">
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-ink-muted">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-wine">
          회원가입
        </Link>
      </p>
    </div>
  );
}
