import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductsPage() {
  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ürünlerim/İlanlarım</h1>
          <p className="text-muted-foreground mt-2">
            Aktif, pasif, taslak ve reddedilmiş tüm ürün ilanlarınızın listesi. Ürünleri düzenleme, yayından kaldırma ve yeniden listeleme.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ürün Listesi</CardTitle>
            <CardDescription>İçerik yakında eklenecek</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Ürün yönetimi içeriği yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
