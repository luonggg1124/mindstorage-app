import type { IAttachment } from "@/data/models/attachment";
import type { IPageResponse } from "@/data/types";

export type MyAttachmentsRequest = {
  query?: {
    page?: number;
    size?: number;
  };
};

export type MyAttachmentsResponse = {
  200: IPageResponse<IAttachment>;
};
