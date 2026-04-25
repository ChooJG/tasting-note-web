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
    const syncAuth = () => {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => setAuth(data))
        .catch(() => {});
    };

    syncAuth();

    // bfcache에서 복원될 때: 항상 reload해서 auth/데이터 상태를 최신으로 유지
    const handlePageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      window.location.reload();
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [setAuth, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer />
    </QueryClientProvider>
  );
}
