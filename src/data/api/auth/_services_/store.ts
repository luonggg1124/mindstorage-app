/* eslint-disable */

import { getStorage, removeStorage, saveStorage, setStorage } from "@/utils/stronghold";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { CACHE_KEYS } from "@/constants";
import type { IUser } from "@/data/models/user";

const AUTH_STORAGE_KEY = CACHE_KEYS.AUTH_STORE;

type AuthStore = {
  user?: IUser;
  accessToken?: string;
  refreshToken?: string;
  hasHydrated: boolean;
  /** true sau khi initAuth (refresh + /me) xong hoặc sau clear — tránh redirect trước khi đồng bộ session. */
  authBootstrapDone: boolean;
  setUser: (next?: IUser) => void;
  setAccessToken: (next?: string) => void;
  setRefreshToken: (next?: string) => void;
  setHasHydrated: (next: boolean) => void;
  setAuthBootstrapDone: (next: boolean) => void;
  clear: () => void;
};

/** Chỉ lưu Stronghold: refreshToken, không lưu expires / access / user. */
type AuthPersistedState = {
  refreshToken?: string;
};

const strongholdStateStorage = {
  getItem: async (name: string) => {
    const v = (await getStorage(name)) ?? null;
    console.log('v', v);
    return v;
  },
  setItem: async (name: string, value: string) => {
    await setStorage(name, value);
    await saveStorage();
  },
  removeItem: async (name: string) => {
    await removeStorage(name);
    await saveStorage();
  },
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: undefined,
        accessToken: undefined,
        refreshToken: undefined,
        hasHydrated: false,
        authBootstrapDone: false,
        setUser: (next) => set({ user: next }),
        setAccessToken: (next) => set({ accessToken: next }),
        setRefreshToken: (next) => set({ refreshToken: next }),
        setHasHydrated: (next) => set({ hasHydrated: next }),
        setAuthBootstrapDone: (next) => set({ authBootstrapDone: next }),
        clear: () =>
          set(
            { user: undefined, accessToken: undefined, refreshToken: undefined, hasHydrated: true, authBootstrapDone: true },
            false,
            "auth/clear",
          ),
      }),
      {
        name: AUTH_STORAGE_KEY,
        storage: createJSONStorage<AuthPersistedState>(() => strongholdStateStorage),
        version: 2,
        partialize: (state): AuthPersistedState => {
          const rt = state.refreshToken;
          if (!rt) return {};
          return { refreshToken: rt };
        },
        onRehydrateStorage: () => (state) => {
          (state ?? useAuthStore.getState()).setHasHydrated(true);
        },
        migrate: (persistedState): AuthPersistedState => {
          const legacy = persistedState as {
            user?: unknown;
            token?: {
              accessToken?: string;
              refreshToken?: string;
              refreshTokenExpiresIn?: number;
            };
            refreshToken?: string;
          };
          const rt = legacy.refreshToken ?? legacy.token?.refreshToken;
          if (rt != null && rt !== "") {
            return { refreshToken: rt };
          }
          return {};
        },
      },
    ),
    {
      name: "auth-store-devtools",
    },
  ),
);

useAuthStore.persist.onFinishHydration(() => {
  void import("./init-auth").then((m) => m.bootstrapAuthAfterPersist());
});
