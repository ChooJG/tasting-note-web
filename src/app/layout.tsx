import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Tasting Note",
  description: "나만의 술 테이스팅 경험을 기록하고 공유하세요",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-beige-mid">
        <Providers>
          <div className="mx-auto min-h-dvh max-w-[430px] bg-beige shadow-[0_0_24px_rgba(30,18,8,0.08)]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
