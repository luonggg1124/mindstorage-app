import type { IDetailGroupDto } from "../_dto_";

export type UpdateGroupRequest = {
  params: {
    id: string | number;
  };
  body: {
    name: string;
    description?: string;
  };
};

export type UpdateGroupResponse = {
  201: IDetailGroupDto;
};

export type UpdateGroupError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

