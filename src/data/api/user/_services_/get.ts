import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserSDK } from "../_sdk_";

export const userKeys = {
  all: ["users"] as const,
  myProfile: () => [...userKeys.all, "my-profile"] as const,
};

const fetchMyProfile = async () => {
  const { data, error } = await UserSDK.myProfile();
  if (error) {
    throw new Error(error?.message || "Lỗi khi tải hồ sơ của bạn");
  }
  if (!data) {
    throw new Error("Không có dữ liệu hồ sơ");
  }
  return data;
};

export const useMyProfile = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: userKeys.myProfile(),
    queryFn: fetchMyProfile,
    retry: false,
    
    refetchOnWindowFocus: false,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    fetching: query.isFetching,
    refetch: query.refetch,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.myProfile() });
    },
  };
};

export const prefetchMyProfile = (queryClient: QueryClient) => {
  return queryClient.prefetchQuery({
    queryKey: userKeys.myProfile(),
    queryFn: fetchMyProfile,
  });
}