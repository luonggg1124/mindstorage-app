import { buildQueryString, defineRoute } from "@/utils/path";

const homePaths = {
  root: defineRoute({
    title: "Trang chủ",
    path: "/",
    display: {
      sidebar: true,
      search: true,
    },
    getPath: (queries?: Record<string, string | number | boolean>) => {
      const q = buildQueryString(queries);
      return q ? `/${q}` : "/";
    },
  }),
};

export default homePaths;
