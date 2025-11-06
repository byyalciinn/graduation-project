import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Raporlar ve Analiz</h1>
          <p className="text-muted-foreground mt-2">
            Satış performansı, envanter performansı, aylık/yıllık kazanç dökümleri gibi iş analitik raporları.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analitik Raporlar</CardTitle>
            <CardDescription>İçerik yakında eklenecek</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Raporlama ve analiz içeriği yakında eklenecek...</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
