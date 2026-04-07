import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { CreateTagError, CreateTagRequest, CreateTagResponse } from "./create-tag.type";
import type { TagsByGroupError, TagsByGroupRequest, TagsByGroupResponse } from "./by-group.type";

export class TagSDK {
  static async byGroup<ThrowOnError extends boolean = false>(request: TagsByGroupRequest) {
    const response = await client.get<TagsByGroupResponse, TagsByGroupError, ThrowOnError>({
      url: apiPaths.tag.byGroup.path,
      path: request.params,
    });
    return response;
  }

  static async create<ThrowOnError extends boolean = false>(request: CreateTagRequest) {
    const response = await client.post<CreateTagResponse, CreateTagError, ThrowOnError>({
      url: apiPaths.tag.create.path,
      body: request.body,
    });
    return response;
  }
}

export type * from "./by-group.type";
export type * from "./create-tag.type";

