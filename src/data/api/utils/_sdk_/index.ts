import { client, safeRequest } from "@/data/client.config";
import type { ApiError } from "@/data/types";
import apiPaths from "@/paths/api";
import type { GetWeatherRequest, GetWeatherResponse } from "./get-weather.type";

export class UtilsSDK {
  static async weather(request: GetWeatherRequest) {
    const response = await safeRequest(() =>
      client.get<GetWeatherResponse, ApiError, true>({
        url: apiPaths.utils.weather.getPath(request.query),
        throwOnError: true,
      })
    );
    return response;
  }
}

export type * from "./get-weather.type";

