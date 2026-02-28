import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  LogOut,
  ChevronUp,
  UserCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const baseNavItems: { title: string; icon: typeof LayoutDashboard; href: string }[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
];
const feedbackNavItem = { title: "Feedback", icon: MessageSquare, href: "/feedback" };

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isPro } = useUserProfile();
  const navItems = [...baseNavItems, ...(isPro ? [feedbackNavItem] : [])];

  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.slice(0, 2).toUpperCase() ?? "?");

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="min-h-svh flex flex-col">
      <SidebarHeader className="p-4 flex items-center shrink-0 min-h-14">
        {/* Burger trigger is rendered in a fixed left column by the sidebar UI so it doesn't move when open/collapsed */}
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2 flex-1 min-h-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  location.pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href} className="flex items-center group-data-[collapsible=icon]/sidebar-wrapper:justify-center min-h-8">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "transition-all duration-200",
                        isActive &&
                          "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                      )}
                    >
                      <Link to={item.href} className="flex items-center gap-2 overflow-hidden">
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive && "text-primary",
                          )}
                        />
                        <span className="font-medium truncate group-data-[collapsible=icon]/sidebar-wrapper:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            {!isPro && (
              <div className="px-2 pt-6 group-data-[collapsible=icon]/sidebar-wrapper:px-0 group-data-[collapsible=icon]/sidebar-wrapper:flex group-data-[collapsible=icon]/sidebar-wrapper:justify-center">
                <Button asChild className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground group-data-[collapsible=icon]/sidebar-wrapper:!w-8 group-data-[collapsible=icon]/sidebar-wrapper:!min-w-8 group-data-[collapsible=icon]/sidebar-wrapper:!p-0 group-data-[collapsible=icon]/sidebar-wrapper:justify-center">
                  <Link to="/pricing-selection" className="flex items-center gap-2 overflow-hidden">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]/sidebar-wrapper:hidden">Upgrade to Pro</span>
                  </Link>
                </Button>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto shrink-0 p-2 flex flex-col gap-2">
        <SidebarSeparator className="mb-0" />
        <div className="flex items-center px-2 group-data-[collapsible=icon]/sidebar-wrapper:justify-center">
          <ThemeToggle />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-auto py-2 px-2 hover:bg-sidebar-accent group-data-[collapsible=icon]/sidebar-wrapper:justify-center group-data-[collapsible=icon]/sidebar-wrapper:px-0"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left overflow-hidden group-data-[collapsible=icon]/sidebar-wrapper:hidden">
                <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                  {user?.displayName ?? "User"}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {user?.email ?? ""}
                </span>
              </div>
              <ChevronUp className="ml-auto h-4 w-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]/sidebar-wrapper:hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]"
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">
                {user?.displayName ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link to="/account" className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
