import { buildQueryString, defineRoute } from "@/utils/path";


const groupPaths = {
  detail: defineRoute({
    title: "Group",
    path: "/group/:id",
    display: {
      sidebar: false,
      search: false,
    },
    getPath: (id: string, queries?: Record<string, string | number | boolean>) =>
      `/group/${id}${buildQueryString(queries)}`,
  }),
}
export default groupPaths;