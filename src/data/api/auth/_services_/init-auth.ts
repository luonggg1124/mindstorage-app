/* eslint-disable */

import { AuthSDK } from "../_sdk_";
import { useAuthStore } from "./store";

/**
 * Chạy sau khi persist hydrate xong (`onFinishHydration`): lúc này `token.refreshToken` đã có trong store.
 * Không dùng `useEffect` trong `useAuth` làm bước duy nhất — dễ race / `initAuthPromise` chặn lần sau.
 */
export async function bootstrapAuthAfterPersist(): Promise<void> {
  try {
    const { refreshToken, setAccessToken, setRefreshToken, setUser, clear } = useAuthStore.getState();
   
    
    if (!refreshToken) return;

    const ref = await AuthSDK.refreshToken({ body: { refreshToken } });
    if (ref.error || !ref.data) {
      if (ref.response?.status === 401 || ref.response?.status === 400) {
        clear();
      }
      return;
    }
    const d = ref.data;
    setAccessToken(d.accessToken);
    setRefreshToken(d.refreshToken);
    setUser(d.user);
  } finally {
    // auth-store hiện không có cờ bootstrap; giữ finally để đảm bảo flow không bị throw
  }
}

/** Gọi tay nếu cần (cùng logic với sau hydrate). */
export function initAuth(): Promise<void> {
  return bootstrapAuthAfterPersist();
}
