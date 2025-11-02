import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Package, TrendingUp, DollarSign } from "lucide-react"

export default function SellerDashboardPage() {
  const stats = [
    {
      title: "Toplam Sipariş",
      value: "156",
      description: "Bu ayki siparişler",
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Aktif Ürünler",
      value: "42",
      description: "Satışta olan ürünler",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Gelir",
      value: "₺45,231",
      description: "Bu ayki toplam gelir",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Büyüme",
      value: "+23%",
      description: "Geçen aya göre",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Satıcı Paneli</h1>
          <p className="text-muted-foreground mt-2">
            Mağazanıza genel bakış. Satış performansınız ve önemli bilgiler burada.
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
              <CardDescription>Mağazanızdaki son hareketler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { text: "Yeni sipariş alındı", time: "10 dakika önce" },
                  { text: "Ürün stoğu güncellendi", time: "1 saat önce" },
                  { text: "Yeni talep bildirimi", time: "3 saat önce" },
                  { text: "Ödeme onaylandı", time: "5 saat önce" },
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
                  <p className="text-sm font-medium">Yeni Ürün Ekle</p>
                  <p className="text-xs opacity-90">Mağazaya ürün ekleyin</p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <p className="text-sm font-medium">Siparişleri Görüntüle</p>
                  <p className="text-xs text-muted-foreground">Bekleyen siparişleri inceleyin</p>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <p className="text-sm font-medium">Raporları İncele</p>
                  <p className="text-xs text-muted-foreground">Satış raporlarını görüntüleyin</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending requests notification */}
        <Card className="border-border bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">Yeni Talepler</CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              3 adet yeni alıcı talebi var. Teklif vermek için talepler sayfasına gidin.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
