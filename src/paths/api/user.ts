import { buildQueryString } from "@/utils/path";


const userPaths = {
    existsUsername: {
        path: "/api/user/valid-username-password",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/user/valid-username-password${buildQueryString(queries)}`,
    }
}
export default userPaths;