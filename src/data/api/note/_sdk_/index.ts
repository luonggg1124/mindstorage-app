import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { NotesByTopicError, NotesByTopicRequest, NotesByTopicResponse } from "./by-topic.type";
import type { CreateNoteError, CreateNoteRequest, CreateNoteResponse } from "./create-note.type";
import type { DeleteNoteError, DeleteNoteRequest, DeleteNoteResponse } from "./delete-note.type";

export class NoteSDK {
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
}

export type * from "./by-topic.type";
export type * from "./create-note.type";
export type * from "./delete-note.type";

