import { client, safeRequest } from "@/data/client.config";
import type { ApiError } from "@/data/types";
import apiPaths from "@/paths/api";
import type { CreateAttachmentRequest, CreateAttachmentResponse } from "./create.type";
import type { PresignedUploadRequest, PresignedUploadResponse } from "./presign.type";

export class AttachmentSDK {
  static async create(request: CreateAttachmentRequest) {
    const response = await safeRequest(() =>
      client.post<CreateAttachmentResponse, ApiError, true>({
        url: apiPaths.attachment.root.path,
        body: request.body,
        throwOnError: true,
      })
    );
    return response;
  }

  static async presign(request: PresignedUploadRequest) {
    const response = await safeRequest(() =>
      client.post<PresignedUploadResponse, ApiError, true>({
        url: apiPaths.attachment.presign.path,
        body: request.body,
        throwOnError: true,
      })
    );
    return response;
  }
}

export type * from "./create.type";
export type * from "./presign.type";
