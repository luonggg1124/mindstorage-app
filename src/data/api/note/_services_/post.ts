import { useMutation, useQueryClient } from "@tanstack/react-query";

import { NoteSDK } from "../_sdk_";
import { noteKeys } from "./get";

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: { title: string; content?: string; topicId: number; parentId?: number | null }) => {
      const response = await NoteSDK.create({ body });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all });
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



