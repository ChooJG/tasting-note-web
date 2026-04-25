"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";

function OAuthCallback() {
  const router = useRouter();
  const params = useParams<{ provider: string }>();
  const searchParams = useSearchParams();
  const called = useRef(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = searchParams.get("code");
    const provider = params.provider;

    if (!code) {
      router.replace("/login");
      return;
    }

    const redirectUri = `${window.location.origin}/oauth/callback/${provider}`;

    fetch(`/api/auth/oauth/${provider}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (!data.success) {
          const msg = encodeURIComponent(data.message ?? "소셜 로그인에 실패했습니다.");
          router.replace(`/login?error=${msg}`);
          return;
        }

        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        setAuth(meData);

        if (data.isNewUser) {
          router.replace("/signup/profile");
        } else {
          window.location.replace("/feed");
        }
      })
      .catch(() => {
        router.replace("/login?error=" + encodeURIComponent("로그인 중 오류가 발생했습니다."));
      });
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-wine border-t-transparent" />
        <p className="text-[14px] text-ink-muted">로그인 중...</p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense>
      <OAuthCallback />
    </Suspense>
  );
}
