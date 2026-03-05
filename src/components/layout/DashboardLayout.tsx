import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

function DashboardContent() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const path = location.pathname;
  const isNotesRoute =
    path === "/notes" || path.startsWith("/notes/") || path.startsWith("/note/");
  const isDashboardOrSettingsOrAccountRoute =
    path === "/dashboard" ||
    path.startsWith("/dashboard/") ||
    path === "/settings" ||
    path.startsWith("/settings/") ||
    path === "/account" ||
    path.startsWith("/account/");

  const collapsedPaddingClass = isNotesRoute
    ? "md:pl-16"
    : isDashboardOrSettingsOrAccountRoute
    ? "md:pl-36"
    : "md:pl-16";

  const expandedPaddingClass = isDashboardOrSettingsOrAccountRoute
    ? "md:pl-[16rem]"
    : "md:pl-56";

  return (
    <div
      className={cn(
        "flex-1 flex flex-col gap-6 px-4 md:px-6 py-6 md:py-8 bg-background min-h-0 overflow-auto transition-[padding] duration-300 ease-out",
        isCollapsed ? collapsedPaddingClass : expandedPaddingClass
      )}
    >
      <Outlet />
    </div>
  );
}

export function DashboardLayout() {
  return (
    <SidebarProvider className="min-h-svh bg-background">
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4 md:hidden">
          <SidebarTrigger />
        </header>
        <DashboardContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
