import type { IWeatherResponseDto } from "../_dto_";

export type GetWeatherRequest = {
  query: {
    longitude: number;
    latitude: number;
  };
};

export type GetWeatherResponse = {
  200: IWeatherResponseDto;
};

