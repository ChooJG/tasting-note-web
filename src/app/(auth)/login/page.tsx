"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SipLogo from "@/components/ui/SipLogo";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

function getRedirectUri(provider: string) {
  return `${BASE_URL}/oauth/callback/${provider}`;
}

function getKakaoUrl() {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? "",
    redirect_uri: getRedirectUri("kakao"),
    response_type: "code",
  });
  return `https://kauth.kakao.com/oauth/authorize?${params}`;
}

function getGoogleUrl() {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
    redirect_uri: getRedirectUri("google"),
    response_type: "code",
    scope: "email profile",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

function getNaverUrl() {
  const state = Math.random().toString(36).slice(2);
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ?? "",
    redirect_uri: getRedirectUri("naver"),
    response_type: "code",
    state,
  });
  return `https://nid.naver.com/oauth2.0/authorize?${params}`;
}

function LoginForm() {
  const { form, onSubmit, isLoading } = useLogin();
  const searchParams = useSearchParams();
  const errorMsg = searchParams.get("error");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <section className="flex flex-1 flex-col px-6 pb-10 pt-10">
      <div className="mb-8">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-wine">
          환영합니다
        </p>
        <h1 className="text-[28px] font-medium tracking-[-0.03em] text-ink">
          로그인
        </h1>
      </div>

      {errorMsg && (
        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {decodeURIComponent(errorMsg)}
        </div>
      )}

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

      {/* 소셜 로그인 */}
      <div className="mt-8">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-ink/10" />
          <span className="text-[12px] text-ink-muted">또는</span>
          <div className="h-px flex-1 bg-ink/10" />
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <a
            href={getKakaoUrl()}
            className="flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#FEE500] text-[14px] font-medium text-[#191919]"
          >
            <KakaoIcon />
            카카오로 로그인
          </a>

          <a
            href={getGoogleUrl()}
            className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-ink/10 bg-white text-[14px] font-medium text-ink"
          >
            <GoogleIcon />
            구글로 로그인
          </a>

          <button
            type="button"
            onClick={() => { window.location.href = getNaverUrl(); }}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#03C75A] text-[14px] font-medium text-white"
          >
            <NaverIcon />
            네이버로 로그인
          </button>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Wine hero */}
      <section className="relative shrink-0 overflow-hidden bg-wine px-6 pb-12 pt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-28 -top-24 h-[360px] w-[360px] rounded-full border border-beige/[0.08]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-20 h-[240px] w-[240px] rounded-full border border-beige/[0.06]"
        />

        <div className="relative">
          <div className="mb-10 flex items-start justify-between">
            <SipLogo variant="light" size={36} />
            <button
              onClick={() => router.push("/feed")}
              aria-label="피드로 돌아가기"
              className="flex h-9 w-9 items-center justify-center rounded-full text-beige/70 transition-colors hover:bg-beige/10 hover:text-beige"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
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

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1.5C4.858 1.5 1.5 4.134 1.5 7.373c0 2.094 1.373 3.934 3.453 4.984l-.88 3.28a.188.188 0 0 0 .29.203l3.826-2.524A9.4 9.4 0 0 0 9 13.246c4.142 0 7.5-2.634 7.5-5.873S13.142 1.5 9 1.5Z"
        fill="#191919"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M10.2 9.27 7.614 1.5H1.5v15h6.3V7.73L10.386 15.5H16.5v-15h-6.3v8.77Z"
        fill="white"
      />
    </svg>
  );
}
