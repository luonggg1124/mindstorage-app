import authPaths from "./auth";
import spacePaths from "./space";
import userPaths from "./user";
import groupPaths from "./group";
import tagPaths from "./tag";


const apiPaths = {
    auth: authPaths,
    user: userPaths,
    space: spacePaths,
    group: groupPaths,
    tag: tagPaths,
}

export default apiPaths;