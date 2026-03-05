import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider className="min-h-svh bg-[#0B0F14]">
      <AppSidebar />
      <SidebarInset className="bg-[#0B0F14]">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-[#050810] px-4 md:hidden">
          <SidebarTrigger />
        </header>
        <div className="flex-1 flex flex-col gap-6 px-4 md:px-6 py-6 md:py-8 bg-[#0B0F14] min-h-0 overflow-auto md:pl-56">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
