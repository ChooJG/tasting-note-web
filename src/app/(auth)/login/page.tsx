"use client";

import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SipLogo from "@/components/ui/SipLogo";

export default function LoginPage() {
  const { form, onSubmit, isLoading } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Wine hero */}
      <section className="relative shrink-0 overflow-hidden bg-wine px-6 pb-12 pt-14">
        {/* Decorative circles */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-28 -top-24 h-[360px] w-[360px] rounded-full border border-beige/[0.08]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-20 h-[240px] w-[240px] rounded-full border border-beige/[0.06]"
        />

        <div className="relative">
          <div className="mb-10">
            <SipLogo variant="light" size={36} />
          </div>

          <h2 className="text-[28px] font-normal leading-[1.3] tracking-[-0.02em] text-beige/95">
            마신 순간을
            <br />
            기록하는
            <br />
            <span className="font-light text-beige/60">나만의 노트</span>
          </h2>
        </div>
      </section>

      {/* Form */}
      <section className="flex flex-1 flex-col px-6 pb-10 pt-10">
        <div className="mb-8">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-wine">
            환영합니다
          </p>
          <h1 className="text-[28px] font-medium tracking-[-0.03em] text-ink">
            로그인
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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

          <Button type="submit" disabled={isLoading} className="mt-4">
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[13px] text-ink-muted">
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="font-medium text-wine">
            회원가입
          </Link>
        </p>
      </section>
    </div>
  );
}
