import type { IGroupBySpaceDto } from "../_dto_/group-by-space.dto";

export type GroupBySpaceRequest = {
  params: {
    spaceId: string;
  }
};

export type GroupBySpaceResponse = {
  200: IGroupBySpaceDto[];
};

export type GroupBySpaceError = {
  [key: number]: {
    message: string;
    status: number;
  };
};

