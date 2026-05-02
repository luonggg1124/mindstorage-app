import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiErrorItem } from "@/data/types";
import { NoteSDK } from "../_sdk_";
import { noteKeys } from "./get";

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: { id: string | number }) => {
      const response = await NoteSDK.delete({ params });
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
    error: mutation.error as ApiErrorItem | undefined | null,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};

