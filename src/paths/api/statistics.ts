import { buildQueryString } from "@/utils/path";

const statisticsPaths = {
  myActivities: {
    path: "/api/statistics/my-activities",
    getPath: (query?: { range?: number }) => {
      const range = Number(query?.range ?? 7);
      return `/api/statistics/my-activities${buildQueryString({ range })}`;
    },
  },
};

export default statisticsPaths;

