import { Link, useLocation } from "react-router"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  url: string
  icon?: React.ReactNode
  items?: {
    title: string
    url: string
    image?: string
  }[]
}

const isPathActive = (pathname: string, url: string) => {
  if (url === "/") {
    return pathname === url
  }

  return pathname === url || pathname.startsWith(`${url}/`)
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const location = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              item.url === "/spaces"
                ? location.pathname === "/spaces" ||
                  location.pathname.startsWith("/spaces/") ||
                  location.pathname.startsWith("/group/")
                : isPathActive(location.pathname, item.url)

            return (
              <SidebarMenuItem key={`${item.title}-${item.url}`}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link to={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={`${subItem.title}-${subItem.url}`}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isPathActive(location.pathname, subItem.url)}
                        >
                          <Link to={subItem.url}>
                            {subItem.image ? (
                              <img
                                src={subItem.image}
                                alt={subItem.title}
                                className="size-5 rounded-sm object-cover"
                              />
                            ) : null}
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
