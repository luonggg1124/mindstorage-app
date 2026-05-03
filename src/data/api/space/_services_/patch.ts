import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiErrorItem } from "@/data/types";
import type { RoleAction } from "@/data/types/role-action";
import { SpaceSDK } from "../_sdk_";
import { spaceKeys } from "./get";

export const useUpdateSpaceMemberRole = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      spaceId,
      userId,
      role,
    }: {
      spaceId: string;
      userId: number;
      role: RoleAction;
    }) => {
      const response = await SpaceSDK.updateMemberRole({
        params: { spaceId, userId },
        body: { role },
      });
      return response;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...spaceKeys.all, "members"] });
      queryClient.invalidateQueries({ queryKey: spaceKeys.myRoleInSpace(String(variables.spaceId)) });
      queryClient.invalidateQueries({ queryKey: spaceKeys.all });
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
