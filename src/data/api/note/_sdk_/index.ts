import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { NotesByParentError, NotesByParentRequest, NotesByParentResponse } from "./by-parent.type";
import type { NotesByTopicError, NotesByTopicRequest, NotesByTopicResponse } from "./by-topic.type";
import type { CreateNoteError, CreateNoteRequest, CreateNoteResponse } from "./create-note.type";
import type { DeleteNoteError, DeleteNoteRequest, DeleteNoteResponse } from "./delete-note.type";
import type { UpdateNoteError, UpdateNoteRequest, UpdateNoteResponse } from "./update-note.type";

export class NoteSDK {
  static async byParent<ThrowOnError extends boolean = false>(request: NotesByParentRequest) {
    const response = await client.get<NotesByParentResponse, NotesByParentError, ThrowOnError>({
      url: apiPaths.note.byParent.getPath(request.params.parentId, request.query),
    });
    return response;
  }

  static async byTopic<ThrowOnError extends boolean = false>(request: NotesByTopicRequest) {
    const response = await client.get<NotesByTopicResponse, NotesByTopicError, ThrowOnError>({
      url: apiPaths.note.byTopic.getPath(request.params.topicId, request.query),
    });
    return response;
  }

  static async create<ThrowOnError extends boolean = false>(request: CreateNoteRequest) {
    const response = await client.post<CreateNoteResponse, CreateNoteError, ThrowOnError>({
      url: apiPaths.note.create.path,
      body: request.body,
    });
    return response;
  }

  static async delete<ThrowOnError extends boolean = false>(request: DeleteNoteRequest) {
    const response = await client.delete<DeleteNoteResponse, DeleteNoteError, ThrowOnError>({
      url: apiPaths.note.delete.getPath(request.params.id),
    });
    return response;
  }

  static async update<ThrowOnError extends boolean = false>(request: UpdateNoteRequest) {
    const response = await client.put<UpdateNoteResponse, UpdateNoteError, ThrowOnError>({
      url: apiPaths.note.update.getPath(request.params.id),
      body: request.body,
    });
    return response;
  }
}

export type * from "./by-topic.type";
export type * from "./by-parent.type";
export type * from "./create-note.type";
export type * from "./delete-note.type";
export type * from "./update-note.type";

