import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function EarningsPage() {
  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kazançlar/Ödemeler</h1>
          <p className="text-muted-foreground mt-2">
            Toplam satış kazancı, komisyon kesintileri ve net bakiye.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Finansal Özet</CardTitle>
            <CardDescription>İçerik yakında eklenecek</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Kazanç ve ödeme içeriği yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
