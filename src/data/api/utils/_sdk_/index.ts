import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { GetWeatherError, GetWeatherRequest, GetWeatherResponse } from "./get-weather.type";

export class UtilsSDK {
  static async weather<ThrowOnError extends boolean = false>(request: GetWeatherRequest) {
    const response = await client.get<GetWeatherResponse, GetWeatherError, ThrowOnError>({
      url: apiPaths.utils.weather.getPath(request.query),
    });
    return response;
  }
}

export type * from "./get-weather.type";

