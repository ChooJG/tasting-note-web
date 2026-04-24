import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
  nickname: string | null;
  profileImageUrl: string | null;
  _hasHydrated: boolean;
  setAuth: (data: {
    isLoggedIn: boolean;
    userId?: number | null;
    nickname?: string | null;
    profileImageUrl?: string | null;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userId: null,
      nickname: null,
      profileImageUrl: null,
      _hasHydrated: false,
      setAuth: ({ isLoggedIn, userId, nickname, profileImageUrl }) =>
        set((prev) => ({
          isLoggedIn,
          userId: userId ?? prev.userId,
          nickname: nickname ?? prev.nickname,
          profileImageUrl: profileImageUrl !== undefined ? profileImageUrl : prev.profileImageUrl,
        })),
      clearAuth: () =>
        set({ isLoggedIn: false, userId: null, nickname: null, profileImageUrl: null }),
    }),
    {
      name: "sip-auth",
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ _hasHydrated: true });
      },
    }
  )
);
