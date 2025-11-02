import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, FileText, Tag, Package } from "lucide-react"

export default function BuyerDashboardPage() {
  const stats = [
    {
      title: "Aktif Talepler",
      value: "12",
      description: "Bekleyen talep sayısı",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Gelen Teklifler",
      value: "5",
      description: "Yeni teklifler",
      icon: Tag,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Aktif Siparişler",
      value: "8",
      description: "Devam eden siparişler",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Kaydedilen Ürünler",
      value: "24",
      description: "Favorilerdeki ürünler",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hoş Geldiniz</h1>
          <p className="text-muted-foreground mt-2">
            Alıcı panelinize genel bakış. Son aktiviteleriniz ve önemli bilgiler burada.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
              <CardDescription>Platformdaki son hareketleriniz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { text: "Yeni teklif aldınız", time: "5 dakika önce" },
                  { text: "Siparişiniz kargoya verildi", time: "2 saat önce" },
                  { text: "Yeni talep oluşturdunuz", time: "1 gün önce" },
                  { text: "Ödeme işlemi tamamlandı", time: "2 gün önce" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
              <CardDescription>Sık kullanılan işlemler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <p className="text-sm font-medium">Yeni Talep Oluştur</p>
                  <p className="text-xs opacity-90">Aradığınız ürünü talep edin</p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <p className="text-sm font-medium">Teklifleri Görüntüle</p>
                  <p className="text-xs text-muted-foreground">Gelen teklifleri inceleyin</p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <p className="text-sm font-medium">Siparişleri Takip Et</p>
                  <p className="text-xs text-muted-foreground">Sipariş durumlarını kontrol edin</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending offers notification */}
        <Card className="border-border bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Bekleyen Teklifler</CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              5 adet yeni teklif bekliyor. İncelemek için teklifler sayfasına gidin.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
