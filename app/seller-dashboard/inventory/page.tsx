import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function InventoryPage() {
  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Envanter Takibi</h1>
          <p className="text-muted-foreground mt-2">
            Ürünlerin stok durumunu toplu olarak takip etme ve hızlıca güncelleme.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stok Yönetimi</CardTitle>
            <CardDescription>İçerik yakında eklenecek</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Envanter takip içeriği yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
