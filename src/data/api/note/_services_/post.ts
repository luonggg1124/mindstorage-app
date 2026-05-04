import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiErrorItem } from "@/data/types";
import { NoteSDK } from "../_sdk_";
import { noteKeys } from "./get";
import { userKeys } from "@/data/api/user/_services_/get";

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: { title: string; content?: string; topicId: string; parentId?: string | null }) => {
      const response = await NoteSDK.create({ body });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.myProfile() });
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



