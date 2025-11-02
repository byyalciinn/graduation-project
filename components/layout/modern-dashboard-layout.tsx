"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { ModernHeader } from "./modern-header"

interface ModernDashboardLayoutProps {
  children: React.ReactNode
}

export function ModernDashboardLayout({ children }: ModernDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ModernHeader />
        <div className="flex flex-1 flex-col gap-4 p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
