import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SecurityPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Güvenlik</h1>
          <p className="text-muted-foreground mt-2">
            Hesap güvenliğinizi yönetin ve iki faktörlü kimlik doğrulamayı ayarlayın.
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Şifre Değiştir</CardTitle>
              <CardDescription>Hesap şifrenizi güncelleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Form içeriği yakında eklenecek...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>İki Faktörlü Kimlik Doğrulama</CardTitle>
              <CardDescription>Hesabınıza ekstra güvenlik katmanı ekleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Ayarlar yakında eklenecek...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </BuyerDashboardLayout>
  )
}
