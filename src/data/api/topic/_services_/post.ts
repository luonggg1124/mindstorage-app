import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiErrorItem } from "@/data/types";
import { TopicSDK } from "../_sdk_";
import { topicKeys } from "./get";

export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: { name: string; groupId: string }) => {
      const response = await TopicSDK.create({ body });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.all });
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
