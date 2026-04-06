import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/data/api/auth";
import { SpaceSDK } from "../_sdk_";

export const spaceKeys = {
  all: ["space"] as const,
  mySpaces: () => [...spaceKeys.all, "my-spaces"] as const,
};

export const useMySpaces = () => {
  const queryClient = useQueryClient();
  const { accessToken, hasHydrated } = useAuth();

  const query = useQuery({
    queryKey: spaceKeys.mySpaces(),
    queryFn: async () => {
      const { data, error } = await SpaceSDK.mySpaces();
      if (error) {
        throw new Error(error?.message || "Lỗi khi lấy danh sách spaces");
      }
      return data;
    },
    enabled: hasHydrated && !!accessToken,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    mutate: () => query.refetch(),
    fetching: query.isFetching,
    refetch: query.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.mySpaces() });
    },
  };
};
