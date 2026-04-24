"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/Toast";

export function useLogin() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/feed";
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
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

      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setAuth(meData);
      window.location.replace(callbackUrl);
    } catch {
      toast("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
}
