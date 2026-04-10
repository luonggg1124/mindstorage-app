import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/main-layout";
import AuthLayout from "../layouts/auth-layout";
import Home from "../pages/home";
import SpacesPage from "../pages/spaces/list";
import SpaceDetailPage from "../pages/spaces/detail";
import GroupPage from "../pages/group";
import ProfilePage from "../pages/profile";
import MyProfilePage from "../pages/profile/my-profile";
import authRoutes from "./auth";
import clientPaths from "@/paths/client";

const routes = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: clientPaths.space.list.path,
        Component: SpacesPage,
      },
      {
        path: clientPaths.space.detail.path,
        Component: SpaceDetailPage,
      },
      {
        path: "/my-profile",
        Component: MyProfilePage,
      },
      {
        path: "/profile/:id",
        Component: ProfilePage,
      },
      {
        path: clientPaths.group.detail.path,
        Component: GroupPage,
      },
    ],
  },
  {
    Component: AuthLayout,
    children: authRoutes,
  },
]);

export default routes;