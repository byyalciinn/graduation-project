"use client"

import Link from "next/link"
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
  Package,
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
    url: "/buyer-dashboard",
    icon: Home,
  },
]

// Ürün Bulma ve İstek Bölümü
const productRequestItems = [
  {
    title: "İsteklerim/Taleplerim",
    url: "/buyer-dashboard/requests",
    icon: FileText,
  },
  {
    title: "Yeni Talep Oluştur",
    url: "/buyer-dashboard/requests/new",
    icon: PlusCircle,
  },
  {
    title: "Kaydedilen Ürünler",
    url: "/buyer-dashboard/saved-products",
    icon: Bookmark,
  },
  {
    title: "Tekliflerim",
    url: "/buyer-dashboard/offers",
    icon: Tag,
    badge: "5",
  },
]

// İşlem ve Sipariş Bölümü
const orderItems = [
  {
    title: "Siparişlerim",
    url: "/buyer-dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Ödeme Geçmişi",
    url: "/buyer-dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "İade ve İptal",
    url: "/buyer-dashboard/returns",
    icon: RotateCcw,
  },
]

// İletişim ve Destek Bölümü
const communicationItems = [
  {
    title: "Mesajlar/Gelen Kutusu",
    url: "/buyer-dashboard/messages",
    icon: MessageSquare,
    badge: "3",
  },
  {
    title: "Bildirimler",
    url: "/buyer-dashboard/notifications",
    icon: Bell,
    badge: "12",
  },
  {
    title: "Yardım/Destek",
    url: "/buyer-dashboard/support",
    icon: HelpCircle,
  },
]

// Hesap Yönetimi
const accountItems = [
  {
    title: "Profil Bilgileri",
    url: "/buyer-dashboard/profile",
    icon: User,
  },
  {
    title: "Adreslerim",
    url: "/buyer-dashboard/addresses",
    icon: MapPin,
  },
  {
    title: "Güvenlik",
    url: "/buyer-dashboard/security",
    icon: Shield,
  },
]

export function BuyerSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Link href="/buyer-dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Package className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Alıcı Paneli
                  </span>
                  <span className="truncate text-xs">
                    Buyer Dashboard
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

        {/* Ürün Bulma ve İstek Bölümü */}
        <SidebarGroup>
          <SidebarGroupLabel>Ürün Bulma ve İstek</SidebarGroupLabel>
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

        {/* İşlem ve Sipariş Bölümü */}
        <SidebarGroup>
          <SidebarGroupLabel>İşlem ve Sipariş</SidebarGroupLabel>
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

        {/* İletişim ve Destek Bölümü */}
        <SidebarGroup>
          <SidebarGroupLabel>İletişim ve Destek</SidebarGroupLabel>
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
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback className="rounded-lg">
                      AL
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Alıcı</span>
                    <span className="truncate text-xs">
                      buyer@example.com
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
                      <AvatarImage src="/avatar.png" alt="User" />
                      <AvatarFallback className="rounded-lg">AL</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Alıcı</span>
                      <span className="truncate text-xs">buyer@example.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/buyer-dashboard/profile">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/buyer-dashboard/security">Ayarlar</Link>
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
