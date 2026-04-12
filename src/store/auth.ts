import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  nickname: string | null;
  setAuth: (data: { isLoggedIn: boolean; nickname?: string | null }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  nickname: null,
  setAuth: ({ isLoggedIn, nickname }) =>
    set({ isLoggedIn, nickname: nickname ?? null }),
  clearAuth: () => set({ isLoggedIn: false, nickname: null }),
}));
