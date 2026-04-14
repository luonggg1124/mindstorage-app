import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NavigateFunction } from "react-router";
import { Link, useNavigate } from "react-router";

import type { LoginSchema } from "./schema";
import { loginSchema } from "./schema";
import clientPaths from "@/paths/client";
import { useAuth } from "@/data/api/auth";
import { toast } from "@/lib/toast";
import { AuthDividerOr, GoogleSignInButton } from "@/components/auth/google-sign-in-button";

async function submitLoginForm(
  values: LoginSchema,
  signIn: ReturnType<typeof useAuth>["login"],
  navigate: NavigateFunction,
) {
  const data = await signIn({
    username: values.username,
    password: values.password,
  });
  if (data) {
    toast.success("Đăng nhập thành công.");
    navigate(clientPaths.space.list.getPath());
  }
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: signIn, loginState } = useAuth();
  const [remember, setRemember] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const username = form.watch("username");
  const password = form.watch("password");

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-lg font-semibold text-white">Đăng nhập</h1>
        <p className="mt-1 text-xs text-slate-400">Nhập tài khoản và mật khẩu để tiếp tục.</p>
      </div>

      <GoogleSignInButton mode="login" />
      <AuthDividerOr />

      <form
        onSubmit={form.handleSubmit((values) => submitLoginForm(values, signIn, navigate))}
        className="space-y-4"
      >
      <div className="rounded-xl border border-white/10 bg-slate-950/15 p-4 backdrop-blur overflow-hidden space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="login-username">
            Tên tài khoản
          </label>
          <input
            id="login-username"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={loginState.isLoading}
            className="w-full rounded-full border border-slate-700 bg-slate-900 p-3 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="luong.1124"
            {...form.register("username")}
          />
          {form.formState.errors.username && (
            <p className="mt-1 text-xs text-amber-200">{form.formState.errors.username.message}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">4–20 ký tự, chỉ chữ/số và dấu gạch dưới.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-200" htmlFor="login-password">
            Mật khẩu
          </label>
          <input
            id="login-password"
            type="password"
            disabled={loginState.isLoading}
            className="w-full rounded-full border border-slate-700 bg-slate-900 p-3 text-sm text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="********"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="mt-1 text-xs text-amber-200">{form.formState.errors.password.message}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">Tối thiểu 8 ký tự.</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500"
            />
            Ghi nhớ đăng nhập
          </label>
          <span className="text-sm text-indigo-300/80">Quên mật khẩu?</span>
        </div>
      </div>

      {loginState.error?.message && (
        <div className="rounded-lg border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          {loginState.error.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loginState.isLoading || !username?.trim() || !password}
        className="w-full rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loginState.isLoading ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>

      <p className="text-center text-sm text-slate-300">
        Chưa có tài khoản?{" "}
        <Link to={clientPaths.auth.register.getPath()} className="font-semibold text-indigo-300 hover:text-indigo-200">
          Đăng ký ngay
        </Link>
      </p>
      </form>
    </div>
  );
};

export default LoginPage;
