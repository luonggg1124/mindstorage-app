import { client, safeRequest } from "@/data/client.config";
import type { ApiError } from "@/data/types";
import apiPaths from "@/paths/api";
import type { SuggestionsRequest, SuggestionsResponse } from "./suggestions.type";

export class SuggestionsSDK {
  static async list(request: SuggestionsRequest) {
    const response = await safeRequest(() =>
      client.get<SuggestionsResponse, ApiError, true>({
        url: apiPaths.suggestions.list.getPath(request.query),
        throwOnError: true,
      })
    );
    return response;
  }
}

export type * from "./suggestions.type";

