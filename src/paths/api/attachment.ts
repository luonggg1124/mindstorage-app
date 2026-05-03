import { buildQueryString } from "@/utils/path";

const attachmentPaths = {
  root: {
    path: "/api/attachment",
  },
  presign: {
    path: "/api/attachment/presign",
  },
  myAttachments: {
    path: "/api/attachment/my-attachments",
    getPath: (queries?: Record<string, string | number | boolean>) =>
      `/api/attachment/my-attachments${buildQueryString(queries)}`,
  },
  myAttachmentsTotalSize: {
    path: "/api/attachment/my-attachments/total-size",
  },
};

export default attachmentPaths;
