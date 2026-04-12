"use client";

import { useEffect } from "react";
import { create } from "zustand";

interface ToastState {
  message: string | null;
  show: (message: string) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  show: (message) => set({ message }),
  hide: () => set({ message: null }),
}));

export function toast(message: string) {
  useToastStore.getState().show(message);
}

export function ToastContainer() {
  const { message, hide } = useToastStore();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(hide, 2200);
    return () => clearTimeout(timer);
  }, [message, hide]);

  if (!message) return null;

  return (
    <div className="fixed bottom-[100px] left-1/2 z-50 -translate-x-1/2">
      <div className="animate-toastIn rounded-pill bg-ink px-5 py-2.5 text-[14px] text-beige shadow-lg">
        {message}
      </div>
    </div>
  );
}
