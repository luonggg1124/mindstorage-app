import { buildQueryString, defineRoute } from "@/utils/path";


const authPaths = {
    login: defineRoute({
        title: "Đăng nhập",
        path: "/login",
        display: {
            sidebar: false,
            search: false,
        },
        getPath: (queries?: Record<string, string | number | boolean>) => `/login${buildQueryString(queries)}`,
    }),
    register: defineRoute({
        title: "Đăng ký",
        path: "/register",
        display: {
            sidebar: false,
            search: false,
        },
        getPath: (queries?: Record<string, string | number | boolean>) => `/register${buildQueryString(queries)}`,
    }),
}
export default authPaths;