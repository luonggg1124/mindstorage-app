import { buildQueryString } from "@/utils/path";

const groupPaths = {
  bySpace: {
    path: "/api/group/by-space/{spaceId}",
    getPath: (id: string | number, queries?: Record<string, string | number | boolean>) =>
      `/api/group/by-space/${id}${buildQueryString(queries)}`,
  },
};

export default groupPaths;

