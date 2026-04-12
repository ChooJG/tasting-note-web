"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
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
      router.push("/feed");
    } catch {
      toast("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[320px]">
      <div className="mb-10 text-center">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-wine">
          sip
        </h1>
        <p className="mt-1 text-[15px] font-light text-ink-soft">
          나만의 테이스팅 노트
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="이메일"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          autoComplete="current-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-ink-muted">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-wine">
          회원가입
        </Link>
      </p>
    </div>
  );
}
