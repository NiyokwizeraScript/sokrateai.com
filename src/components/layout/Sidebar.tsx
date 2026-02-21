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
  ScanLine,
  FileText,
  History,
  LogOut,
  ChevronUp,
  Trophy,
  MessageSquare,
  UserCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";

const navItems: { title: string; icon: typeof LayoutDashboard; href: string; proOnly?: boolean }[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard", proOnly: true },
  { title: "The Solver", icon: ScanLine, href: "/solver", proOnly: true },
  { title: "The Synthesizer", icon: FileText, href: "/synthesizer", proOnly: true },
  { title: "The Quizzes", icon: Trophy, href: "/quizzes" },
  { title: "Study History", icon: History, href: "/history", proOnly: true },
  { title: "Feedback", icon: MessageSquare, href: "/feedback", proOnly: true },
  { title: "Account", icon: UserCircle, href: "/account" },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isPro } = useUserProfile();
  const visibleNavItems = navItems.filter((item) => !item.proOnly || isPro);

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
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md" />
            <img
              src="/Sokrate AI.png"
              alt="Sokrate AI"
              className="relative h-9 w-9 object-contain drop-shadow-lg"
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]/sidebar-wrapper:hidden overflow-hidden">
            <span className="font-heading font-bold text-lg tracking-tight text-primary">
              Sokrate AI
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Science Lab
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavItems.map((item) => {
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
          </SidebarGroupContent>
        </SidebarGroup>
        {!isPro && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="flex items-center group-data-[collapsible=icon]/sidebar-wrapper:justify-center min-h-8">
                  <SidebarMenuButton
                    asChild
                    className="cta-premium relative !bg-gradient-to-r !from-emerald-600 !via-green-500 !to-teal-600 !text-white hover:!brightness-110 active:!scale-[0.98] shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-400/35 transition-all duration-200 border border-white/20 hover:border-white/30 outline outline-2 outline-emerald-400/50 outline-offset-1 hover:outline-emerald-300/60 hover:scale-[1.02]"
                  >
                    <Link to="/pricing-selection" className="focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md">
                      <Sparkles className="h-4 w-4 shrink-0 drop-shadow-sm" />
                      <span className="font-semibold truncate drop-shadow-sm group-data-[collapsible=icon]/sidebar-wrapper:hidden">Upgrade to Pro</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarSeparator className="mb-2" />
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
