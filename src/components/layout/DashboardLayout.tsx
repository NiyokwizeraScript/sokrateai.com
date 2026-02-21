import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset, SidebarSeparator } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-background transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <span className="text-sm font-medium text-muted-foreground">Sokrate AI</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ThemeToggle />
                        <Link
                            to="/account"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md"
                        >
                            Account
                        </Link>
                    </div>
                </header>
                <div className="flex-1 flex flex-col gap-4 p-4 pt-0 bg-muted/30 min-h-0 overflow-auto">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
