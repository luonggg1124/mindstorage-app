import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGeolocation } from "@/hooks/use-geolocation";
import { UtilsSDK } from "../_sdk_";

export const utilsKeys = {
  all: ["utils"] as const,
  weather: (request: { longitude: number; latitude: number }) =>
    [...utilsKeys.all, "weather", request] as const,
};

function round6(n: number): number {
  return Math.round(n * 1_000_000) / 1_000_000;
}

export const useWeather = () => {
  const queryClient = useQueryClient();
  const geo = useGeolocation({ enabled: true });

  const lat = typeof geo.coords?.lat === "number" ? geo.coords.lat : Number.NaN;
  const lon = typeof geo.coords?.lon === "number" ? geo.coords.lon : Number.NaN;

  const enabled = Number.isFinite(lat) && Number.isFinite(lon);
  const queryKey = { latitude: round6(lat), longitude: round6(lon) };

  const query = useQuery({
    queryKey: utilsKeys.weather(queryKey),
    queryFn: async () => {
      const { data, error } = await UtilsSDK.weather({
        query: {
          latitude: queryKey.latitude,
          longitude: queryKey.longitude,
        },
      });
      if (error) {
        throw new Error(error?.message || "Lỗi khi lấy thời tiết");
      }
      if (!data) {
        throw new Error("Không có dữ liệu thời tiết");
      }
      return data;
    },
    enabled,
    retry: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  return {
    supported: geo.supported,
    coords: geo.coords,
    geoError: geo.error,
    geoLoading: geo.loading,
    loading: geo.loading || query.isLoading,
    data: query.data,
    error: geo.error ? new Error(geo.error) : query.error,
    fetching: query.isFetching,
    refetch: async () => {
      geo.refresh();
      return await query.refetch();
    },
    invalidate: () => {
      if (!enabled) return;
      queryClient.invalidateQueries({ queryKey: utilsKeys.weather(queryKey) });
    },
  };
};

