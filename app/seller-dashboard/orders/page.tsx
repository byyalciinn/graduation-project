import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrdersPage() {
  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Siparişler</h1>
          <p className="text-muted-foreground mt-2">
            Alıcılar tarafından kabul edilmiş ve ödemesi yapılmış tüm satış siparişlerini yönetin (Yeni, Hazırlanıyor, Kargoya Verildi, Tamamlandı).
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sipariş Listesi</CardTitle>
            <CardDescription>İçerik yakında eklenecek</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Sipariş yönetimi içeriği yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
