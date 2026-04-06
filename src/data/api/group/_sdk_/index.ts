import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { GroupBySpaceError, GroupBySpaceRequest, GroupBySpaceResponse } from "./by-space.type";

export class GroupSDK {
  static async bySpace<ThrowOnError extends boolean = false>(request: GroupBySpaceRequest) {
    const response = await client.get<GroupBySpaceResponse, GroupBySpaceError, ThrowOnError>({
      url: apiPaths.group.bySpace.path,
      path: request.params,
    });
    return response;
  }
}

export type * from "./by-space.type";

