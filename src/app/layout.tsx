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
      <body className="min-h-full bg-beige sm:flex sm:items-center sm:justify-center sm:bg-[#C8BEB4] sm:py-8">
        <Providers>
          <div className="mx-auto min-h-dvh max-w-[430px] bg-beige sm:min-h-[844px] sm:rounded-device sm:shadow-[0_0_0_10px_#1a1a1a,0_40px_80px_rgba(0,0,0,0.4)] sm:overflow-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
