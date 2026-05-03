import { IAttachment } from "@/data/models/attachment";

export type CreateAttachmentRequest = {
  body: {
    fileKey: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
  };
};

export type CreateAttachmentResponse = {
  201: IAttachment;
};
