import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupSDK } from "../_sdk_";
import { groupKeys } from "./get";

export const useCreateGroup = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async (body: { name: string; description: string; spaceId: string }) => {
        const response = await GroupSDK.create({
          body,
        });
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

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ( body: { id: string | number; name: string; description?: string; spaceId: string }) => {
      const response = await GroupSDK.update({
        params: { id: body.id },
        body: {
          name: body.name,
          description: body.description ?? "",
          spaceId: body.spaceId,
        },
      });
      return response;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail({ id: variables.id }) });
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
  