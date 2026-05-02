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
  url?: string
  icon?: React.ReactNode
  onClick?: () => void
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
            const itemUrl = item.url ?? "#"
            const isActive =
              itemUrl === "/spaces"
                ? location.pathname === "/spaces" ||
                  location.pathname.startsWith("/spaces/") ||
                  location.pathname.startsWith("/group/")
                : itemUrl === "#" ? false : isPathActive(location.pathname, itemUrl)

            const hasSub = !!item.items?.length
            const isOpen = open[itemUrl] ?? false
            const isAction = typeof item.onClick === "function" && !item.url

            return (
              <SidebarMenuItem key={`${item.title}-${itemUrl}`}>
                <div className="flex items-center gap-1">
                  {isAction ? (
                    <SidebarMenuButton
                      onClick={item.onClick}
                      isActive={false}
                      tooltip={item.title}
                      className="flex-1 cursor-pointer transition-colors hover:bg-white/10"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="flex-1 cursor-pointer transition-colors hover:bg-white/10"
                    >
                      <Link to={itemUrl}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                  {hasSub ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setOpen((s: Record<string, boolean>) => ({ ...s, [itemUrl]: !(s[itemUrl] ?? false) }))
                      }}
                      className="mr-1 inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
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
                          className="cursor-pointer transition-colors hover:bg-white/10"
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
