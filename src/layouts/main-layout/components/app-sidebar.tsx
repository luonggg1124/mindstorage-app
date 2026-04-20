import * as React from "react";
import { Link } from "react-router";

import { NavMain } from "@/layouts/main-layout/components/nav-main";
import { NavUser } from "@/layouts/main-layout/components/nav-user";
import { SidebarSearch } from "@/layouts/main-layout/components/sidebar-search";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CommandIcon, FolderKanbanIcon, HouseIcon, SearchIcon } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [searchOpen, setSearchOpen] = React.useState(false);

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
                <span className="text-base font-semibold">MindStorage</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setSearchOpen(true)}
              tooltip="Tìm kiếm"
              className="cursor-pointer transition-colors hover:bg-white/10"
            >
              <SearchIcon />
              <span>Tìm kiếm</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="my-2 bg-white/10" />
        <NavMain items={navigationItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>

      <SidebarSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </Sidebar>
  );
}
