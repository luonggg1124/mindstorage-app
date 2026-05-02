import { client, safeRequest } from "@/data/client.config";
import type { ApiError } from "@/data/types";
import apiPaths from "@/paths/api";
import type { CreateTopicRequest, CreateTopicResponse } from "./create-topic.type";
import type { TopicsByGroupRequest, TopicsByGroupResponse } from "./by-group.type";
import type { UpdateTopicRequest, UpdateTopicResponse } from "./update-topic.type";

export class TopicSDK {
  static async byGroup(request: TopicsByGroupRequest) {
    const response = await safeRequest(() =>
      client.get<TopicsByGroupResponse, ApiError, true>({
        url: apiPaths.topic.byGroup.path,
        path: request.params,
        throwOnError: true,
      })
    );
    return response;
  }

  static async create(request: CreateTopicRequest) {
    const response = await safeRequest(() =>
      client.post<CreateTopicResponse, ApiError, true>({
        url: apiPaths.topic.create.path,
        body: request.body,
        throwOnError: true,
      })
    );
    return response;
  }

  static async update(request: UpdateTopicRequest) {
    const response = await safeRequest(() =>
      client.put<UpdateTopicResponse, ApiError, true>({
        url: apiPaths.topic.update.getPath(request.params.id),
        body: request.body,
        throwOnError: true,
      })
    );
    return response;
  }
}

export type * from "./by-group.type";
export type * from "./create-topic.type";
export type * from "./update-topic.type";
