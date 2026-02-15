import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Menu } from "lucide-react"

import { cn } from "@/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "4rem"

type SidebarContext = {
    state: "expanded" | "collapsed"
    open: boolean
    setOpen: (open: boolean) => void
    openMobile: boolean
    setOpenMobile: (open: boolean) => void
    isMobile: boolean
    toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.")
    }

    return context
}

// Helper to check media query
function useMediaQuery(query: string) {
    const [value, setValue] = React.useState(false)

    React.useEffect(() => {
        function onChange(event: MediaQueryListEvent) {
            setValue(event.matches)
        }

        const result = matchMedia(query)
        result.addEventListener("change", onChange)
        setValue(result.matches)

        return () => result.removeEventListener("change", onChange)
    }, [query])

    return value
}

interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const SidebarProvider = React.forwardRef<
    HTMLDivElement,
    SidebarProviderProps
>(
    (
        {
            defaultOpen = true,
            open: openProp,
            onOpenChange: onOpenChangeProp,
            className,
            style,
            children,
            ...props
        },
        ref
    ) => {
        const isMobile = useMediaQuery("(max-width: 768px)")
        const [openMobile, setOpenMobile] = React.useState(false)

        const [_open, _setOpen] = React.useState(defaultOpen)
        const open = openProp ?? _open
        const setOpen = React.useCallback(
            (value: boolean | ((value: boolean) => boolean)) => {
                const openValue = typeof value === "function" ? value(open) : value
                if (onOpenChangeProp) {
                    onOpenChangeProp(openValue)
                } else {
                    _setOpen(openValue)
                }

                document.cookie = `${SIDEBAR_COOKIE_NAME}=${openValue}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
            },
            [open, onOpenChangeProp]
        )

        const toggleSidebar = React.useCallback(() => {
            return isMobile
                ? setOpenMobile((open) => !open)
                : setOpen((open) => !open)
        }, [isMobile, setOpen, setOpenMobile])

        const state = open ? "expanded" : "collapsed"

        const value: SidebarContext = {
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
        }

        return (
            <SidebarContext.Provider value={value}>
                <div
                    style={
                        {
                            "--sidebar-width": SIDEBAR_WIDTH,
                            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                            ...style,
                        } as React.CSSProperties
                    }
                    className={cn(
                        "flex h-full w-full has-[[data-variant=inset]]:bg-sidebar",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </div>
            </SidebarContext.Provider>
        )
    }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        side?: "left" | "right"
        variant?: "sidebar" | "floating" | "inset"
        collapsible?: "offcanvas" | "icon" | "none"
    }
>(
    (
        {
            side = "left",
            variant = "sidebar",
            collapsible = "offcanvas",
            className,
            children,
            ...props
        },
        ref
    ) => {
        const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

        if (collapsible === "none") {
            return (
                <div
                    className={cn(
                        "flex h-full w-[var(--sidebar-width)] flex-col bg-sidebar text-sidebar-foreground",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </div>
            )
        }

        if (isMobile) {
            return (
                <Sheet open={openMobile} onOpenChange={setOpenMobile}>
                    <SheetContent
                        side={side}
                        className="w-[var(--sidebar-width-mobile)] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
                        style={
                            {
                                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
                            } as React.CSSProperties
                        }
                    >
                        <div className="flex h-full w-full flex-col">{children}</div>
                    </SheetContent>
                </Sheet>
            )
        }

        return (
            <div
                ref={ref}
                className="group/sidebar-wrapper flex h-full md:w-auto has-[[data-state=collapsed]]:w-[var(--sidebar-width-icon)]"
                data-state={state}
                {...props}
            >
                <div
                    className={cn(
                        "relative hidden h-full w-[var(--sidebar-width)] flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out md:flex",
                        state === "collapsed" && "w-[var(--sidebar-width-icon)]",
                        className
                    )}
                >
                    {children}
                </div>
            </div>
        )
    }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
    React.ElementRef<typeof Button>,
    React.ComponentPropsWithoutRef<typeof Button>
>(({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("h-9 w-9", className)}
            onClick={(event) => {
                onClick?.(event)
                toggleSidebar()
            }}
            ref={ref}
            {...props}
        >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
    <button
        ref={ref}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        className={cn(
            "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-foreground group-data-[state=collapsed]/sidebar-wrapper:hover:after:bg-foreground after:-translate-x-1/2 after:bg-border group-hover/sidebar-wrapper:after:bg-foreground group-data-[state=collapsed]/sidebar-wrapper:hover:w-full group-data-[state=collapsed]/sidebar-wrapper:hover:after:left-full group-data-[state=collapsed]/sidebar-wrapper:hover:after:translate-x-0 group-data-[state=collapsed]/sidebar-wrapper:hover:-translate-x-full md:flex",
            className
        )}
        {...props}
    />
))
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex min-h-svh flex-1 flex-col bg-background",
            "peer-data-[state=collapsed]/sidebar-wrapper:flex",
            className
        )}
        {...props}
    />
))
SidebarInset.displayName = "SidebarInset"

const SidebarContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto overflow-x-hidden",
            className
        )}
        {...props}
    />
))
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("relative flex w-full min-w-0 flex-col gap-2 p-4", className)}
        {...props}
    />
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<"span"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span"

    return (
        <Comp
            ref={ref}
            data-sidebar="group-label"
            className={cn(
                "display: block px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0",
                "group-hover/sidebar-wrapper:in-data-[state=collapsed]:block hidden",
                className
            )}
            {...props}
        />
    )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            ref={ref}
            data-sidebar="group-action"
            className={cn(
                "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0",
                "after:absolute after:-inset-2 after:md:hidden",
                "group-data-[collapsible=icon]/sidebar-wrapper:hidden",
                className
            )}
            {...props}
        />
    )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("w-full text-sm", className)}
        {...props}
    />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        data-sidebar="menu"
        className={cn("flex w-full min-w-0 flex-col gap-1", className)}
        {...props}
    />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
    HTMLLIElement,
    React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
    <li
        ref={ref}
        data-sidebar="menu-item"
        className={cn("group/menu-item relative", className)}
        {...props}
    />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-sub]]/menu-item:pt-0 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]/sidebar-wrapper:!size-8 group-data-[collapsible=icon]/sidebar-wrapper:!p-0 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                outline:
                    "border border-sidebar-border bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&>svg:-ml-1]:ml-0 [&>svg:last-child]:-mr-1:mr-0",
            },
            size: {
                default: "h-8 text-sm",
                sm: "h-7 text-xs",
                lg: "h-12 text-sm group-data-[collapsible=icon]/sidebar-wrapper:!p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const SidebarMenuButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<"button"> &
    VariantProps<typeof sidebarMenuButtonVariants> & {
        asChild?: boolean
        isActive?: boolean
    }
>(
    (
        { className, variant, size, isActive, asChild = false, ...props },
        ref
    ) => {
        const Comp = asChild ? Slot : "button"

        return (
            <Comp
                ref={ref}
                data-sidebar="menu-button"
                data-active={isActive}
                className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
                {...props}
            />
        )
    }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            ref={ref}
            data-sidebar="menu-action"
            className={cn(
                "peer-hover/menu-button:opacity-100 absolute right-1.5 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md outline-none ring-sidebar-ring transition-all opacity-0 focus-visible:ring-2 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[size=sm]/menu-item:right-1 group-data-[size=sm]/menu-item:top-1 group-data-[size=lg]/menu-item:right-2.5 group-data-[size=lg]/menu-item:top-2.5 after:absolute after:-inset-1.5 after:md:hidden",
                className
            )}
            {...props}
        />
    )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
    HTMLSpanElement,
    React.ComponentPropsWithoutRef<"span"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span"

    return (
        <Comp
            ref={ref}
            data-sidebar="menu-badge"
            className={cn(
                "pointer-events-none absolute right-1 inline-flex h-5 max-w-full items-center rounded-md border border-sidebar-border bg-sidebar px-1 text-xs font-medium text-sidebar-foreground outline-none group-data-[size=sm]/menu-item:max-w-[70px] group-data-[size=default]/menu-item:max-w-[100px] group-data-[size=lg]/menu-item:max-w-none",
                className
            )}
            {...props}
        />
    )
})
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSub = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        data-sidebar="menu-sub"
        className={cn(
            "border-sidebar-border group-data-[collapsible=icon]/sidebar-wrapper:hidden w-full border-l px-2 py-0.5 group-has-[.group/menu-item[data-active=true]]/sidebar-group:border-sidebar-accent",
            className
        )}
        {...props}
    />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
    HTMLLIElement,
    React.HTMLAttributes<HTMLLIElement>
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<"a"> & {
        asChild?: boolean
        size?: "sm" | "md"
        isActive?: boolean
    }
>(({ className, size = "md", isActive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"

    return (
        <Comp
            ref={ref}
            data-sidebar="menu-sub-button"
            data-size={size}
            data-active={isActive}
            className={cn(
                "peer/menu-sub-button ring-sidebar-ring hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 relative flex h-7 min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-xs outline-none transition-all focus-visible:ring-2 data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground hover:bg-sidebar-accent",
                className
            )}
            {...props}
        />
    )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

// Missing components implementations
const SidebarSeparator = ({ className, ...props }: React.ComponentProps<typeof Separator>) => (
    <Separator
        data-sidebar="separator"
        className={cn("mx-2 w-auto bg-sidebar-border", className)}
        {...props}
    />
)

const SidebarHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        data-sidebar="header"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
    />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        data-sidebar="footer"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
    />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarInput = React.forwardRef<
    React.ElementRef<typeof Input>,
    React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => (
    <Input
        ref={ref}
        data-sidebar="input"
        className={cn(
            "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            className
        )}
        {...props}
    />
))
SidebarInput.displayName = "SidebarInput"

export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarInput,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
}
