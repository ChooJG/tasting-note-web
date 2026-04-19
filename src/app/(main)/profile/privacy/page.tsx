"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const MESSAGES = [
  "여러분의 소중한 개인정보는\n저희가 감사히 잘 사용하겠습니다.",
  "아 삼겹살에 소주 마시고 싶다",
  "비밀번호는 암호화해서 저장해요.\n저도 못 봐요 진짜로.",
  "개인정보 팔아서 치킨 사먹고 싶지만\n그러지 않겠습니다.",
  "회원 탈퇴하면 다 지워드려요.\n미련 없이.",
  "여러분의 이메일로 스팸 안 보내요.\n약속.",
  "오늘 뭐 마실까...\n아 일해야지",
  "출근하기 싫어요\n먹고살라면 해야죠",
  "꿈은 없고요, 그냥 놀고싶습니다",
  "귀여운 고양이",
];

function CatAnimation() {
  const [blink, setBlink] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [tailPhase, setTailPhase] = useState(0);

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 2500);
    const bounceTimer = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }, 4000);
    const tailTimer = setInterval(() => setTailPhase((p) => (p + 1) % 3), 600);
    return () => { clearInterval(blinkTimer); clearInterval(bounceTimer); clearInterval(tailTimer); };
  }, []);

  const tails = [
    "M138 120 Q155 95 165 100 Q172 105 168 115",
    "M138 120 Q158 100 170 108 Q175 114 167 120",
    "M138 120 Q150 90 162 96 Q170 100 168 112",
  ];

  return (
    <div
      style={{
        width: 180, height: 170,
        transform: bounce ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <svg viewBox="0 0 180 170" width={180} height={170}>
        <ellipse cx={90} cy={162} rx={50} ry={6} fill="#D9CFBF" opacity={0.5} />
        <path d={tails[tailPhase]} stroke="#F5C56A" strokeWidth={6} fill="none" strokeLinecap="round" style={{ transition: "d 0.3s ease" }} />
        <ellipse cx={90} cy={125} rx={48} ry={35} fill="#FDDF7E" />
        <ellipse cx={90} cy={132} rx={30} ry={22} fill="#FFF5D6" />
        <ellipse cx={65} cy={152} rx={14} ry={9} fill="#FDDF7E" />
        <ellipse cx={115} cy={152} rx={14} ry={9} fill="#FDDF7E" />
        <ellipse cx={65} cy={155} rx={5} ry={3} fill="#F5C56A" opacity={0.5} />
        <ellipse cx={115} cy={155} rx={5} ry={3} fill="#F5C56A" opacity={0.5} />
        <circle cx={90} cy={68} r={42} fill="#FDDF7E" />
        <path d="M55 45 Q48 12 38 22 Q30 30 50 48" fill="#FDDF7E" />
        <path d="M125 45 Q132 12 142 22 Q150 30 130 48" fill="#FDDF7E" />
        <path d="M55 43 Q50 20 43 27 Q38 32 52 45" fill="#FFB5C5" opacity={0.6} />
        <path d="M125 43 Q130 20 137 27 Q142 32 128 45" fill="#FFB5C5" opacity={0.6} />
        {blink ? (
          <>
            <path d="M68 65 Q76 70 84 65" stroke="#4A3520" strokeWidth={2.5} fill="none" strokeLinecap="round" />
            <path d="M96 65 Q104 70 112 65" stroke="#4A3520" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={76} cy={64} r={9} fill="#4A3520" />
            <circle cx={76} cy={64} r={7} fill="#2A1A08" />
            <circle cx={79} cy={60} r={3} fill="white" />
            <circle cx={73} cy={66} r={1.5} fill="white" opacity={0.6} />
            <circle cx={104} cy={64} r={9} fill="#4A3520" />
            <circle cx={104} cy={64} r={7} fill="#2A1A08" />
            <circle cx={107} cy={60} r={3} fill="white" />
            <circle cx={101} cy={66} r={1.5} fill="white" opacity={0.6} />
          </>
        )}
        <ellipse cx={62} cy={78} rx={8} ry={5} fill="#FFB5C5" opacity={0.4} />
        <ellipse cx={118} cy={78} rx={8} ry={5} fill="#FFB5C5" opacity={0.4} />
        <ellipse cx={90} cy={76} rx={4} ry={3} fill="#FFB5C5" />
        <path d="M83 81 Q87 86 90 82 Q93 86 97 81" stroke="#C4956A" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        <line x1={48} y1={72} x2={70} y2={74} stroke="#E8D5B0" strokeWidth={1} opacity={0.7} />
        <line x1={46} y1={78} x2={69} y2={78} stroke="#E8D5B0" strokeWidth={1} opacity={0.7} />
        <line x1={50} y1={84} x2={70} y2={82} stroke="#E8D5B0" strokeWidth={1} opacity={0.7} />
        <line x1={132} y1={72} x2={110} y2={74} stroke="#E8D5B0" strokeWidth={1} opacity={0.7} />
        <line x1={134} y1={78} x2={111} y2={78} stroke="#E8D5B0" strokeWidth={1} opacity={0.7} />
        <line x1={130} y1={84} x2={110} y2={82} stroke="#E8D5B0" strokeWidth={1} opacity={0.7} />
      </svg>
    </div>
  );
}

export default function PrivacyPage() {
  const router = useRouter();
  const [msgIndex, setMsgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex shrink-0 items-center border-b border-beige-dark px-5 pb-3 pt-4">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
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
        <span className="flex-1 text-center text-[16px] font-semibold text-ink">
          개인정보 처리방침
        </span>
        <div className="w-9" />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {/* 말풍선 — 높이 고정 */}
        <div className="mb-4 flex h-[90px] w-full max-w-[280px] items-center justify-center">
          <div
            className={`relative w-full rounded-[16px] bg-white px-5 py-4 shadow-[0_2px_12px_rgba(30,18,8,0.08)] transition-opacity duration-300 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="whitespace-pre-line text-center text-[14px] leading-[1.7] text-ink-soft">
              {MESSAGES[msgIndex]}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <div className="h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white" />
            </div>
          </div>
        </div>

        {/* 고양이 */}
        <CatAnimation />

        <p className="mt-6 text-[12px] text-ink-muted">
          2026년 4월 19일부터 시행
        </p>
      </div>
    </div>
  );
}
