import { buildQueryString, defineRoute } from "@/utils/path";


const spacePaths = {
  list: defineRoute({
    title: "Spaces",
    path: "/spaces",
    display: {
      sidebar: true,
      search: true,
    },
    getPath: (queries?: Record<string, string | number | boolean>) =>
      `/spaces${buildQueryString(queries)}`,
  }),
  detail: defineRoute({
    title: "Space detail",
    path: "/spaces/:id",
    display: {
      sidebar: false,
      search: false,
    },
    getPath: (id: string, queries?: Record<string, string | number | boolean>) =>
      `/spaces/${id}${buildQueryString(queries)}`,
  }),
}
export default spacePaths;