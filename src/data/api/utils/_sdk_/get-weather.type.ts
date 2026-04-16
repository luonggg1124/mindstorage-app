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

export type GetWeatherError = {
  [key: number]: {
    message: string;
    status: number;
    field:string;
  };
};

