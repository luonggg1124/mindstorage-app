/* eslint-disable */

import { getStorage, removeStorage, save, setStorage } from "@/utils/stronghold";
import { useState } from "react";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { AuthSDK } from "../_sdk_";

const AUTH_STORAGE_KEY = "auth-store";

type AuthStore = {
    user?: any;
    permissions: string[];
    hasHydrated: boolean;
    hydrate: () => Promise<void>;
    setUser: (next?: any) => void;
    setPermissions: (next: string[]) => void;
    setHasHydrated: (next: boolean) => void;
    clear: () => void;
};

type AuthPersistedState = Pick<AuthStore, "user" | "permissions">;

const strongholdStateStorage = {
    getItem: async (name: string) => {
        return (await getStorage(name)) ?? null;
    },
    setItem: async (name: string, value: string) => {
        await setStorage(name, value);
        await save();
    },
    removeItem: async (name: string) => {
        await removeStorage(name);
        await save();
    },
};

export const useAuthStore = create<AuthStore>()(
    devtools(
        persist(
            (set) => ({
                user: undefined,
                permissions: [],
                hasHydrated: false,

                hydrate: async () => {
                    try {
                        const raw = await getStorage(AUTH_STORAGE_KEY);
                        if (!raw) {
                            set({ hasHydrated: true });
                            return;
                        }
                        const parsed = JSON.parse(raw);
                        set({
                            user: parsed?.state?.user ?? undefined,
                            permissions: Array.isArray(parsed?.state?.permissions)
                                ? parsed.state.permissions
                                : [],
                            hasHydrated: true,
                        });
                    } catch {
                        set({ hasHydrated: true });
                    }
                },

                setUser: (next) => set({ user: next }),
                setPermissions: (next) => set({ permissions: next }),
                setHasHydrated: (next) => set({ hasHydrated: next }),
                clear: () => set({ user: undefined, permissions: [], hasHydrated: true }, false, "auth/clear"),
            }),
            {
                name: AUTH_STORAGE_KEY,
                storage: createJSONStorage<AuthPersistedState>(() => strongholdStateStorage),
                partialize: (state) => ({
                    user: state.user,
                    permissions: state.permissions,
                }),
                onRehydrateStorage: () => (state) => {
                    state?.setHasHydrated(true);
                },
                migrate: (persistedState, oldVersion) => {
                    const state = persistedState as Partial<AuthStore>;
                    if (oldVersion < 2) {
                        return {
                            user: state?.user ?? undefined,
                            permissions: state?.permissions ?? [],
                        } as AuthPersistedState;
                    }
                    return {
                        user: state?.user ?? undefined,
                        permissions: state?.permissions ?? [],
                    } as AuthPersistedState;

                }
            }
        ),
        {
            name: "auth-store-devtools"
        }
    )
);

export const useAuth = () => {
    const user = useAuthStore((s) => s.user);
    const permissions = useAuthStore((s) => s.permissions);
    const hasHydrated = useAuthStore((s) => s.hasHydrated);
    // const hydrate = useAuthStore((s) => s.hydrate);
    // const setUser = useAuthStore((s) => s.setUser);
    // const setPermissions = useAuthStore((s) => s.setPermissions);
    // const clear = useAuthStore((s) => s.clear);
    const [verifyEmailState, setVerifyEmailState] = useState<{
        isLoading: boolean;
        error?: string;
    }>({
        isLoading: false,
        error: undefined,
    });


    const verifyEmail = async (email: string) => {
        try {
            setVerifyEmailState({ isLoading: true, error: undefined });
            const { data } = await AuthSDK.verifyEmail<true>({
                body: {
                    email,
                },
            });

            if (data) {
                setVerifyEmailState({ isLoading: false, error: undefined });
            }
            return;
        } catch (error) {
            setVerifyEmailState({ isLoading: false, error: error as string });
            return;
        }
    }

    return { user, permissions, hasHydrated, verifyEmail, verifyEmailState };
};