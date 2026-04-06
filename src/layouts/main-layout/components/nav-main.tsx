import * as React from "react"
import { Link, useLocation } from "react-router"
import { ChevronDownIcon } from "lucide-react"

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
  const [open, setOpen] = React.useState<Record<string, boolean>>({})

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

            const hasSub = !!item.items?.length
            const isOpen = open[item.url] ?? false

            return (
              <SidebarMenuItem key={`${item.title}-${item.url}`}>
                <div className="flex items-center gap-1">
                  <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className="flex-1">
                    <Link to={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {hasSub ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setOpen((s: Record<string, boolean>) => ({ ...s, [item.url]: !(s[item.url] ?? false) }))
                      }}
                      className="mr-1 inline-flex size-8 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
                      aria-label={isOpen ? "Đóng" : "Mở"}
                    >
                      <ChevronDownIcon className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  ) : null}
                </div>

                {item.items?.length && isOpen ? (
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
