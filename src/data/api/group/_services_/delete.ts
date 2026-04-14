import { useMutation, useQueryClient } from "@tanstack/react-query";

import { GroupSDK } from "../_sdk_";
import { groupKeys } from "./get";

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: { id: string | number }) => {
      const response = await GroupSDK.delete({ params });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data?.data,
    error: mutation.data?.error,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};

