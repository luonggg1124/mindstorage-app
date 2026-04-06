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
import { useMySpaces } from "@/data/api/space";
import { CommandIcon, FolderKanbanIcon, HouseIcon } from "lucide-react";
import { IMySpaceDto } from "@/data/api/space/_dto_/my-space.dto";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: spaces } = useMySpaces();

  const navigationItems = [
    {
      title: "Trang chủ",
      url: "/",
      icon: <HouseIcon />,
    },
    {
      title: "Không gian",
      url: "/spaces",
      icon: <FolderKanbanIcon />,
      items: (spaces ?? []).map((space: IMySpaceDto) => ({
        title: space?.name ?? "Không tên",
        url: `/spaces/${space?.id ?? ""}`,
       
      })),
    },
  ];

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
        <NavUser  />
      </SidebarFooter>
    </Sidebar>
  );
}
