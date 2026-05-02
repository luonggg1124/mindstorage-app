import type { IGroupBySpaceDto } from "../_dto_/group-by-space.dto";

export type GroupBySpaceRequest = {
  params: {
    spaceId: string;
  };
  query?: {
    q?: string;
    page?: number;
    size?: number;
  };
};

export type GroupBySpaceResponse = {
  200: {
    data: IGroupBySpaceDto[];
    total: number;
    page: number;
    size: number;
  };
};

