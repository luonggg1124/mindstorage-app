import { buildQueryString } from "@/utils/path";


const spacePaths = {
    mySpaces: {
        path: "/api/space/my-spaces",
        getPath: (queries?: Record<string, string | number | boolean>) => `/api/space/my-spaces${buildQueryString(queries)}`
    }
}

export default spacePaths;