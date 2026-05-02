import { useQuery, useQueryClient } from "@tanstack/react-query";

import { StatisticsSDK } from "../_sdk_";
import { ApiErrorItem } from "@/data/types";

import { noteKeys } from "../../note";
import { topicKeys } from "../../topic";

export const statisticsKeys = {
  all: ["statistics",noteKeys.all, topicKeys.all] as const,
  myActivities: (request: { range: number }) => [...statisticsKeys.all, "my-activities", request] as const,
};

export const useMyActivities = (range: 7 | 30 = 7) => {
  const queryClient = useQueryClient();
  const normalizedRange = range === 30 ? 30 : 7;

  const query = useQuery({
    queryKey: statisticsKeys.myActivities({ range: normalizedRange }),
    queryFn: async () => {
      const response = await StatisticsSDK.myActivities({ query: { range: normalizedRange } });
      return response.data;
    },
  });

  return {
    loading: query.isLoading,
    fetching: query.isFetching,
    data: query.data,
    error: query.error as ApiErrorItem | undefined | null,
    refetch: query.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: statisticsKeys.myActivities({ range: normalizedRange }) }),
  };
};

