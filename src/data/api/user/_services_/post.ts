import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserSDK } from "../_sdk_";
import { userKeys } from "./get";

export const useValidUsernamePassword = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({
            username,
            password
        }: {
            username: string,
            password: string
        }) => {
            const response = await UserSDK.validUsernamePassword({
                body: {
                    username,
                    password
                }
            });

            // IMPORTANT: Do not throw here. We want the SDK's `{ data, error }`
            // shape to flow through to callers and also be exposed on the hook.
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all })
        }
    })
    return {
        mutate: mutation.mutate,
        mutateAsync: mutation.mutateAsync,
        data: mutation.data,
        error: mutation.data?.error,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        reset: mutation.reset,
    };
}