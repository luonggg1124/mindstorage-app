import type { INoteByParentDto } from "../_dto_";
import type { IPageResponse } from "@/data/types";

export type NotesByParentRequest = {
  params: {
    parentId: string | number;
  };
  query?: {
    page?: number;
    size?: number;
  };
};

export type NotesByParentResponse = {
  200: IPageResponse<INoteByParentDto>;
};

