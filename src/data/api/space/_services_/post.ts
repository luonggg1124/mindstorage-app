import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiErrorItem } from "@/data/types";
import { SpaceSDK } from "../_sdk_";
import { spaceKeys } from "./get";
import { userKeys } from "@/data/api/user/_services_/get";

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
      queryClient.invalidateQueries({ queryKey: spaceKeys.all });
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

export const useUpdateSpace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, name, description }: { id: string | number; name: string; description?: string }) => {
      const response = await SpaceSDK.update({
        id,
        body: {
          name,
          description: description ?? "",
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spaceKeys.all });
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

