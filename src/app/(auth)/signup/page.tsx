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
    <div className="w-full max-w-[320px]">
      <div className="mb-10 text-center">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-wine">
          sip
        </h1>
        <p className="mt-1 text-[15px] font-light text-ink-soft">
          새 계정 만들기
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
          placeholder="비밀번호 (영문+숫자 8자 이상)"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />
        <Input
          type="password"
          placeholder="비밀번호 확인"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        <Input
          placeholder="닉네임 (2~20자, 공백 불가)"
          autoComplete="nickname"
          {...register("nickname")}
          error={errors.nickname?.message}
        />
        <Input
          type="date"
          placeholder="생년월일"
          {...register("birthDate")}
          error={errors.birthDate?.message}
          label="생년월일"
        />

        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading ? "가입 중..." : "회원가입"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-ink-muted">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-wine">
          로그인
        </Link>
      </p>
    </div>
  );
}
