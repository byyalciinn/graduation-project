import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PayoutsPage() {
  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ödeme Emirleri</h1>
          <p className="text-muted-foreground mt-2">
            Bakiyenizi banka hesabınıza çekmek için ödeme/para çekme taleplerini yönetin.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ödeme Talepleri</CardTitle>
            <CardDescription>İçerik yakında eklenecek</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Ödeme emri içeriği yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
