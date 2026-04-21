import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TopicSDK } from "../_sdk_";
import { topicKeys } from "./get";

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: { id: string | number; name: string; groupId: string }) => {
      const response = await TopicSDK.update({
        params: { id: body.id },
        body: { name: body.name, groupId: body.groupId },
      });
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
    error: mutation.data?.error,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};

