import { buildQueryString } from "@/utils/path";

const tagPaths = {
  byGroup: {
    path: "/api/tag/by-group/{id}",
    getPath: (id: string | number, queries?: Record<string, string | number | boolean>) =>
      `/api/tag/by-group/${id}${buildQueryString(queries)}`,
  },
  create: {
    path: "/api/tag",
    getPath: (queries?: Record<string, string | number | boolean>) => `/api/tag${buildQueryString(queries)}`,
  },
};

export default tagPaths;

