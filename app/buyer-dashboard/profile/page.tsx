import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Bilgileri</h1>
          <p className="text-muted-foreground mt-2">
            Kişisel bilgilerinizi görüntüleyin ve güncelleyin.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hesap Bilgileri</CardTitle>
            <CardDescription>İsim, e-posta, şifre ve diğer kişisel bilgiler</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Form içeriği yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
