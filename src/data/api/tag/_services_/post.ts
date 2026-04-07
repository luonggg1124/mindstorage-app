import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TagSDK } from "../_sdk_";
import { tagKeys } from "./get";

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: { name: string; groupId: number }) => {
      const response = await TagSDK.create({ body });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
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

