import { buildQueryString } from "@/utils/path";

const suggestionsPaths = {
  list: {
    path: "/api/suggestions",
    getPath: (query?: { limit?: number }) => {
      const limit = Number(query?.limit ?? 5);
      return `/api/suggestions${buildQueryString({ limit })}`;
    },
  },
};

export default suggestionsPaths;

