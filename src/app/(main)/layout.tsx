import { BottomNav } from "@/components/layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col pb-[80px]">
      {children}
      <BottomNav />
    </div>
  );
}
