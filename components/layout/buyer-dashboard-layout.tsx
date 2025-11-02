"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BuyerSidebar } from "./buyer-sidebar"
import { ModernHeader } from "./modern-header"

interface BuyerDashboardLayoutProps {
  children: React.ReactNode
}

export function BuyerDashboardLayout({ children }: BuyerDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <BuyerSidebar />
      <SidebarInset>
        <ModernHeader />
        <div className="flex flex-1 flex-col gap-4 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
