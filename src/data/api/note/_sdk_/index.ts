import { client, safeRequest } from "@/data/client.config";
import type { ApiError } from "@/data/types";
import apiPaths from "@/paths/api";
import type { NotesByParentRequest, NotesByParentResponse } from "./by-parent.type";
import type { NotesByTopicRequest, NotesByTopicResponse } from "./by-topic.type";
import type { CreateNoteRequest, CreateNoteResponse } from "./create-note.type";
import type { DeleteNoteRequest, DeleteNoteResponse } from "./delete-note.type";
import type { UpdateNoteRequest, UpdateNoteResponse } from "./update-note.type";

export class NoteSDK {
  static async byParent(request: NotesByParentRequest) {
    const response = await safeRequest(() =>
      client.get<NotesByParentResponse, ApiError, true>({
        url: apiPaths.note.byParent.getPath(request.params.parentId, request.query),
        throwOnError: true,
      })
    );
    return response;
  }

  static async byTopic(request: NotesByTopicRequest) {
    const response = await safeRequest(() =>
      client.get<NotesByTopicResponse, ApiError, true>({
        url: apiPaths.note.byTopic.getPath(request.params.topicId, request.query),
        throwOnError: true,
      })
    );
    return response;
  }

  static async create(request: CreateNoteRequest) {
    const response = await safeRequest(() =>
      client.post<CreateNoteResponse, ApiError, true>({
        url: apiPaths.note.create.path,
        body: request.body,
        throwOnError: true,
      })
    );
    return response;
  }

  static async delete(request: DeleteNoteRequest) {
    const response = await safeRequest(() =>
      client.delete<DeleteNoteResponse, ApiError, true>({
        url: apiPaths.note.delete.getPath(request.params.id),
        throwOnError: true,
      })
    );
    return response;
  }

  static async update(request: UpdateNoteRequest) {
    const response = await safeRequest(() =>
      client.put<UpdateNoteResponse, ApiError, true>({
        url: apiPaths.note.update.getPath(request.params.id),
        body: request.body,
        throwOnError: true,
      })
    );
    return response;
  }
}

export type * from "./by-topic.type";
export type * from "./by-parent.type";
export type * from "./create-note.type";
export type * from "./delete-note.type";
export type * from "./update-note.type";

