import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { GroupBySpaceError, GroupBySpaceRequest, GroupBySpaceResponse } from "./by-space.type";
import type { CreateGroupError, CreateGroupRequest, CreateGroupResponse } from "./create-group.type";
import type { GroupDetailError, GroupDetailRequest, GroupDetailResponse } from "./detail-group.type";

export class GroupSDK {
  static async bySpace<ThrowOnError extends boolean = false>(request: GroupBySpaceRequest) {
    const response = await client.get<GroupBySpaceResponse, GroupBySpaceError, ThrowOnError>({
      url: apiPaths.group.bySpace.path,
      path: request.params,
    });
    return response;
  }

  static async detail<ThrowOnError extends boolean = false>(request: GroupDetailRequest) {
    const response = await client.get<GroupDetailResponse, GroupDetailError, ThrowOnError>({
      url: apiPaths.group.detail.getPath(request.params.id),
    });
    return response;
  }

  static async create<ThrowOnError extends boolean = false>(request: CreateGroupRequest) {
    const response = await client.post<CreateGroupResponse, CreateGroupError, ThrowOnError>({
      url: apiPaths.group.create.path,
      body: request.body,
    });
    return response;
  }
}

export type * from "./by-space.type";
export type * from "./create-group.type";
export type * from "./detail-group.type";

