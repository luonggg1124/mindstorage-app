export type CreateAttachmentRequest = {
  body: {
    fileKey: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
  };
};

export type CreateAttachmentResponse = {
  201: {
    id: string;
    fileKey: string;
    fileUrl: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    createdAt: string;
    updatedAt: string;
  };
};
