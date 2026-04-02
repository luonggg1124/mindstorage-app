import { RouteObject } from "react-router";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import clientPaths from "@/paths/client";

const authRoutes: RouteObject[] = [
  {
    path: clientPaths.auth.login.path,
    Component: Login,
  },
  {
    path: clientPaths.auth.register.path,
    Component: Register,
  },
];

export default authRoutes;