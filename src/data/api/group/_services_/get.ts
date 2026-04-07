import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GroupSDK } from "../_sdk_";

export const groupKeys = {
  all: ["group"] as const,
  bySpace: (request: { spaceId: string | number }) => [...groupKeys.all, "by-space", request] as const,
  detail: (request: { id: string | number }) => [...groupKeys.all, "detail", request] as const,
};



export const useGroupBySpace = (spaceId?: string) => {
  const queryClient = useQueryClient();
  const normalizedId = (spaceId ?? "").trim();
  const enabled = normalizedId.length > 0;

  const queryKey = { spaceId: normalizedId };

  const query = useQuery({
    queryKey: groupKeys.bySpace(queryKey),
    queryFn: async () => {
      const { data, error } = await GroupSDK.bySpace({ params: { spaceId: normalizedId } });
      if (error) {
        throw new Error(error?.message || "Lỗi khi lấy danh sách group");
      }
      return Array.isArray(data) ? data : [];
    },
    enabled,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    mutate: () => query.refetch(),
    fetching: query.isFetching,
    refetch: query.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.bySpace(queryKey) });
    },
  };
};

export const useDetailGroup = (id?: string) => {
  const queryClient = useQueryClient();
  const normalizedId = (id ?? "").trim();
  const enabled = normalizedId.length > 0;

  const queryKey = { id: normalizedId };

  const query = useQuery({
    queryKey: groupKeys.detail(queryKey),
    queryFn: async () => {
      const { data, error } = await GroupSDK.detail({ params: { id: Number(normalizedId) } });
      if (error) {
        throw new Error(error?.message || "Lỗi khi lấy chi tiết group");
      }
      if (!data) {
        throw new Error("Không tìm thấy group");
      }
      return data;
    },
    enabled,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    fetching: query.isFetching,
    refetch: query.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(queryKey) });
    },
  };
};


