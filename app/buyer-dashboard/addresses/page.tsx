import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddressesPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adreslerim</h1>
          <p className="text-muted-foreground mt-2">
            Teslimat adreslerinizi ekleyin, düzenleyin veya silin.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kayıtlı Adresler</CardTitle>
            <CardDescription>Teslimat adresi yönetimi</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">İçerik yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
