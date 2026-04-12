export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col justify-center px-6 py-10">
      {children}
    </div>
  );
}
