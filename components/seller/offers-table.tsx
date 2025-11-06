"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Package, MapPin, Clock, DollarSign } from "lucide-react"

interface Offer {
  id: string
  price: number
  deliveryTime: number
  message: string | null
  status: string
  createdAt: Date
  respondedAt: Date | null
  buyerResponse: string | null
  productRequest: {
    id: string
    productName: string
    category: string
    quantity: number
    maxBudget: number | null
    deliveryCity: string
    deliveryDistrict: string
    user: {
      name: string | null
      email: string
    }
  }
}

interface OffersTableProps {
  offers: Offer[]
}

export function OffersTable({ offers }: OffersTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      pending: { label: "Beklemede", variant: "default" },
      accepted: { label: "Kabul Edildi", variant: "secondary" },
      rejected: { label: "Reddedildi", variant: "destructive" },
      withdrawn: { label: "Geri Çekildi", variant: "outline" },
    }
    const config = statusConfig[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gönderdiğim Teklifler</CardTitle>
        <CardDescription>
          Alıcı taleplerine gönderdiğiniz tekliflerin durumunu takip edin
        </CardDescription>
      </CardHeader>
      <CardContent>
        {offers.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Henüz teklif yok</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Taleplere teklif gönderdiğinizde burada görünecektir.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ürün</TableHead>
                  <TableHead>Alıcı</TableHead>
                  <TableHead>Teklifim</TableHead>
                  <TableHead>Teslimat</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{offer.productRequest.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {offer.productRequest.quantity} adet
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {offer.productRequest.user.name || "İsimsiz"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {offer.productRequest.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">
                          ₺{offer.price.toLocaleString("tr-TR")}
                        </span>
                      </div>
                      {offer.productRequest.maxBudget && (
                        <p className="text-xs text-muted-foreground">
                          Bütçe: ₺{offer.productRequest.maxBudget.toLocaleString("tr-TR")}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{offer.deliveryTime} gün</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {offer.productRequest.deliveryCity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(offer.status)}
                      {offer.buyerResponse && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {offer.buyerResponse}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {format(new Date(offer.createdAt), "dd MMM yyyy", {
                            locale: tr,
                          })}
                        </p>
                        {offer.respondedAt && (
                          <p className="text-xs text-muted-foreground">
                            Yanıt: {format(new Date(offer.respondedAt), "dd MMM", { locale: tr })}
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
