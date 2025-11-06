"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  Package,
  PlusCircle,
  Warehouse,
  FileText,
  Tag,
  ShoppingBag,
  Truck,
  DollarSign,
  CreditCard,
  BarChart3,
  MessageSquare,
  Bell,
  Store,
  ChevronDown,
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
    title: "Home",
    url: "/seller-dashboard",
    icon: Home,
  },
]

// Product & Inventory Management
const productInventoryItems = [
  {
    title: "My Products",
    url: "/seller-dashboard/products",
    icon: Package,
  },
  {
    title: "Add New Product",
    url: "/seller-dashboard/products/new",
    icon: PlusCircle,
  },
  {
    title: "Inventory Tracking",
    url: "/seller-dashboard/inventory",
    icon: Warehouse,
  },
]

// Sales & Request Management
const salesRequestItems = [
  {
    title: "Incoming Requests",
    url: "/seller-dashboard/requests",
    icon: FileText,
  },
  {
    title: "My Offers",
    url: "/seller-dashboard/offers",
    icon: Tag,
  },
  {
    title: "Orders",
    url: "/seller-dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Shipping Management",
    url: "/seller-dashboard/shipping",
    icon: Truck,
  },
]

// Finance & Analytics
const financeAnalyticsItems = [
  {
    title: "Earnings/Payments",
    url: "/seller-dashboard/earnings",
    icon: DollarSign,
  },
  {
    title: "Payout Orders",
    url: "/seller-dashboard/payouts",
    icon: CreditCard,
  },
  {
    title: "Reports & Analytics",
    url: "/seller-dashboard/reports",
    icon: BarChart3,
  },
]

// Account & Communication
const accountCommunicationItems = [
  {
    title: "Messages",
    url: "/seller-dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Notifications",
    url: "/seller-dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Store Settings",
    url: "/seller-dashboard/store-settings",
    icon: Store,
  },
]

interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string | null
}

export function SellerSidebar() {
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
    if (!name) return "ST"
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
          <Link href="/seller-dashboard" className="flex items-center gap-3 flex-1">
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

        {/* Product & Inventory Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Product & Inventory Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {productInventoryItems.map((item) => {
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

        {/* Sales & Request Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Sales & Request Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {salesRequestItems.map((item) => {
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

        {/* Finance & Analytics */}
        <SidebarGroup>
          <SidebarGroupLabel>Finance & Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeAnalyticsItems.map((item) => {
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

        {/* Account & Communication */}
        <SidebarGroup>
          <SidebarGroupLabel>Account & Communication</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountCommunicationItems.map((item) => {
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
                    <AvatarImage src={userData?.image || "/avatar.png"} alt={userData?.name || "Seller"} />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(userData?.name || null)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userData?.name || "Seller"}</span>
                    <span className="truncate text-xs">
                      {userData?.email || "seller@example.com"}
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
                      <AvatarImage src={userData?.image || "/avatar.png"} alt={userData?.name || "Seller"} />
                      <AvatarFallback className="rounded-lg">{getInitials(userData?.name || null)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userData?.name || "Seller"}</span>
                      <span className="truncate text-xs">{userData?.email || "seller@example.com"}</span>
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
