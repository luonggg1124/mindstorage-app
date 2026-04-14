import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { CreateTopicError, CreateTopicRequest, CreateTopicResponse } from "./create-topic.type";
import type { TopicsByGroupError, TopicsByGroupRequest, TopicsByGroupResponse } from "./by-group.type";
import type { UpdateTopicError, UpdateTopicRequest, UpdateTopicResponse } from "./update-topic.type";

export class TopicSDK {
  static async byGroup<ThrowOnError extends boolean = false>(request: TopicsByGroupRequest) {
    const response = await client.get<TopicsByGroupResponse, TopicsByGroupError, ThrowOnError>({
      url: apiPaths.topic.byGroup.path,
      path: request.params,
    });
    return response;
  }

  static async create<ThrowOnError extends boolean = false>(request: CreateTopicRequest) {
    const response = await client.post<CreateTopicResponse, CreateTopicError, ThrowOnError>({
      url: apiPaths.topic.create.path,
      body: request.body,
    });
    return response;
  }

  static async update<ThrowOnError extends boolean = false>(request: UpdateTopicRequest) {
    const response = await client.put<UpdateTopicResponse, UpdateTopicError, ThrowOnError>({
      url: apiPaths.topic.update.getPath(request.params.id),
      body: request.body,
    });
    return response;
  }
}

export type * from "./by-group.type";
export type * from "./create-topic.type";
export type * from "./update-topic.type";
