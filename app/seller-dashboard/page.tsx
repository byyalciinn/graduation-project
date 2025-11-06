import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SellerDashboardPage() {
  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview: Total earnings, new incoming offers, pending orders, best-selling products, and performance charts.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard Content</CardTitle>
            <CardDescription>Content will be added soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page will include total earnings, new incoming offers, pending orders, best-selling products, and performance charts.
            </p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
