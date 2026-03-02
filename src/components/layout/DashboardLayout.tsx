import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";

export function DashboardLayout() {
    return (
        <SidebarProvider className="min-h-svh">
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 md:hidden">
                    <SidebarTrigger />
                </header>
                <div className="flex-1 flex flex-col gap-6 p-6 md:p-8 bg-muted/20 min-h-0 overflow-auto">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
