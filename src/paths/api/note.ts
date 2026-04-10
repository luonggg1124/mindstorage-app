import { buildQueryString } from "@/utils/path";

const notePaths = {
  create: {
    path: "/api/note",
    getPath: (queries?: Record<string, string | number | boolean>) => `/api/note${buildQueryString(queries)}`,
  },
  delete: {
    path: "/api/note/{id}",
    getPath: (id: string | number, queries?: Record<string, string | number | boolean>) =>
      `/api/note/${id}${buildQueryString(queries)}`,
  },
  byTopic: {
    path: "/api/note/by-topic/{topicId}",
    getPath: (topicId: string | number, queries?: Record<string, string | number | boolean>) =>
      `/api/note/by-topic/${topicId}${buildQueryString(queries)}`,
  },
};

export default notePaths;

