import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentsPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ödeme Geçmişi</h1>
          <p className="text-muted-foreground mt-2">
            Tüm satın alma ve iade/iptal ödeme işlemlerinizin dökümü.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>İşlem Geçmişi</CardTitle>
            <CardDescription>Ödeme ve iade işlemleri</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">İçerik yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
