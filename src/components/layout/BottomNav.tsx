"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "피드",
    href: "/feed",
    icon: (
      <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <rect x={2} y={2} width={7} height={7} rx={2} />
        <rect x={13} y={2} width={7} height={7} rx={2} />
        <rect x={2} y={13} width={7} height={7} rx={2} />
        <rect x={13} y={13} width={7} height={7} rx={2} />
      </svg>
    ),
  },
  {
    label: "내 노트",
    href: "/notes",
    icon: (
      <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <path d="M6 3H14L19 8V19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V4C5 3.4 5.4 3 6 3Z" />
        <path d="M14 3V8H19" strokeLinejoin="round" />
        <path d="M8 12H14M8 16H11" strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    ),
  },
  null, // FAB
  {
    label: "프로필",
    href: "/profile",
    icon: (
      <svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <circle cx={11} cy={8} r={4} />
        <path d="M3 19C3 16 6.6 14 11 14C15.4 14 19 16 19 19" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 border-t border-beige-dark bg-beige pb-[env(safe-area-inset-bottom)] sm:max-w-[465px] md:max-w-[495px] lg:max-w-[515px]">
      <div className="flex h-[68px] items-center justify-around px-2">
        {navItems.map((item, i) => {
          if (!item) {
            return (
              <Link
                key="fab"
                href="/notes/new"
                className="flex h-[52px] w-[52px] -translate-y-1 items-center justify-center rounded-full bg-wine text-beige shadow-[0_4px_16px_rgba(123,45,45,0.35)] active:bg-wine-light"
              >
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M12 5V19M5 12H19" />
                </svg>
              </Link>
            );
          }

          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-[11px] ${isActive ? "text-wine" : "text-ink-muted"}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
