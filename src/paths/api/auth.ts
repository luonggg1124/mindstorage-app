import { buildQueryString } from "@/utils/path";


const authPaths = {
    verifyEmail: {
        path: "/api/auth/verify-email",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/auth/verify-email${buildQueryString(queries)}`
    },
    register: {
        path: "/api/auth/register",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/auth/register${buildQueryString(queries)}`
    }
}

export default authPaths;