import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
  nickname: string | null;
  profileImageUrl: string | null;
  setAuth: (data: {
    isLoggedIn: boolean;
    userId?: number | null;
    nickname?: string | null;
    profileImageUrl?: string | null;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  userId: null,
  nickname: null,
  profileImageUrl: null,
  setAuth: ({ isLoggedIn, userId, nickname, profileImageUrl }) =>
    set({
      isLoggedIn,
      userId: userId ?? null,
      nickname: nickname ?? null,
      profileImageUrl: profileImageUrl ?? null,
    }),
  clearAuth: () => set({ isLoggedIn: false, userId: null, nickname: null, profileImageUrl: null }),
}));
