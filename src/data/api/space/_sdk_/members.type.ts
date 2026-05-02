import type { ISpaceMemberUserDto } from "../_dto_";
import type { IPageResponse } from "@/data/types";

export type SpaceMembersRequest = {
  params: {
    id: string;
  };
  query?: {
    q?: string;
    page?: number;
    size?: number;
  };
};

export type SpaceMembersResponse = {
  200: IPageResponse<ISpaceMemberUserDto>;
};

