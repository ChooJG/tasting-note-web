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

    // bfcache에서 복원될 때 auth 재동기화 + 멈춘 쿼리 재실행
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        syncAuth();
        queryClient.refetchQueries({ type: "active" });
      }
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
