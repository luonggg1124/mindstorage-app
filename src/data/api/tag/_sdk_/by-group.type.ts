import type { ITagByGroupDto } from "../_dto_/tag-by-group.dto";

export type TagsByGroupRequest = {
  params: {
    id: string;
  };
};

export type TagsByGroupResponse = {
  200: ITagByGroupDto[];
};

export type TagsByGroupError = {
  [key: number]: {
    message: string;
    status: number;
  };
};

