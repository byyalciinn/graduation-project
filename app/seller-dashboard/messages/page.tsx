import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MessagesPage() {
  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mesajlar/Gelen Kutusu</h1>
          <p className="text-muted-foreground mt-2">
            Potansiyel alıcılar ve destek ekibi ile tüm iletişimlerinizi yönetin.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mesajlar</CardTitle>
            <CardDescription>İçerik yakında eklenecek</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Mesajlaşma içeriği yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
