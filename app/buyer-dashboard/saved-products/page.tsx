import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SavedProductsPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kaydedilen Ürünler</h1>
          <p className="text-muted-foreground mt-2">
            Beğendiğiniz ve daha sonra satın almak için kaydettiğiniz ürünler.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Favorilerim</CardTitle>
            <CardDescription>Kayıtlı ürün listeniz</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">İçerik yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
