import type { RouteObject } from "react-router";

import clientPaths from "@/paths/client";
import Home from "@/pages/home";
import SpacesPage from "@/pages/spaces/list";
import SpaceDetailPage from "@/pages/spaces/detail";
import GroupPage from "@/pages/group";
import ProfilePage from "@/pages/profile";
import MyProfilePage from "@/pages/profile/my-profile";
import LibraryPage from "@/pages/library";

const mainRoutes: RouteObject[] = [
  {
    path: clientPaths.home.root.path,
    Component: Home,
  },
  {
    path: clientPaths.space.list.path,
    Component: SpacesPage,
  },
  {
    path: clientPaths.library.list.path,
    Component: LibraryPage,
  },
  {
    path: clientPaths.space.detail.path,
    Component: SpaceDetailPage,
  },
  {
    path: clientPaths.profile.myProfile.path,
    Component: MyProfilePage,
  },
  {
    path: clientPaths.profile.detail.path,
    Component: ProfilePage,
  },
  {
    path: clientPaths.group.detail.path,
    Component: GroupPage,
  },
];

export default mainRoutes;
