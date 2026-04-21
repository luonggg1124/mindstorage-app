import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentPosition as getTauriPosition } from "@tauri-apps/plugin-geolocation";

export const geolocationKeys = {
  all: ["geolocation"] as const,
  current: () => [...geolocationKeys.all, "current"] as const,
};

export type GeolocationCoords = {
  lat: number;
  lon: number;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
};

export type GeolocationQueryData = {
  coords: GeolocationCoords;
  timestamp: number;
};

// detect tauri
function isTauriRuntime(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as Window & { __TAURI_INTERNALS__?: unknown; __TAURI__?: unknown };
  return Boolean(w.__TAURI_INTERNALS__ ?? w.__TAURI__);
}

// detect mobile (tauri mobile)
function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad/i.test(navigator.userAgent);
}

// browser geolocation (desktop chuẩn)
function getBrowserPosition(): Promise<GeolocationQueryData> {
  console.log("getBrowserPosition");
  
  console.log("getBrowserPosition");
  
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          coords: {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            accuracy: pos.coords.accuracy ?? null,
            altitude: pos.coords.altitude ?? null,
            heading: pos.coords.heading ?? null,
            speed: pos.coords.speed ?? null,
          },
          timestamp: pos.timestamp,
        });
      },
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  });
}

// tauri mobile geolocation
async function getTauriMobilePosition(): Promise<GeolocationQueryData> {
  console.log("getTauriMobilePosition");
  
  const pos = await getTauriPosition({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60_000,
  });

  return {
    coords: {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
      accuracy: pos.coords.accuracy ?? null,
      altitude: pos.coords.altitude ?? null,
      heading: pos.coords.heading ?? null,
      speed: pos.coords.speed ?? null,
    },
    timestamp: pos.timestamp ?? Date.now(),
  };
}

// main fetch
export async function fetchGeolocationPosition(): Promise<GeolocationQueryData> {
  console.log("fetchGeolocationPosition");
  
  // 1. Desktop hoặc web → dùng navigator (BEST)
  if (!isTauriRuntime() || !isMobile()) {
    const pos = await getBrowserPosition();

    // tránh case (0,0)
    if (pos.coords.lat === 0 && pos.coords.lon === 0) {
      throw new Error("Invalid location (0,0)");
    }

    return pos;
  }

  // 2. Mobile Tauri → dùng plugin
  try {
    return await getTauriMobilePosition();
  } catch {
    // fallback browser nếu plugin fail
    return await getBrowserPosition();
  }
}

export type GeolocationState = {
  supported: boolean;
  loading: boolean;
  coords: GeolocationCoords | null;
  timestamp: number | null;
  error: string | null;
  refresh: () => void;
  invalidate: () => void;
};

type UseGeolocationOptions = {
  enabled?: boolean;
};

export function useGeolocation(options?: UseGeolocationOptions): GeolocationState {
  const queryClient = useQueryClient();

  const supported = typeof navigator !== "undefined" && !!navigator.geolocation;
  const enabled = supported && (options?.enabled !== false);

  const query = useQuery({
    queryKey: geolocationKeys.current(),
    queryFn: fetchGeolocationPosition,
    enabled,
    retry: false,
    
    refetchOnWindowFocus: false,
  });

  const data = query.data;

  return {
    supported,
    loading: query.isPending || query.isFetching,
    coords: data?.coords ?? null,
    timestamp: data?.timestamp ?? null,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
        ? String(query.error)
        : null,
    refresh: () => void query.refetch(),
    invalidate: () =>
      queryClient.invalidateQueries({ queryKey: geolocationKeys.current() }),
  };
}