import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StoreSettingsPage() {
  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mağaza Ayarları</h1>
          <p className="text-muted-foreground mt-2">
            Mağaza adı, profil bilgileri, iade/kargo politikaları gibi satıcıya özgü ayarları yönetin.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mağaza Bilgileri ve Politikalar</CardTitle>
            <CardDescription>İçerik yakında eklenecek</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Mağaza ayarları içeriği yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
