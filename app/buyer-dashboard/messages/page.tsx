import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MessagesPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mesajlar/Gelen Kutusu</h1>
          <p className="text-muted-foreground mt-2">
            Satıcılar ve destek ekibi ile tüm iletişimlerinizi yönetin.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mesajlar</CardTitle>
            <CardDescription>Gelen ve giden mesajlarınız</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">İçerik yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
