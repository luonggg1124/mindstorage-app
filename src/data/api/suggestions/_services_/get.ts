import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiErrorItem } from "@/data/types";
import { SuggestionsSDK } from "../_sdk_";

export const suggestionKeys = {
  all: ["suggestions"] as const,
  list: (request: { limit: number }) => [...suggestionKeys.all, "list", request] as const,
};

export const useSuggestions = (limit = 5) => {
  const queryClient = useQueryClient();
  const normalizedLimit = Number.isFinite(Number(limit)) ? Math.max(1, Number(limit)) : 5;

  const queryKey = { limit: normalizedLimit };

  const query = useQuery({
    queryKey: suggestionKeys.list(queryKey),
    queryFn: async () => {
      const response = await SuggestionsSDK.list({ query: { limit: normalizedLimit } });
      return response.data ?? [];
    },
  });

  return {
    loading: query.isLoading,
    fetching: query.isFetching,
    data: query.data,
    error: query.error as ApiErrorItem | undefined | null,
    refetch: query.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: suggestionKeys.list(queryKey) }),
  };
};

