import type { IMySpaceDto } from "../_dto_/my-space.dto";

export type MySpacesRequest = {
  query: {
    q?: string;
    page?: number;
    size?: number;
  };
};

export type MySpacesResponse = {
  200: {
    data: IMySpaceDto[];
    total: number;
    page: number;
    size: number;
  };
};

export type MySpacesError = {
  [key: number]: {
    message: string;
    status: number;
  };
};