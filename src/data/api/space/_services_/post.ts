import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SpaceSDK } from "../_sdk_";
import { spaceKeys } from "./get";

export const useCreateSpace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      const response = await SpaceSDK.create({
        body: {
          name,
          description,
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.mySpaces() });
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

