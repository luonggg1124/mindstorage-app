import type { ISimpleUserDto } from "../_dto_";
import type { IPageResponse } from "@/data/types";

export type SearchUsersRequest = {
  query?: {
    q?: string;
    page?: number;
    size?: number;
  };
};

export type SearchUsersResponse = {
  200: IPageResponse<ISimpleUserDto>;
};

export type SearchUsersError = {
  [key: number]: {
    message: string;
    status: number;
  };
};

