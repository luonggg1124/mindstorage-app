import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/main-layout";
import publicRoutes from "./public";
const routes = createBrowserRouter([
  {
    Component: MainLayout,
    children: [...publicRoutes],
  },
]);
export default routes;