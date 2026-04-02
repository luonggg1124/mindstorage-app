import * as React from "react";
import { Link } from "react-router";

import { NavMain } from "@/layouts/main-layout/components/nav-main";
import { NavUser } from "@/layouts/main-layout/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { workspaceSpaces } from "@/data/workspace";
import { CommandIcon, FolderKanbanIcon, HouseIcon } from "lucide-react";

const navigationItems = [
  {
    title: "Trang chủ",
    url: "/",
    icon: <HouseIcon />,
  },
  {
    title: "Spaces",
    url: "/spaces",
    icon: <FolderKanbanIcon />,
    items: workspaceSpaces.map((space) => ({
      title: space.name,
      url: `/spaces/${space.id}`,
      image: space.image,
    })),
  },
];

const sidebarUser = {
  name: "Nguyen Van A",
  email: "student@example.com",
  avatar: "/avatars/user.jpg",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Java Assignment</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navigationItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
