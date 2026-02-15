import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset, SidebarSeparator } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Separator } from "@/components/ui/separator";

export function DashboardLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Sokrate AI</span>
                    </div>
                </header>
                <div className="flex-1 flex flex-col gap-4 p-4 pt-0 bg-gray-50/50 min-h-0 overflow-auto">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
