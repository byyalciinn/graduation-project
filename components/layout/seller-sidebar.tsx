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
  Compass,
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

const getButtonClasses = (isActive: boolean) =>
  `relative rounded-xl transition-all duration-200 border border-transparent ${
    isActive
      ? 'bg-[#F9E3EC] text-[#4F0F28] border-[#F4CBDC] shadow-md shadow-[#770022]/15 hover:bg-[#F6D3E0]'
      : 'text-gray-700 hover:bg-gray-50'
  }`

const getIconClasses = (isActive: boolean) =>
  `h-5 w-5 flex-shrink-0 transition-colors ${
    isActive ? 'text-[#4F0F28]' : 'text-[#770022]'
  } group-data-[collapsible=icon]:!text-[#770022]`

// Explore Section
const exploreItems = [
  {
    title: "Explore Requests",
    url: "/seller-dashboard/explore",
    icon: Compass,
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
    <Sidebar collapsible="icon" variant="sidebar" className={spaceGrotesk.className}>
      <SidebarHeader className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-6 py-5">
          <Link href="/seller-dashboard" className="flex items-center gap-3 flex-1 group">
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
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Main</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
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
                      className={getButtonClasses(isActive)}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={getIconClasses(isActive)} />
                        <span className="font-medium truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Explore Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Explore</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {exploreItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      size="default"
                      className={getButtonClasses(isActive)}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={getIconClasses(isActive)} />
                        <span className="font-medium truncate">{item.title}</span>
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
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Product & Inventory</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
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
                      className={getButtonClasses(isActive)}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={getIconClasses(isActive)} />
                        <span className="font-medium truncate">{item.title}</span>
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
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Sales & Requests</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
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
                      className={getButtonClasses(isActive)}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={getIconClasses(isActive)} />
                        <span className="font-medium truncate">{item.title}</span>
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
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Finance & Analytics</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
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
                      className={getButtonClasses(isActive)}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={getIconClasses(isActive)} />
                        <span className="font-medium truncate">{item.title}</span>
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
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-gray-500">Account & Communication</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
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
                      className={getButtonClasses(isActive)}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                        <item.icon className={getIconClasses(isActive)} />
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
                    <AvatarImage src={userData?.image || "/avatar.png"} alt={userData?.name || "Seller"} />
                    <AvatarFallback className="rounded-xl bg-[#770022] text-white font-semibold">
                      {getInitials(userData?.name || null)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-gray-900">{userData?.name || "Seller"}</span>
                    <span className="truncate text-xs text-gray-500">
                      {userData?.email || "seller@example.com"}
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
