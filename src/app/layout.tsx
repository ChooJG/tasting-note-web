import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casknote.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Tasting Note",
  description: "나만의 술 테이스팅 경험을 기록하고 공유하세요",
  openGraph: {
    title: "Tasting Note",
    description: "나만의 술 테이스팅 경험을 기록하고 공유하세요",
    images: [{ url: "/preview-image-og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasting Note",
    description: "나만의 술 테이스팅 경험을 기록하고 공유하세요",
    images: ["/preview-image-og.jpg"],
  },
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
          <div className="mx-auto min-h-dvh max-w-[430px] bg-beige shadow-[0_0_40px_rgba(30,18,8,0.18)] sm:max-w-[450px] md:max-w-[475px] lg:max-w-[490px]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
