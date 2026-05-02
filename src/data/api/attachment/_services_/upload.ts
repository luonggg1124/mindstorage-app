import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import type { ApiError } from "@/data/types";
import type { CreateAttachmentResponse } from "../_sdk_/create.type";
import { AttachmentSDK } from "../_sdk_";

export type UploadedAttachment = CreateAttachmentResponse[201];

export type UploadAttachmentPhase = "idle" | "presign" | "put" | "create";

export async function presignUpload(file: File) {
  const { data: presignedData } = await AttachmentSDK.presign({
    body: {
      fileName: file.name,
      contentType: file.type,
    },
  });
  if (!presignedData?.fileKey || !presignedData?.uploadUrl) {
    throw new Error("Phản hồi presign không hợp lệ");
  }
  return presignedData;
}

async function putObject(uploadUrl: string, file: File): Promise<void> {
  const putResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!putResponse.ok) {
    throw new Error(`Upload file thất bại (${putResponse.status})`);
  }
}

async function registerAttachment(file: File, fileKey: string): Promise<UploadedAttachment> {
  const createResult = await AttachmentSDK.create({
    body: {
      fileKey,
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
    },
  });

  const created = createResult.data;
  if (!created) {
    throw new Error("Phản hồi tạo attachment không hợp lệ");
  }

  return created as UploadedAttachment;
}


export async function upload(uploadUrl: string, fileKey: string, file: File): Promise<UploadedAttachment> {
  await putObject(uploadUrl, file);
  return registerAttachment(file, fileKey);
}

export type UploadAttachmentOptions = {
  onPhaseChange?: (phase: UploadAttachmentPhase) => void;
};

export async function uploadAttachment(
  file: File,
  options?: UploadAttachmentOptions
): Promise<UploadedAttachment> {
  const notify = (phase: UploadAttachmentPhase) => {
    options?.onPhaseChange?.(phase);
  };

  notify("presign");
  const { fileKey, uploadUrl } = await presignUpload(file);

  notify("put");
  await putObject(uploadUrl, file);

  notify("create");
  const created = await registerAttachment(file, fileKey);

  notify("idle");
  return created;
}

/** Mutation đơn giản, không theo dõi phase. */
export const useUploadFile = () => {
  const mutation = useMutation({
    mutationFn: (file: File) => uploadAttachment(file),
  });

  return {
    upload: mutation.mutateAsync,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    error: mutation.error as ApiError | undefined | null,
    loading: mutation.isPending,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};

/** Giống `useUploadFile` nhưng có `loading`, `phase` (presign → put → create) để xử lý UI. */
export const useUploadAttachment = () => {
  const [phase, setPhase] = useState<UploadAttachmentPhase>("idle");

  const mutation = useMutation({
    mutationFn: (file: File) =>
      uploadAttachment(file, { onPhaseChange: setPhase }),
    onSettled: () => {
      setPhase("idle");
    },
  });

  return {
    upload: mutation.mutateAsync,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    error: mutation.error as ApiError | undefined | null,
    /** Đang chạy toàn bộ luồng upload. */
    loading: mutation.isPending,
    isPending: mutation.isPending,
    /** Bước hiện tại trong luồng (khi `loading === true` thường là presign | put | create). */
    phase,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};
