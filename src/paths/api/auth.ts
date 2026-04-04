import { buildQueryString } from "@/utils/path";


const authPaths = {
    verifyEmail: {
        path: "/api/auth/verify-email",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/auth/verify-email${buildQueryString(queries)}`
    },
    register: {
        path: "/api/auth/register",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/auth/register${buildQueryString(queries)}`
    },
    login: {
        path: "/api/auth/login",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/auth/login${buildQueryString(queries)}`
    },
}

export default authPaths;