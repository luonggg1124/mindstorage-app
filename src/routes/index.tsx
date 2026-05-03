import { createBrowserRouter } from "react-router";

import MainLayout from "../layouts/main-layout";
import AuthLayout from "../layouts/auth-layout";
import authRoutes from "./auth";
import mainRoutes from "./main";

const routes = createBrowserRouter([
  {
    Component: MainLayout,
    children: mainRoutes,
  },
  {
    Component: AuthLayout,
    children: authRoutes,
  },
]);

export default routes;
