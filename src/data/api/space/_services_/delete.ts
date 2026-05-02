import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiErrorItem } from "@/data/types";
import { SpaceSDK } from "../_sdk_";
import { spaceKeys } from "./get";

export const useDeleteSpace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: { id: string | number }) => {
      const response = await SpaceSDK.delete({ params });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.all });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data?.data,
    error: mutation.error as ApiErrorItem | undefined | null,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};

