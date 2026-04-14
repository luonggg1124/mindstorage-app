/* eslint-disable */

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthSDK } from "../_sdk_";
import { useAuthStore } from "./store";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setRefreshToken = useAuthStore((s) => s.setRefreshToken);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  const [logoutState, setLogoutState] = useState<{
    isLoading: boolean;
    error?: { message: string };
  }>({
    isLoading: false,
    error: undefined,
  });

  const [verifyEmailState, setVerifyEmailState] = useState<{
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

  const [loginState, setLoginState] = useState<{
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

  const logout = useCallback(async () => {
    setLogoutState({ isLoading: true, error: undefined });
    try {
      clear();
      queryClient.clear();
      setLogoutState({ isLoading: false, error: undefined });
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Đăng xuất thất bại.";
      setLogoutState({ isLoading: false, error: { message } });
      return false;
    }
  }, [clear, queryClient]);
  const verifyEmail = async (email: string) => {
    setVerifyEmailState({ isLoading: true, error: undefined });
    const { data, error } = await AuthSDK.verifyEmail({
      body: {
        email,
      },
    });
    if (error) {
      setVerifyEmailState({ isLoading: false, error });
    }
    if (data) {
      setVerifyEmailState({ isLoading: false, error: undefined });
      return data;
    }
    return undefined;
  };

  const register = async (body: {
    email: string;
    username: string;
    password: string;
    session: string;
    code: string;
    fullName?: string;
    hobbies?: string;
    intendedUse?: string;
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
        hobbies: body.hobbies ?? "",
        intendedUse: body.intendedUse ?? "",
      },
    });
    if (error) {
      setRegisterState({ isLoading: false, error });
      return undefined;
    }
    if (data) {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);
      setRegisterState({ isLoading: false, error: undefined });
      return data;
    }
    setRegisterState({ isLoading: false, error: undefined });
    return undefined;
  };

  const login = async (body: { username: string; password: string }) => {
    setLoginState({ isLoading: true, error: undefined });
    const { data, error } = await AuthSDK.login({
      body: {
        username: body.username.trim(),
        password: body.password,
      },
    });
    if (error) {
      setLoginState({ isLoading: false, error });
      return undefined;
    }
    
    
    if (data) {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);
      setLoginState({ isLoading: false, error: undefined });
      return data;
    }
    setLoginState({ isLoading: false, error: undefined });
    return undefined;
  };

  return {
    user,
    accessToken,
    refreshToken,
    hasHydrated,
    verifyEmail,
    verifyEmailState,
    register,
    registerState,
    login,
    loginState,
    logout,
    logoutState,
  };
};
