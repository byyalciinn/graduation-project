import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrdersPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Siparişlerim</h1>
          <p className="text-muted-foreground mt-2">
            Tüm siparişlerinizi takip edin (Bekleyen, Gönderilen, Teslim Edilen, İade Edilen).
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sipariş Listesi</CardTitle>
            <CardDescription>Sipariş durumları ve detayları</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">İçerik yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
