import type { CSSProperties } from "react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { useAuth } from "@/data/api/auth";
import clientPaths from "@/paths/client";
import { LoadingPage } from "@/components/page/loading-page";

const MainLayout = () => {
  const { user, hasHydrated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      navigate(clientPaths.auth.login.getPath(), { replace: true });
    }
  }, [hasHydrated, user, navigate]);

  if (!hasHydrated) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <LoadingPage showFacts={true} subtitle="Đang chuyển đến trang đăng nhập…" />
    );
  }

  return (
    <div
      className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100"
      style={
        {
          "--sidebar": "oklch(0.18 0 0 / 0.6)",
          "--sidebar-foreground": "oklch(0.985 0 0)",
          "--sidebar-border": "oklch(1 0 0 / 10%)",
          "--sidebar-accent": "oklch(0.22 0 0 / 0.7)",
          "--sidebar-accent-foreground": "oklch(0.985 0 0)",
        } as CSSProperties
      }
    >
      <SidebarProvider>
        <AppSidebar className="bg-transparent backdrop-blur border-r border-white/10" />
        <SidebarInset className="bg-transparent">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-transparent px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
            <div>
              <p className="text-sm font-medium">Java Assignment</p>
              <p className="text-xs text-slate-300/80">Khu vực làm việc chính</p>
            </div>
          </header>

          <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4 md:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;