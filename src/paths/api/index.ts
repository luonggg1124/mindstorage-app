import authPaths from "./auth";
import spacePaths from "./space";
import userPaths from "./user";
import groupPaths from "./group";
import topicPaths from "./topic";
import notePaths from "./note";

const apiPaths = {
    auth: authPaths,
    user: userPaths,
    space: spacePaths,
    group: groupPaths,
    topic: topicPaths,
    note: notePaths,
}

export default apiPaths;