type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";
function toFormData(data: Record<string, any>): FormData {
    const fd = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (value instanceof File || value instanceof Blob) {
            fd.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((v) => fd.append(key, String(v)));
        } else {
            fd.append(key, String(value));
        }
    });

    return fd;
}




let refreshPromise: Promise<any> | null = null;

// Dùng khi cần upload file với relative URL (client-side)
export async function request<
    Res,
    Err,
    ThrowOnError extends boolean = false,
>(options: {
    url: string;
    method: HttpMethod; // ✅ BẮT BUỘC
    body?: Record<string, any>; // ✅ DELETE có thể không cần body
    headers?: any;
}): Promise<
    ThrowOnError extends true
    ? Res extends Record<string, unknown>
    ? Res[keyof Res]
    : Res
    : (
        | {
            data: Res extends Record<string, unknown>
            ? Res[keyof Res]
            : Res;
            error: undefined;
        }
        | {
            data: undefined;
            error: Err extends Record<string, unknown>
            ? Err[keyof Err]
            : Err;
        }
    ) & {
        response: Response;
    }
> {
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = new URL(options.url, baseUrl);
    const res = await fetch(url.toString(), {
        method: options.method,
        credentials: "include", // Tự động gửi cookies (bao gồm httpOnly token)
        body: options.body ? toFormData(options.body) : undefined,
        headers: options.headers,
    });

    if (res.status === 401 && !options.headers?.["x-retried"]) {
        // if (!refreshPromise) {
        //   refreshPromise = refresh().finally(() => {
        //     refreshPromise = null;
        //   });
        // }

        // const data = await refreshPromise;

        // if (data) {
        //   return callFormClient<Res, Err, ThrowOnError>({
        //     ...options,
        //     headers: {
        //       ...options.headers,
        //       "x-retried": "1",
        //     },
        //   });
        // }
    }

    const text = await res.text();
    const rawData = text ? JSON.parse(text) : null;
    const status = res.status;

    if (!res.ok) {

        let error: any = rawData;
        if (
            rawData &&
            typeof rawData === "object" &&
            !Array.isArray(rawData) &&
            typeof status === "number" &&
            status in rawData
        ) {
            error = (rawData as any)[status];
        }


        return {
            response: res,
            error: error,
            data: undefined,
        } as any;
    }


    let data: any = rawData;
    if (
        rawData &&
        typeof rawData === "object" &&
        !Array.isArray(rawData) &&
        typeof status === "number" &&
        status in rawData
    ) {
        data = (rawData as any)[status];
    }

    return {
        response: res,
        error: undefined,
        data: data,
    } as any;
}
