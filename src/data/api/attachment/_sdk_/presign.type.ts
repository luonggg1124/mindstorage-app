export type PresignedUploadRequest = {
  body: {
    fileName: string;
    contentType: string;
  };
};

export type PresignedUploadResponse = {
  200: {
    fileKey: string;
    uploadUrl: string;
  };
};
