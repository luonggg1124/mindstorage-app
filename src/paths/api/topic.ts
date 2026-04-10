import { buildQueryString } from "@/utils/path";

/** HTTP paths vẫn là `/api/tag` nếu backend chưa đổi route. */
const topicPaths = {
  byGroup: {
    path: "/api/topic/by-group/{id}",
    getPath: (id: string | number, queries?: Record<string, string | number | boolean>) =>
      `/api/topic/by-group/${id}${buildQueryString(queries)}`,
  },
  create: {
    path: "/api/topic",
    getPath: (queries?: Record<string, string | number | boolean>) => `/api/topic${buildQueryString(queries)}`,
  },
};

export default topicPaths;
