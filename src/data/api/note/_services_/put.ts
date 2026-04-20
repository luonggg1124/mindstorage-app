import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NoteSDK } from "../_sdk_";
import { noteKeys } from "./get";


export const useUpdateNote = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async (body: { id: string | number; title: string; content?: string; topicId: number }) => {
        const response = await NoteSDK.update({
          params: { id: body.id },
          body: { title: body.title, content: body.content, topicId: body.topicId },
        });
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