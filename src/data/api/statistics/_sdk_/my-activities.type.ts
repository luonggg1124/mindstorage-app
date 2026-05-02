import type { IStatisticsResponseDto } from "../_dto_";

export type MyActivitiesRequest = {
  query?: {
    range?: number;
  };
};

export type MyActivitiesResponse = {
  200: IStatisticsResponseDto;
};

