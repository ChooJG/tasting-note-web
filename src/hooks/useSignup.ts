"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { toast } from "@/components/ui/Toast";

export function useSignup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupInput>({
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

  return { form, onSubmit, isLoading };
}
