import { buildQueryString, defineRoute } from "@/utils/path";

const libraryPaths = {
  list: defineRoute({
    title: "Thư viện",
    path: "/library",
    display: {
      sidebar: true,
      search: false,
    },
    getPath: (queries?: Record<string, string | number | boolean>) =>
      `/library${buildQueryString(queries)}`,
  }),
};

export default libraryPaths;
