/* eslint-disable */

import { getStorage, removeStorage, saveStorage, setStorage } from "@/utils/stronghold";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { CACHE_KEYS } from "@/constants";
import { IUser } from "@/data/models/user";

const AUTH_STORAGE_KEY = CACHE_KEYS.AUTH_STORE;

type AuthStore = {
  user?: IUser;
  token?: {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  };
  hasHydrated: boolean;
  setUser: (next?: IUser) => void;
  setToken: (next?: AuthStore["token"]) => void;
  setHasHydrated: (next: boolean) => void;
  clear: () => void;
};

type AuthPersistedState = Pick<AuthStore, "user" | "token">;

const strongholdStateStorage = {
  getItem: async (name: string) => {
    return (await getStorage(name)) ?? null;
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
        token: undefined,
        hasHydrated: false,
        setUser: (next) => set({ user: next }),
        setToken: (next) => set({ token: next }),
        setHasHydrated: (next) => set({ hasHydrated: next }),
        clear: () => set({ user: undefined, token: undefined, hasHydrated: true }, false, "auth/clear"),
      }),
      {
        name: AUTH_STORAGE_KEY,
        storage: createJSONStorage<AuthPersistedState>(() => strongholdStateStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
        migrate: (persistedState) => {
          const state = persistedState as Partial<AuthStore>;
          return {
            user: state?.user ?? undefined,
            token: state?.token ?? undefined,
          } as AuthPersistedState;
        },
      },
    ),
    {
      name: "auth-store-devtools",
    },
  ),
);
