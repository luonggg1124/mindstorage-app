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
    delete: {
        path: "/api/space/{id}",
        getPath: (id: string | number, queries?: Record<string, string | number | boolean>) =>
            `/api/space/${id}${buildQueryString(queries)}`,
    },
    mySpaces: {
        path: "/api/space/my-spaces",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/space/my-spaces${buildQueryString(queries)}`
    },
    members: {
        path: "/api/space/{id}/members",
        getPath: (id: string | number, queries?: Record<string, string | number | boolean>) =>
            `/api/space/${id}/members${buildQueryString(queries)}`,
    },
    memberRole: {
        path: "/api/space/{spaceId}/members/{userId}/role",
        getPath: (spaceId: string | number, userId: string | number) =>
            `/api/space/${spaceId}/members/${userId}/role`,
    },
    myRole: {
        path: "/api/space/{id}/my-role",
        getPath: (id: string | number) => `/api/space/${id}/my-role`,
    },
}

export default spacePaths;