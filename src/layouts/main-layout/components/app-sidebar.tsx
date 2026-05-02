import * as React from "react";
import { Link } from "react-router";

import { NavMain } from "@/layouts/main-layout/components/nav-main";
import { NavUser } from "@/layouts/main-layout/components/nav-user";
import { SidebarSearch } from "@/layouts/main-layout/components/sidebar-search";
import { SidebarNotifications } from "@/layouts/main-layout/components/sidebar-notifications";
import { SidebarFriends } from "@/layouts/main-layout/components/sidebar-friends";
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
import { BellIcon, CommandIcon, FolderKanbanIcon, HouseIcon, SearchIcon, UsersIcon } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [notificationsUnread, setNotificationsUnread] = React.useState(0);
  const [friendsOpen, setFriendsOpen] = React.useState(false);

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
    {
      title: "Bạn bè",
      icon: <UsersIcon />,
      onClick: () => setFriendsOpen(true),
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

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setNotificationsOpen(true)}
              tooltip="Thông báo"
              className="cursor-pointer transition-colors hover:bg-white/10"
            >
              <span className="relative">
                <BellIcon />
                {notificationsUnread > 0 ? (
                  <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-4 text-white">
                    {notificationsUnread > 9 ? "9+" : notificationsUnread}
                  </span>
                ) : null}
              </span>
              <span>Thông báo</span>
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
      <SidebarNotifications
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        onUnreadCountChange={setNotificationsUnread}
      />
      <SidebarFriends open={friendsOpen} onOpenChange={setFriendsOpen} />
    </Sidebar>
  );
}
