import { buildQueryString } from "@/utils/path";

const invitationPaths = {
  invite: {
    path: "/api/invitations",
    getPath: (queries?: Record<string, string | number | boolean>) =>
      `/api/invitations${buildQueryString(queries)}`,
  },
  accept: {
    path: "/api/invitations/{id}/accept",
    getPath: (id: string, queries?: Record<string, string | number | boolean>) =>
      `/api/invitations/${id}/accept${buildQueryString(queries)}`,
  },
  reject: {
    path: "/api/invitations/{id}/reject",
    getPath: (id: string, queries?: Record<string, string | number | boolean>) =>
      `/api/invitations/${id}/reject${buildQueryString(queries)}`,
  },
};

export default invitationPaths;

