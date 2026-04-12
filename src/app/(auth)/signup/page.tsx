"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { toast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          nickname: data.nickname,
          birthDate: data.birthDate,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast(json.message ?? "회원가입에 실패했습니다.");
        return;
      }

      toast("회원가입이 완료되었습니다.");
      router.push("/login");
    } catch {
      toast("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => router.back()}
        className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4L6 9L11 14" />
        </svg>
      </button>

      <h1 className="text-[28px] font-medium tracking-[-0.03em] text-ink">
        계정 만들기
      </h1>
      <p className="mt-1 mb-7 text-[14px] text-ink-muted">
        이메일과 닉네임으로 시작하세요
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="이메일"
          type="email"
          placeholder="hello@example.com"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="닉네임"
          placeholder="2~20자"
          autoComplete="nickname"
          {...register("nickname")}
          error={errors.nickname?.message}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="영문+숫자 8자 이상"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />
        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        <Input
          label="생년월일"
          type="date"
          {...register("birthDate")}
          error={errors.birthDate?.message}
        />

        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading ? "가입 중..." : "가입하기"}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-ink-muted">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-wine">
          로그인
        </Link>
      </p>
    </div>
  );
}
