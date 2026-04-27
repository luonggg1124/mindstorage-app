import type { IInviteUserDto, InvitationTypeDto } from "../_dto_";
import type { IPageResponse } from "@/data/types";

export type SearchInviteUsersRequest = {
  query: {
    q?: string;
    page?: number;
    size?: number;
    type: InvitationTypeDto;
    entityId: string;
  };
};

export type SearchInviteUsersResponse = {
  200: IPageResponse<IInviteUserDto>;
};

export type SearchInviteUsersError = {
  [key: number]: {
    message: string;
    status: number;
  };
};

