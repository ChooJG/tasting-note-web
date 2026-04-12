"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { getQueryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/auth";
import { ToastContainer } from "@/components/ui/Toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setAuth(data))
      .catch(() => {});
  }, [setAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer />
    </QueryClientProvider>
  );
}
