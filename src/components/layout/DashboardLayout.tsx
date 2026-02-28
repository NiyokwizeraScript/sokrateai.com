import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";

export function DashboardLayout() {
    return (
        <SidebarProvider className="min-h-svh">
            <AppSidebar />
            <SidebarInset>
                <div className="md:hidden flex items-center shrink-0 px-2 py-2">
                    <SidebarTrigger className="h-9 w-9" />
                </div>
                <div className="flex-1 flex flex-col gap-4 p-4 bg-muted/30 min-h-0 overflow-auto">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
