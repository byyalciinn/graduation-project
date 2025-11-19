"use client"

import { Search, Sun, Moon, Settings, Check, Bell, User, LogOut, CreditCard, Heart, ShoppingBag, HelpCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

const tabs = [
  { name: "Overview", href: "/admin-dashboard" },
  { name: "Customers", href: "/admin-dashboard/users" },
  { name: "Products", href: "/admin-dashboard/tasks" },
  { name: "Settings", href: "/admin-dashboard/settings" },
]

const dropdownItemAccent = "cursor-pointer hover:bg-[#FDECEF] hover:text-[#5C0F27] focus:bg-[#FDECEF] focus:text-[#5C0F27]"

export function ModernHeader() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("Overview")
  const { data: session } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [buyerOffers, setBuyerOffers] = useState<any[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const isBuyer = (userData?.role || session?.user?.role) === "buyer"
  const showNotificationDot = isBuyer ? buyerOffers.some((offer: any) => offer.status === "pending") : true

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/user/me')
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(err => console.error('Error fetching user:', err))
    }
  }, [session])

  useEffect(() => {
    if (!isBuyer) return

    setLoadingNotifications(true)
    fetch("/api/offers/buyer")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch buyer offers")
        }
        return res.json()
      })
      .then((data) => setBuyerOffers(data))
      .catch((err) => console.error("Error fetching buyer offers:", err))
      .finally(() => setLoadingNotifications(false))
  }, [isBuyer])

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="flex h-14 items-center gap-4 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />

        {/* Tabs */}
        <nav className="flex flex-1 items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground/80 ${
                activeTab === tab.name
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="h-9 w-[200px] pl-8 lg:w-[300px]"
            />
            <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          {/* Theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
                {theme === "light" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
                {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>System</span>
                {theme === "system" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
                {showNotificationDot && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#B0112D] ring-2 ring-background" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {isBuyer ? (
                  loadingNotifications ? (
                    <div className="px-3 py-4 text-xs text-muted-foreground">
                      Loading notifications...
                    </div>
                  ) : buyerOffers.length === 0 ? (
                    <div className="px-3 py-4 text-xs text-muted-foreground">
                      No notifications yet
                    </div>
                  ) : (
                    buyerOffers.slice(0, 5).map((offer: any) => (
                      <DropdownMenuItem
                        key={offer.id}
                        className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div
                            className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                              offer.status === "pending" ? "bg-[#B0112D]" : "bg-muted"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {offer.status === "pending" ? "New offer received" : "Offer updated"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {offer.productRequest?.productName || "Product request"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(offer.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )
                ) : (
                  <>
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                      <div className="flex items-start gap-3 w-full">
                        <div className="h-2 w-2 rounded-full bg-[#B0112D] mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">New offer received</p>
                          <p className="text-xs text-muted-foreground mt-0.5">You have a new offer for your product request</p>
                          <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                      <div className="flex items-start gap-3 w-full">
                        <div className="h-2 w-2 rounded-full bg-muted mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Order shipped</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Your order #1234 has been shipped</p>
                          <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                      <div className="flex items-start gap-3 w-full">
                        <div className="h-2 w-2 rounded-full bg-muted mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Payment received</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Payment confirmed for order #1233</p>
                          <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-sm font-medium text-[#B0112D] cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData?.image || undefined} alt={userData?.name || "User"} />
                  <AvatarFallback className="bg-[#FDECEF] text-[#5C0F27] text-xs font-semibold">
                    {getInitials(userData?.name || session?.user?.name || null)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              {/* User Info */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{userData?.name || session?.user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData?.email || session?.user?.email || ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#FDECEF] text-[#5C0F27] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                    {(userData?.role || session?.user?.role || "User").toString()}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Account Management */}
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Management</p>
              </div>
              <DropdownMenuItem className={dropdownItemAccent}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={dropdownItemAccent}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={dropdownItemAccent}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* Platform Features */}
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platform Features</p>
              </div>
              <DropdownMenuItem className={dropdownItemAccent}>
                <Heart className="mr-2 h-4 w-4" />
                <span>My Favorites</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={dropdownItemAccent}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>My Transactions</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* Help & Support */}
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Help & Support</p>
              </div>
              <DropdownMenuItem className={dropdownItemAccent}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help Center / FAQ</span>
              </DropdownMenuItem>
              <DropdownMenuItem className={dropdownItemAccent}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Send Feedback</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* Session */}
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session</p>
              </div>
              <DropdownMenuItem className="cursor-pointer text-[#B0112D] focus:text-[#B0112D] focus:bg-[#FDECEF]" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
