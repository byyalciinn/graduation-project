"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SellerSidebar } from "./seller-sidebar"
import { ModernHeader } from "./modern-header"

interface SellerDashboardLayoutProps {
  children: React.ReactNode
}

export function SellerDashboardLayout({ children }: SellerDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <SellerSidebar />
      <SidebarInset>
        <ModernHeader />
        <div className="flex flex-1 flex-col gap-4 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
