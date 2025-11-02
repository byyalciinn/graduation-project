import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bildirimler</h1>
          <p className="text-muted-foreground mt-2">
            Yeni teklifler, sipariş durumu güncellemeleri ve önemli sistem uyarıları.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tüm Bildirimler</CardTitle>
            <CardDescription>Sistem bildirimleri ve uyarılar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">İçerik yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
