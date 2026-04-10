import { buildQueryString } from "@/utils/path";


const spacePaths = {
    create: {
        path: "/api/space",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/space${buildQueryString(queries)}`
    },
    detail: {
        path: "/api/space/{id}",
        getPath: (id: string | number, queries?: Record<string, string | number | boolean>) =>
            `/api/space/${id}${buildQueryString(queries)}`,
    },
    update: {
        path: "/api/space/{id}",
        getPath: (id: string | number, queries?: Record<string, string | number | boolean>) =>
            `/api/space/${id}${buildQueryString(queries)}`,
    },
    mySpaces: {
        path: "/api/space/my-spaces",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/space/my-spaces${buildQueryString(queries)}`
    }
}

export default spacePaths;