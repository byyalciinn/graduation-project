import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReturnsPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">İade ve İptal</h1>
          <p className="text-muted-foreground mt-2">
            Devam eden iade ve iptal süreçlerinizi yönetin.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>İade/İptal Süreçleri</CardTitle>
            <CardDescription>Aktif iade ve iptal talepleri</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">İçerik yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
