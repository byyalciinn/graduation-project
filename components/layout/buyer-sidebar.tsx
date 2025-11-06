"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  PlusCircle,
  Bookmark,
  Tag,
  ShoppingCart,
  CreditCard,
  RotateCcw,
  MessageSquare,
  Bell,
  HelpCircle,
  User,
  MapPin,
  Shield,
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
    title: "Home",
    url: "/buyer-dashboard",
    icon: Home,
  },
]

// Product Search & Request
const productRequestItems = [
  {
    title: "My Requests",
    url: "/buyer-dashboard/requests",
    icon: FileText,
  },
  {
    title: "Create New Request",
    url: "/buyer-dashboard/requests/new",
    icon: PlusCircle,
  },
  {
    title: "Saved Products",
    url: "/buyer-dashboard/saved-products",
    icon: Bookmark,
  },
  {
    title: "My Offers",
    url: "/buyer-dashboard/offers",
    icon: Tag,
  },
]

// Orders & Transactions
const orderItems = [
  {
    title: "My Orders",
    url: "/buyer-dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Payment History",
    url: "/buyer-dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Returns & Cancellations",
    url: "/buyer-dashboard/returns",
    icon: RotateCcw,
  },
]

// Communication & Support
const communicationItems = [
  {
    title: "Messages",
    url: "/buyer-dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Notifications",
    url: "/buyer-dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Help & Support",
    url: "/buyer-dashboard/support",
    icon: HelpCircle,
  },
]

// Account Management
const accountItems = [
  {
    title: "Profile Information",
    url: "/buyer-dashboard/profile",
    icon: User,
  },
  {
    title: "My Addresses",
    url: "/buyer-dashboard/addresses",
    icon: MapPin,
  },
  {
    title: "Security",
    url: "/buyer-dashboard/security",
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

export function BuyerSidebar() {
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
    if (!name) return "AL"
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
          <Link href="/buyer-dashboard" className="flex items-center gap-3 flex-1">
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

        {/* Product Search & Request */}
        <SidebarGroup>
          <SidebarGroupLabel>Product Search & Request</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {productRequestItems.map((item) => {
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

        {/* Orders & Transactions */}
        <SidebarGroup>
          <SidebarGroupLabel>Orders & Transactions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {orderItems.map((item) => {
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
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Account Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => {
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
                    <AvatarImage src={userData?.image || "/avatar.png"} alt={userData?.name || "Buyer"} />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(userData?.name || null)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userData?.name || "Buyer"}</span>
                    <span className="truncate text-xs">
                      {userData?.email || "buyer@example.com"}
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
                      <AvatarImage src={userData?.image || "/avatar.png"} alt={userData?.name || "Buyer"} />
                      <AvatarFallback className="rounded-lg">{getInitials(userData?.name || null)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userData?.name || "Buyer"}</span>
                      <span className="truncate text-xs">{userData?.email || "buyer@example.com"}</span>
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
