import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShippingPage() {
  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kargo Yönetimi</h1>
          <p className="text-muted-foreground mt-2">
            Kargo etiketi oluşturma, takip numarası girme ve gönderi takibi.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kargo İşlemleri</CardTitle>
            <CardDescription>İçerik yakında eklenecek</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Kargo yönetimi içeriği yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
