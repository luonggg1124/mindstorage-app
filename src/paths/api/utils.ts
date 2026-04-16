import { buildQueryString } from "@/utils/path";

const utilsPaths = {
  weather: {
    path: "/api/weather",
    getPath: (queries?: Record<string, string | number | boolean>) =>
      `/api/weather${buildQueryString(queries)}`,
  },
};

export default utilsPaths;

