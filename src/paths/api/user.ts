import { buildQueryString } from "@/utils/path";


const userPaths = {
    existsUsername: {
        path: "/api/user/valid-username-password",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/user/valid-username-password${buildQueryString(queries)}`,
    },
    myProfile: {
        path: "/api/user/my-profile",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/user/my-profile${buildQueryString(queries)}`,
    },
    search: {
        path: "/api/user/search",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/user/search${buildQueryString(queries)}`,
    },
    searchInvite: {
        path: "/api/user/search/invite",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/user/search/invite${buildQueryString(queries)}`,
    },
}
export default userPaths;