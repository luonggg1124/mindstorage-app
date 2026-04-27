import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InvitationSDK } from "../_sdk_";

export const invitationKeys = {
  all: ["invitation"] as const,
};

export const useInvite = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: { inviteeId: number; entityId: string; entityType: "SPACE" | "GROUP" }) => {
      const response = await InvitationSDK.invite({ body });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all });
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

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: { id: string }) => {
      const response = await InvitationSDK.accept({ params: { id: body.id } });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all });
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

export const useRejectInvitation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: { id: string }) => {
      const response = await InvitationSDK.reject({ params: { id: body.id } });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.all });
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

