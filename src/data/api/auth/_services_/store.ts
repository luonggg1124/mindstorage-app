/* eslint-disable */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { IUser } from "@/data/models/user";

type AuthStore = {
  user?: IUser;
  accessToken?: string;
  refreshToken?: string;
  hasHydrated: boolean;
  setUser: (next?: IUser) => void;
  setAccessToken: (next?: string) => void;
  setRefreshToken: (next?: string) => void;
  setHasHydrated: (next: boolean) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      // Không persist gì cả: mỗi lần mở app sẽ bắt đăng nhập lại.
      hasHydrated: true,
      setUser: (next) => set({ user: next }),
      setAccessToken: (next) => set({ accessToken: next }),
      setRefreshToken: (next) => set({ refreshToken: next }),
      setHasHydrated: (next) => set({ hasHydrated: next }),
      clear: () =>
        set(
          { user: undefined, accessToken: undefined, refreshToken: undefined, hasHydrated: true },
          false,
          "auth/clear",
        ),
    }),
    {
      name: "auth-store-devtools",
    },
  ),
);
