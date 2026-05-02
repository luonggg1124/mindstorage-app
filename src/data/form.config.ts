/**
 * Multipart/form-data qua `fetch` + serializer từ `src/data/core`.
 * Header Bearer và cookie credentials giống hướng gọi API thông thường.
 * Bọc `safeRequest` để xử lý 401/refresh giống các SDK call `throwOnError: true`.
 */
import { useAuthStore } from "@/data/api/auth/_services_/store";

import { safeRequest } from "./client.config";
import { formDataBodySerializer } from "./core/bodySerializer.gen";

/** Giống `client.config`: không gửi Bearer cho các route auth (refresh/login/...) */
const AUTH_NO_BEARER_PATHS = [
  "/api/auth/refresh-token",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify-email",
] as const;

function authRequestSkipsBearer(url: string): boolean {
  return AUTH_NO_BEARER_PATHS.some((p) => url.includes(p));
}

export const formBodySerializer = formDataBodySerializer.bodySerializer;

type HttpMethodForm = "POST" | "PUT" | "PATCH";

/** `throwOnError` mặc định **true** (bỏ qua field hoặc không truyền). Truyền `throwOnError: false` để nhận `{ data | error }` thay vì throw. */
export type FormSubmitOptions<ThrowOnError extends boolean = true> = {
  url: string;
  body: Record<string, unknown>;
  /** @default true */
  throwOnError?: ThrowOnError;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

function unwrapByStatus<T>(raw: unknown, status: number): T | undefined {
  if (
    raw &&
    typeof raw === "object" &&
    !Array.isArray(raw) &&
    typeof status === "number" &&
    status in (raw as object)
  ) {
    return (raw as Record<number, T>)[status];
  }
  return raw as T | undefined;
}

function attachFetchError(
  message: string,
  res: Response,
  payload: unknown,
): Error & { status: number; response: Response; error?: unknown } {
  const err = new Error(message) as Error & {
    status: number;
    response: Response;
    error?: unknown;
  };
  err.status = res.status;
  err.response = res;
  err.error = payload;
  return err;
}

async function formFetchOnce<
  Res extends Record<string, unknown>,
  Err extends Record<string, unknown>,
  ThrowOnError extends boolean,
>(
  method: HttpMethodForm,
  options: FormSubmitOptions<ThrowOnError>,
): Promise<
  ThrowOnError extends true
    ? { data: Res extends Record<string, unknown> ? Res[keyof Res] : Res; response: Response }
    :
        | { data: Res extends Record<string, unknown> ? Res[keyof Res] : Res; error: undefined; response: Response }
        | {
            data: undefined;
            error: Err extends Record<string, unknown> ? Err[keyof Err] : Err;
            response: Response;
          }
> {
  const baseUrl = import.meta.env.VITE_API_URL as string;
  const url = new URL(options.url, baseUrl);

  const headers = new Headers(options.headers);
  if (!authRequestSkipsBearer(url.toString())) {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const body = formBodySerializer(options.body) as FormData;

  const res = await fetch(url.toString(), {
    method,
    body,
    headers,
    credentials: "include",
    signal: options.signal,
  });

  const text = await res.text();
  let raw: unknown = null;
  try {
    raw = text ? JSON.parse(text) : null;
  } catch {
    raw = text;
  }

  const status = res.status;
  const throwOnError = options.throwOnError !== false;

  if (!res.ok) {
    const errorPayload =
      (unwrapByStatus<Err extends Record<string, unknown> ? Err[keyof Err] : Err>(raw, status) as Err[keyof Err]) ??
      raw;

    /** Luôn throw 401 để `safeRequest` có thể refresh token và gọi lại */
    if (status === 401) {
      throw attachFetchError(
        typeof (errorPayload as { message?: string })?.message === "string"
          ? (errorPayload as { message: string }).message
          : "Unauthorized",
        res,
        errorPayload,
      );
    }

    if (throwOnError) {
      throw attachFetchError(
        typeof (errorPayload as { message?: string })?.message === "string"
          ? (errorPayload as { message: string }).message
          : res.statusText || `HTTP ${status}`,
        res,
        errorPayload,
      );
    }

    return {
      data: undefined,
      error: errorPayload as Err extends Record<string, unknown> ? Err[keyof Err] : Err,
      response: res,
    } as never;
  }

  const data = unwrapByStatus<Res extends Record<string, unknown> ? Res[keyof Res] : Res>(raw, status) ?? raw;

  if (throwOnError) {
    return { data, response: res } as never;
  }

  return {
    data,
    error: undefined,
    response: res,
  } as never;
}

/**
 * Serialize plain object → `FormData` (`src/data/core/bodySerializer.gen.ts`).
 */
export function toFormData(body: Record<string, unknown>): FormData {
  return formBodySerializer(body) as FormData;
}

export function formSubmit<
  Res extends Record<string, unknown>,
  Err extends Record<string, unknown>,
  ThrowOnError extends boolean = true,
>(options: FormSubmitOptions<ThrowOnError> & { method: HttpMethodForm }) {
  const { method, ...opts } = options;
  return safeRequest(() =>
    formFetchOnce<Res, Err, ThrowOnError>(method, opts as FormSubmitOptions<ThrowOnError>),
  );
}

export function formPost<
  Res extends Record<string, unknown>,
  Err extends Record<string, unknown>,
  ThrowOnError extends boolean = true,
>(options: FormSubmitOptions<ThrowOnError>) {
  return safeRequest(() => formFetchOnce<Res, Err, ThrowOnError>("POST", options));
}

export function formPut<
  Res extends Record<string, unknown>,
  Err extends Record<string, unknown>,
  ThrowOnError extends boolean = true,
>(options: FormSubmitOptions<ThrowOnError>) {
  return safeRequest(() => formFetchOnce<Res, Err, ThrowOnError>("PUT", options));
}

export function formPatch<
  Res extends Record<string, unknown>,
  Err extends Record<string, unknown>,
  ThrowOnError extends boolean = true,
>(options: FormSubmitOptions<ThrowOnError>) {
  return safeRequest(() => formFetchOnce<Res, Err, ThrowOnError>("PATCH", options));
}
