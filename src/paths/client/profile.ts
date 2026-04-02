import { buildQueryString, defineRoute } from "@/utils/path";

const profilePaths = {
  myProfile: defineRoute({
    title: "Hồ sơ của tôi",
    path: "/my-profile",
    display: {
      sidebar: false,
      search: false,
    },
    getPath: (queries?: Record<string, string | number | boolean>) =>
      `/my-profile${buildQueryString(queries)}`,
  }),
  detail: defineRoute({
    title: "Profile",
    path: "/profile/:id",
    display: {
      sidebar: false,
      search: false,
    },
    getPath: (id: string, queries?: Record<string, string | number | boolean>) =>
      `/profile/${id}${buildQueryString(queries)}`,
  }),
};

export default profilePaths;

