import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkPermissions,
  getCurrentPosition,
  requestPermissions,
} from "@tauri-apps/plugin-geolocation";

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

function isTauriRuntime(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as Window & { __TAURI_INTERNALS__?: unknown; __TAURI__?: unknown };
  return Boolean(w.__TAURI_INTERNALS__ ?? w.__TAURI__);
}

export async function fetchGeolocationPosition(): Promise<GeolocationQueryData> {
  let perm = await checkPermissions();

  if (perm.location !== "granted") {
    perm = await requestPermissions(["location"]);
  }

  if (perm.location !== "granted") {
    throw new Error("Location permission denied");
  }

  const pos = await getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
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
  /** Khi `false`, không tự fetch lúc mount (vẫn có thể gọi `refresh`). */
  enabled?: boolean;
};

export function useGeolocation(options?: UseGeolocationOptions): GeolocationState {
  const queryClient = useQueryClient();
  const supported = isTauriRuntime();
  const enabled = supported && (options?.enabled !== false);

  const query = useQuery({
    queryKey: geolocationKeys.current(),
    queryFn: fetchGeolocationPosition,
    enabled,
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const data = query.data;

  return {
    supported,
    loading: query.isPending || query.isFetching,
    coords: data?.coords ?? null,
    timestamp: data?.timestamp ?? null,
    error: query.error instanceof Error ? query.error.message : query.error ? String(query.error) : null,
    refresh: () => {
      void query.refetch();
    },
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: geolocationKeys.current() });
    },
  };
}
