import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";

export function DashboardLayout() {
    return (
        <SidebarProvider className="min-h-svh">
            <AppSidebar />
            <SidebarInset>
                <div className="flex-1 flex flex-col gap-4 p-4 bg-muted/30 min-h-0 overflow-auto">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
