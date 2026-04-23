"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import SipLogo from "@/components/ui/SipLogo";

export default function SignupProfilePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-10 pt-14">
      <div className="mb-10">
        <SipLogo variant="dark" size={32} />
      </div>

      <div className="flex flex-1 flex-col">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-wine">
          가입 완료
        </p>
        <h1 className="text-[28px] font-medium tracking-[-0.03em] text-ink">
          환영합니다!
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
          임시 닉네임이 부여되었어요.
          <br />
          프로필 설정에서 언제든지 변경할 수 있어요.
        </p>

        <div className="mt-8 rounded-2xl bg-surface p-5">
          <p className="text-[12px] font-medium text-ink-muted">닉네임</p>
          <p className="mt-1 text-[16px] font-medium text-ink">임시 닉네임</p>
          <p className="mt-2 text-[12px] text-ink-muted">
            프로필 &gt; 설정에서 변경 가능합니다
          </p>
        </div>

        <div className="mt-auto pt-8">
          <Button onClick={() => router.replace("/")}>시작하기</Button>
        </div>
      </div>
    </div>
  );
}
