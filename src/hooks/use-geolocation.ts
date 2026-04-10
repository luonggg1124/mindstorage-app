import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type GeolocationCoords = {
  lat: number;
  lon: number;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
};

export type GeolocationState = {
  supported: boolean;
  loading: boolean;
  coords: GeolocationCoords | null;
  timestamp: number | null;
  error: string | null;
  refresh: () => void;
};

type Options = {
  /** Auto request location once on mount */
  immediate?: boolean;
  /** Pass-through to the Geolocation API */
  positionOptions?: PositionOptions;
};

function formatGeoError(err: unknown) {
  const fallback = "Không lấy được vị trí.";
  if (!err || typeof err !== "object") return fallback;

  const maybe = err as Partial<GeolocationPositionError>;
  const code = typeof maybe.code === "number" ? maybe.code : null;

  // https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError/code
  if (code === 1) return "Bạn đã từ chối quyền truy cập vị trí.";
  if (code === 2) return "Không thể xác định vị trí (thiết bị/đường truyền).";
  if (code === 3) return "Hết thời gian chờ khi lấy vị trí.";
  return typeof maybe.message === "string" && maybe.message.trim() ? maybe.message : fallback;
}

export function useGeolocation(options?: Options): GeolocationState {
  const supported = typeof window !== "undefined" && "geolocation" in navigator;
  const positionOptions = options?.positionOptions;
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const refresh = useCallback(() => {
    if (!supported) {
      setError("Trình duyệt không hỗ trợ Geolocation.");
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Ignore stale responses if user clicks quickly.
        if (requestId !== requestIdRef.current) return;

        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null,
          altitude: Number.isFinite(pos.coords.altitude ?? NaN) ? (pos.coords.altitude as number) : null,
          heading: Number.isFinite(pos.coords.heading ?? NaN) ? (pos.coords.heading as number) : null,
          speed: Number.isFinite(pos.coords.speed ?? NaN) ? (pos.coords.speed as number) : null,
        });
        setTimestamp(typeof pos.timestamp === "number" ? pos.timestamp : Date.now());
        setLoading(false);
      },
      (err) => {
        if (requestId !== requestIdRef.current) return;
        setError(formatGeoError(err));
        setLoading(false);
      },
      positionOptions
    );
  }, [supported, positionOptions]);

  useEffect(() => {
    if (options?.immediate) refresh();
  }, [options?.immediate, refresh]);

  return useMemo(
    () => ({
      supported,
      loading,
      coords,
      timestamp,
      error,
      refresh,
    }),
    [supported, loading, coords, timestamp, error, refresh]
  );
}

