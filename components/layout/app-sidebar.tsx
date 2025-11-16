"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Space_Grotesk } from "next/font/google"

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})
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
    <Sidebar collapsible="icon" variant="sidebar" className={spaceGrotesk.className}>
      <SidebarHeader className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-6 py-5">
          <Link href="/admin-dashboard" className="flex items-center gap-3 flex-1 group">
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="Woopy Logo" 
                width={40} 
                height={40}
                className="object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#1F1B24] group-data-[collapsible=icon]:hidden transition-colors">
              Woopy
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Main</SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
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
                      className={`relative rounded-xl transition-all duration-200 ${isActive ? 'bg-[#770022] text-white shadow-lg shadow-[#770022]/20 hover:bg-[#770022]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-4 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#770022]'} group-data-[collapsible=icon]:!text-[#770022]`} />
                        <span className="font-medium truncate">{item.title}</span>
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
          <SidebarGroupLabel className="px-6 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">User Management</SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
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
                      className={`relative rounded-xl transition-all duration-200 ${isActive ? 'bg-[#770022] text-white shadow-lg shadow-[#770022]/20 hover:bg-[#770022]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-4 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#770022]'} group-data-[collapsible=icon]:!text-[#770022]`} />
                        <span className="font-medium truncate">{item.title}</span>
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
          <SidebarGroupLabel className="px-6 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Product & Requests</SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
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
                      className={`relative rounded-xl transition-all duration-200 ${isActive ? 'bg-[#770022] text-white shadow-lg shadow-[#770022]/20 hover:bg-[#770022]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-4 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#770022]'} group-data-[collapsible=icon]:!text-[#770022]`} />
                        <span className="font-medium truncate">{item.title}</span>
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
          <SidebarGroupLabel className="px-6 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Orders & Payments</SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
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
                      className={`relative rounded-xl transition-all duration-200 ${isActive ? 'bg-[#770022] text-white shadow-lg shadow-[#770022]/20 hover:bg-[#770022]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-4 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#770022]'} group-data-[collapsible=icon]:!text-[#770022]`} />
                        <span className="font-medium truncate">{item.title}</span>
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
          <SidebarGroupLabel className="px-6 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Analytics</SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
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
                      className={`relative rounded-xl transition-all duration-200 ${isActive ? 'bg-[#770022] text-white shadow-lg shadow-[#770022]/20 hover:bg-[#770022]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-4 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#770022]'} group-data-[collapsible=icon]:!text-[#770022]`} />
                        <span className="font-medium truncate">{item.title}</span>
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
          <SidebarGroupLabel className="px-6 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Communication</SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
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
                      className={`relative rounded-xl transition-all duration-200 ${isActive ? 'bg-[#770022] text-white shadow-lg shadow-[#770022]/20 hover:bg-[#770022]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-4 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#770022]'} group-data-[collapsible=icon]:!text-[#770022]`} />
                        <span className="font-medium truncate">{item.title}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-[#770022] text-white text-xs px-2 py-0.5 rounded-full">
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
          <SidebarGroupLabel className="px-6 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">System</SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
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
                      className={`relative rounded-xl transition-all duration-200 ${isActive ? 'bg-[#770022] text-white shadow-lg shadow-[#770022]/20 hover:bg-[#770022]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-4 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#770022]'} group-data-[collapsible=icon]:!text-[#770022]`} />
                        <span className="font-medium truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="mx-3 my-2 rounded-xl hover:bg-gray-50 transition-colors data-[state=open]:bg-gray-50"
                >
                  <Avatar className="h-9 w-9 rounded-xl ring-2 ring-gray-100">
                    <AvatarImage src={userData?.image || "/avatar.png"} alt={userData?.name || "Admin"} />
                    <AvatarFallback className="rounded-xl bg-[#770022] text-white font-semibold">
                      {getInitials(userData?.name || null)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-gray-900">{userData?.name || "Admin"}</span>
                    <span className="truncate text-xs text-gray-500">
                      {userData?.email || "admin@woopy.com"}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4 text-gray-400" />
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
                  className="cursor-pointer text-[#770022] focus:text-[#770022] focus:bg-red-50 font-medium"
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
