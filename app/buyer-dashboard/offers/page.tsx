import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OffersPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tekliflerim</h1>
          <p className="text-muted-foreground mt-2">
            Taleplerinize gelen satıcı tekliflerini karşılaştırın ve kabul edin.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gelen Teklifler</CardTitle>
            <CardDescription>Satıcılardan gelen fiyat teklifleri</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">İçerik yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
