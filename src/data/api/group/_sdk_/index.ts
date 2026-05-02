import { client, safeRequest } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { ApiError } from "@/data/types";
import type { GroupBySpaceRequest, GroupBySpaceResponse } from "./by-space.type";
import type { CreateGroupRequest, CreateGroupResponse } from "./create-group.type";
import type { GroupDetailRequest, GroupDetailResponse } from "./detail-group.type";
import type { UpdateGroupRequest, UpdateGroupResponse } from "./update-group.type";
import type { DeleteGroupRequest, DeleteGroupResponse } from "./delete-group.type";

export class GroupSDK {
  static async bySpace(request: GroupBySpaceRequest) {
    const response = await safeRequest(() =>
      client.get<GroupBySpaceResponse, ApiError, true>({
        url: apiPaths.group.bySpace.getPath(request.params.spaceId, request.query),
        throwOnError: true,
      })
    );
    return response;
  }

  static async detail(request: GroupDetailRequest) {
    const response = await safeRequest(() =>
      client.get<GroupDetailResponse, ApiError, true>({
        url: apiPaths.group.detail.getPath(request.params.id),
        throwOnError: true,
      })
    );
    return response;
  }

  static async create(request: CreateGroupRequest) {
    const response = await safeRequest(() =>
      client.post<CreateGroupResponse, ApiError, true>({
        url: apiPaths.group.create.path,
        body: request.body,
        throwOnError: true,
      })
    );
    return response;
  }

  static async update(request: UpdateGroupRequest) {
    const response = await safeRequest(() =>
      client.put<UpdateGroupResponse, ApiError, true>({
        url: apiPaths.group.update.getPath(request.params.id),
        body: request.body,
        throwOnError: true,
      })
    );
    return response;
  }

  static async delete(request: DeleteGroupRequest) {
    const response = await safeRequest(() =>
      client.delete<DeleteGroupResponse, ApiError, true>({
        url: apiPaths.group.delete.getPath(request.params.id),
        throwOnError: true,
      })
    );
    return response;
  }
}

export type * from "./by-space.type";
export type * from "./create-group.type";
export type * from "./detail-group.type";
export type * from "./delete-group.type";
export type * from "./update-group.type";

