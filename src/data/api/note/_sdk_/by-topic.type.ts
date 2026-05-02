import type { INoteByTopicDto } from "../_dto_";
import type { IPageResponse } from "@/data/types";

export type NotesByTopicRequest = {
  params: {
    topicId: string | number;
  };
  query?: {
    q?: string;
    page?: number;
    size?: number;
  };
};

export type NotesByTopicResponse = {
  200: IPageResponse<INoteByTopicDto>;
};

