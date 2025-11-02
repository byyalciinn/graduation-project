"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Package,
  ShoppingBag,
  FileText,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  HelpCircle,
  User,
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
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Ana Bölüm
const mainItems = [
  {
    title: "Ana Sayfa",
    url: "/seller-dashboard",
    icon: Home,
  },
]

// Ürün ve Stok Yönetimi (Placeholder for future expansion)
const productItems = [
  {
    title: "Ürünlerim",
    url: "/seller-dashboard/products",
    icon: Package,
  },
  {
    title: "Siparişler",
    url: "/seller-dashboard/orders",
    icon: ShoppingBag,
    badge: "8",
  },
  {
    title: "Talepler",
    url: "/seller-dashboard/requests",
    icon: FileText,
    badge: "3",
  },
]

// İletişim ve Raporlama
const communicationItems = [
  {
    title: "Mesajlar",
    url: "/seller-dashboard/messages",
    icon: MessageSquare,
    badge: "5",
  },
  {
    title: "Bildirimler",
    url: "/seller-dashboard/notifications",
    icon: Bell,
    badge: "7",
  },
  {
    title: "Raporlar",
    url: "/seller-dashboard/reports",
    icon: BarChart3,
  },
]

// Hesap Yönetimi
const accountItems = [
  {
    title: "Mağaza Bilgileri",
    url: "/seller-dashboard/store",
    icon: Store,
  },
  {
    title: "Profil",
    url: "/seller-dashboard/profile",
    icon: User,
  },
  {
    title: "Ayarlar",
    url: "/seller-dashboard/settings",
    icon: Settings,
  },
  {
    title: "Yardım",
    url: "/seller-dashboard/support",
    icon: HelpCircle,
  },
]

export function SellerSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Link href="/seller-dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Satıcı Paneli
                  </span>
                  <span className="truncate text-xs">
                    Seller Dashboard
                  </span>
                </div>
                <ChevronDown className="ml-auto" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Ana Bölüm */}
        <SidebarGroup>
          <SidebarGroupLabel>Ana Bölüm</SidebarGroupLabel>
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
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Ürün ve Sipariş Yönetimi */}
        <SidebarGroup>
          <SidebarGroupLabel>Ürün ve Sipariş</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {productItems.map((item) => {
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
                        <item.icon />
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

        {/* İletişim ve Raporlama */}
        <SidebarGroup>
          <SidebarGroupLabel>İletişim ve Raporlama</SidebarGroupLabel>
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
                        <item.icon />
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

        {/* Hesap Yönetimi */}
        <SidebarGroup>
          <SidebarGroupLabel>Hesap Yönetimi</SidebarGroupLabel>
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
                        <item.icon />
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
                    <AvatarImage src="/avatar.png" alt="Seller" />
                    <AvatarFallback className="rounded-lg">
                      ST
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Satıcı</span>
                    <span className="truncate text-xs">
                      seller@example.com
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
                      <AvatarImage src="/avatar.png" alt="Seller" />
                      <AvatarFallback className="rounded-lg">ST</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Satıcı</span>
                      <span className="truncate text-xs">seller@example.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/seller-dashboard/profile">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/seller-dashboard/settings">Ayarlar</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
