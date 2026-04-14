import type { ISpaceDetailDto } from "../_dto_/space-detail.dto";

export type SpaceDetailRequest = {
  id: string | number;
};

export type SpaceDetailResponse = {
  200: ISpaceDetailDto;
};

export type SpaceDetailError = {
  [key: number]: {
    message: string;
    status: number;
  };
};
