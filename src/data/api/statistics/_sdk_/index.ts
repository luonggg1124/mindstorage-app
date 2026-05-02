import { client, safeRequest } from "@/data/client.config";
import type { ApiError } from "@/data/types";
import apiPaths from "@/paths/api";
import type { MyActivitiesRequest, MyActivitiesResponse } from "./my-activities.type";

export class StatisticsSDK {
  static async myActivities(request: MyActivitiesRequest) {
    const response = await safeRequest(() =>
      client.get<MyActivitiesResponse, ApiError, true>({
        url: apiPaths.statistics.myActivities.getPath(request.query),
        throwOnError: true,
      })
    );
    return response;
  }
}

export type * from "./my-activities.type";

