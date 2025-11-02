import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RequestsPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">İsteklerim/Taleplerim</h1>
          <p className="text-muted-foreground mt-2">
            Oluşturduğunuz tüm ürün taleplerini buradan görüntüleyebilir ve yönetebilirsiniz.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Talep Listesi</CardTitle>
            <CardDescription>Aktif, tamamlanmış ve iptal edilmiş talepleriniz</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">İçerik yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
