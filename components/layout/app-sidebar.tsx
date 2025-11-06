"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Store,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  HelpCircle,
  ChevronDown,
  Package,
  CreditCard,
  Tag,
  Bell,
  Shield,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProfileModal } from "@/components/modals/profile-modal"
import { SettingsModal } from "@/components/modals/settings-modal"

// Main Section
const mainItems = [
  {
    title: "Dashboard",
    url: "/admin-dashboard",
    icon: LayoutDashboard,
  },
]

// User Management
const userManagementItems = [
  {
    title: "All Users",
    url: "/admin-dashboard/users",
    icon: Users,
  },
  {
    title: "Buyers",
    url: "/admin-dashboard/buyers",
    icon: ShoppingBag,
  },
  {
    title: "Sellers",
    url: "/admin-dashboard/sellers",
    icon: Store,
  },
]

// Product & Request Management
const productManagementItems = [
  {
    title: "Products",
    url: "/admin-dashboard/products",
    icon: Package,
  },
  {
    title: "Requests",
    url: "/admin-dashboard/requests",
    icon: FileText,
  },
  {
    title: "Offers",
    url: "/admin-dashboard/offers",
    icon: Tag,
  },
]

// Order & Payment Management
const orderManagementItems = [
  {
    title: "Orders",
    url: "/admin-dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Payments",
    url: "/admin-dashboard/payments",
    icon: CreditCard,
  },
]

// Analytics & Reports
const analyticsItems = [
  {
    title: "Analytics",
    url: "/admin-dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    url: "/admin-dashboard/reports",
    icon: FileText,
  },
]

// Communication & Support
const communicationItems = [
  {
    title: "Messages",
    url: "/admin-dashboard/messages",
    icon: MessageSquare,
    badge: "5",
  },
  {
    title: "Notifications",
    url: "/admin-dashboard/notifications",
    icon: Bell,
    badge: "12",
  },
  {
    title: "Support Tickets",
    url: "/admin-dashboard/support",
    icon: HelpCircle,
  },
]

// System Settings
const systemItems = [
  {
    title: "Settings",
    url: "/admin-dashboard/settings",
    icon: Settings,
  },
  {
    title: "Security",
    url: "/admin-dashboard/security",
    icon: Shield,
  },
]

interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string | null
}

export function AppSidebar() {
  const pathname = usePathname()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/me")
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "AD"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="sticky top-0 z-10 bg-sidebar border-b">
        <div className="flex items-center gap-3 p-4">
          <Link href="/admin-dashboard" className="flex items-center gap-3 flex-1">
            <Image 
              src="/logo.png" 
              alt="Woopy Logo" 
              width={48} 
              height={48}
              className="object-contain flex-shrink-0"
              priority
            />
            <span className="text-2xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Woopy
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      size="default"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-6 w-6 text-green-600" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Management */}
        <SidebarGroup>
          <SidebarGroupLabel>User Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userManagementItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      size="default"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-6 w-6 text-green-600" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Product & Request Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Product & Request Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {productManagementItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      size="default"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-6 w-6 text-green-600" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Order & Payment Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Order & Payment Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {orderManagementItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      size="default"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-6 w-6 text-green-600" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Analytics & Reports */}
        <SidebarGroup>
          <SidebarGroupLabel>Analytics & Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      size="default"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-6 w-6 text-green-600" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Communication & Support */}
        <SidebarGroup>
          <SidebarGroupLabel>Communication & Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communicationItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      size="default"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-6 w-6 text-green-600" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>System Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      size="default"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-6 w-6 text-green-600" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userData?.image || "/avatar.png"} alt={userData?.name || "Admin"} />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(userData?.name || null)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userData?.name || "Admin"}</span>
                    <span className="truncate text-xs">
                      {userData?.email || "admin@woopy.com"}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={userData?.image || "/avatar.png"} alt={userData?.name || "Admin"} />
                      <AvatarFallback className="rounded-lg">{getInitials(userData?.name || null)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userData?.name || "Admin"}</span>
                      <span className="truncate text-xs">{userData?.email || "admin@woopy.com"}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSettingsModalOpen(true)}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={async () => {
                    const { signOut } = await import('next-auth/react');
                    await signOut({ callbackUrl: '/login' });
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />

      {/* Modals */}
      <ProfileModal open={profileModalOpen} onOpenChange={setProfileModalOpen} />
      <SettingsModal open={settingsModalOpen} onOpenChange={setSettingsModalOpen} />
    </Sidebar>
  )
}
