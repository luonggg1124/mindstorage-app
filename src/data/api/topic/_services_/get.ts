import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TopicSDK } from "../_sdk_";

export const topicKeys = {
  all: ["topic"] as const,
  byGroup: (request: { groupId: string }) => [...topicKeys.all, "by-group", request] as const,
};

export const useTopicsByGroup = (groupId?: string) => {
  const queryClient = useQueryClient();
  const normalizedId = (groupId ?? "").trim();
  const enabled = normalizedId.length > 0;

  const queryKey = { groupId: normalizedId };

  const query = useQuery({
    queryKey: topicKeys.byGroup(queryKey),
    queryFn: async () => {
      const { data } = await TopicSDK.byGroup({ params: { id: normalizedId } });
      
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
      queryClient.invalidateQueries({ queryKey: topicKeys.byGroup(queryKey) });
    },
  };
};
