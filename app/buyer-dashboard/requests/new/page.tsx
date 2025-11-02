import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewRequestPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yeni Talep Oluştur</h1>
          <p className="text-muted-foreground mt-2">
            Aradığınız ürün için satıcılara talep gönderin.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Talep Formu</CardTitle>
            <CardDescription>Ürün detaylarını girerek talep oluşturun</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Form içeriği yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
