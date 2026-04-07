import { buildQueryString } from "@/utils/path";

const groupPaths = {
  create: {
    path: "/api/group",
    getPath: (queries?: Record<string, string | number | boolean>) => `/api/group${buildQueryString(queries)}`,
  },
  detail: {
    path: "/api/group/{id}",
    getPath: (id: string | number, queries?: Record<string, string | number | boolean>) =>
      `/api/group/${id}${buildQueryString(queries)}`,
  },
  bySpace: {
    path: "/api/group/by-space/{spaceId}",
    getPath: (id: string | number, queries?: Record<string, string | number | boolean>) =>
      `/api/group/by-space/${id}${buildQueryString(queries)}`,
  },
};

export default groupPaths;

