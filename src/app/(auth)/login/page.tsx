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
