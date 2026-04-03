/* eslint-disable */

import { getStorage, removeStorage, saveStorage, setStorage } from "@/utils/stronghold";
import { useState } from "react";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { AuthSDK } from "../_sdk_";
import { CACHE_KEYS } from "@/constants";

    const AUTH_STORAGE_KEY = CACHE_KEYS.AUTH_STORE;

    type AuthStore = {
        user?: any;
        token?: {
            accessToken: string;
            refreshToken: string;
            refreshTokenExpiresIn: number;
        };
        hasHydrated: boolean;
        setUser: (next?: any) => void;
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
    const token = useAuthStore((s) => s.token);
    const hasHydrated = useAuthStore((s) => s.hasHydrated);
    // const hydrate = useAuthStore((s) => s.hydrate);
    // const setUser = useAuthStore((s) => s.setUser);
    const setToken = useAuthStore((s) => s.setToken);
    // const clear = useAuthStore((s) => s.clear);
    const [verifyEmailState, setVerifyEmailState] = useState<{
        isLoading: boolean;
        error?: {
            message: string;
            status:number;
            field?:string;
        };
    }>({
        isLoading: false,
        error: undefined,
    });

    const [registerState, setRegisterState] = useState<{
        isLoading: boolean;
        error?: {
            message: string;
            status: number;
            field?: string;
        };
    }>({
        isLoading: false,
        error: undefined,
    });


    const verifyEmail = async (email: string) => {
        setVerifyEmailState({ isLoading: true, error: undefined });
        const { data,error } = await AuthSDK.verifyEmail({
            body: {
                email,
            },
        });
        if(error){
            setVerifyEmailState({ isLoading: false, error });
        }
        if (data) {
            setVerifyEmailState({ isLoading: false, error: undefined });
            return data;
        }
        return undefined;
        
    }

    const register = async (body: {
        email: string;
        username: string;
        password: string;
        session: string;
        code: string;
        fullName?: string;
        hobbies?: string[];
    }) => {
        setRegisterState({ isLoading: true, error: undefined });
        const { data, error } = await AuthSDK.register({
            body: {
                email: body.email,
                username: body.username,
                password: body.password,
                session: body.session,
                code: body.code,
                fullName: body.fullName ?? "",
                hobbies: body.hobbies ?? [],
            },
        });
        if (error) {
            setRegisterState({ isLoading: false, error });
            return undefined;
        }
        if (data) {
         
            setToken({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                refreshTokenExpiresIn: data.refreshTokenExpiresIn,
            });
            setRegisterState({ isLoading: false, error: undefined });
            return data;
        }
        setRegisterState({ isLoading: false, error: undefined });
        return undefined;
    };

    return { user, token, hasHydrated, verifyEmail, verifyEmailState, register, registerState };
};