import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
  nickname: string | null;
  setAuth: (data: {
    isLoggedIn: boolean;
    userId?: number | null;
    nickname?: string | null;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userId: null,
  nickname: null,
  setAuth: ({ isLoggedIn, userId, nickname }) =>
    set({
      isLoggedIn,
      userId: userId ?? null,
      nickname: nickname ?? null,
    }),
  clearAuth: () => set({ isLoggedIn: false, userId: null, nickname: null }),
}));
