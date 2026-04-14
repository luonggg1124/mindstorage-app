import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { GroupBySpaceError, GroupBySpaceRequest, GroupBySpaceResponse } from "./by-space.type";
import type { CreateGroupError, CreateGroupRequest, CreateGroupResponse } from "./create-group.type";
import type { GroupDetailError, GroupDetailRequest, GroupDetailResponse } from "./detail-group.type";
import type { UpdateGroupError, UpdateGroupRequest, UpdateGroupResponse } from "./update-group.type";
import type { DeleteGroupError, DeleteGroupRequest, DeleteGroupResponse } from "./delete-group.type";

export class GroupSDK {
  static async bySpace<ThrowOnError extends boolean = false>(request: GroupBySpaceRequest) {
    const response = await client.get<GroupBySpaceResponse, GroupBySpaceError, ThrowOnError>({
      url: apiPaths.group.bySpace.getPath(request.params.spaceId, request.query),
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

  static async update<ThrowOnError extends boolean = false>(request: UpdateGroupRequest) {
    const response = await client.put<UpdateGroupResponse, UpdateGroupError, ThrowOnError>({
      url: apiPaths.group.update.getPath(request.params.id),
      body: request.body,
    });
    return response;
  }

  static async delete<ThrowOnError extends boolean = false>(request: DeleteGroupRequest) {
    const response = await client.delete<DeleteGroupResponse, DeleteGroupError, ThrowOnError>({
      url: apiPaths.group.delete.getPath(request.params.id),
    });
    return response;
  }
}

export type * from "./by-space.type";
export type * from "./create-group.type";
export type * from "./detail-group.type";
export type * from "./delete-group.type";
export type * from "./update-group.type";

