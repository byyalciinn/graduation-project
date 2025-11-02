import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupportPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yardım/Destek</h1>
          <p className="text-muted-foreground mt-2">
            Sık sorulan sorular ve destek bileti oluşturma.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sık Sorulan Sorular</CardTitle>
              <CardDescription>En çok merak edilen konular</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">SSS içeriği yakında eklenecek...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Destek Talebi Oluştur</CardTitle>
              <CardDescription>Sorununuz için destek bileti açın</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Form içeriği yakında eklenecek...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </BuyerDashboardLayout>
  )
}
