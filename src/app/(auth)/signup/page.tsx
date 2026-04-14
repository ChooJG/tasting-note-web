"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignup } from "@/hooks/useSignup";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignupPage() {
  const router = useRouter();
  const { form, onSubmit, isLoading } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-10 pt-10">
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

      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-wine">
        환영합니다
      </p>
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
