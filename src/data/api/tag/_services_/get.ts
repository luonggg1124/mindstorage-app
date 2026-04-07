import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TagSDK } from "../_sdk_";

export const tagKeys = {
  all: ["tag"] as const,
  byGroup: (request: { groupId: string }) => [...tagKeys.all, "by-group", request] as const,
};

export const useTagsByGroup = (groupId?: string) => {
  const queryClient = useQueryClient();
  const normalizedId = (groupId ?? "").trim();
  const enabled = normalizedId.length > 0;

  const queryKey = { groupId: normalizedId };

  const query = useQuery({
    queryKey: tagKeys.byGroup(queryKey),
    queryFn: async () => {
      const { data, error } = await TagSDK.byGroup({ params: { id: normalizedId } });
      if (error) {
        throw new Error(error?.message || "Lỗi khi lấy danh sách thẻ");
      }
      return Array.isArray(data) ? data : [];
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
      queryClient.invalidateQueries({ queryKey: tagKeys.byGroup(queryKey) });
    },
  };
};

