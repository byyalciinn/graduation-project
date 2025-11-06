"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Package, MapPin, Clock } from "lucide-react"

interface Offer {
  id: string
  price: number
  deliveryTime: number
  message: string | null
  status: string
  createdAt: Date
  respondedAt: Date | null
  buyerResponse: string | null
  seller: {
    id: string
    name: string | null
    email: string
  }
  productRequest: {
    id: string
    productName: string
    category: string
    quantity: number
    maxBudget: number | null
    deliveryCity: string
    deliveryDistrict: string
  }
}

interface OffersTableProps {
  offers: Offer[]
}

export function BuyerOffersTable({ offers }: OffersTableProps) {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [responseModalOpen, setResponseModalOpen] = useState(false)
  const [responseType, setResponseType] = useState<"accepted" | "rejected">("accepted")
  const [buyerResponse, setBuyerResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getStatusBadge = (status: string) => {
    if (status === "pending") {
      return (
        <Badge className="border border-yellow-300 bg-yellow-100 text-yellow-800">
          Beklemede
        </Badge>
      )
    }

    const statusConfig: Record<string, { label: string; className: string }> = {
      accepted: {
        label: "Kabul Edildi",
        className: "border border-green-200 bg-green-50 text-green-700",
      },
      rejected: {
        label: "Reddedildi",
        className: "border border-red-200 bg-red-50 text-red-700",
      },
      withdrawn: {
        label: "Geri Çekildi",
        className: "border border-muted-200 bg-muted text-muted-foreground",
      },
    }

    const config = statusConfig[status]

    if (config) {
      return <Badge className={config.className}>{config.label}</Badge>
    }

    return <Badge variant="outline">{status}</Badge>
  }

  const handleOpenResponseModal = (offer: Offer, type: "accepted" | "rejected") => {
    setSelectedOffer(offer)
    setResponseType(type)
    setResponseModalOpen(true)
    setBuyerResponse("")
  }

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedOffer) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/offers/${selectedOffer.id}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: responseType,
          buyerResponse: buyerResponse || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Yanıt gönderilemedi")
      }

      alert(`Teklif ${responseType === "accepted" ? "kabul edildi" : "reddedildi"}!`)
      setResponseModalOpen(false)
      setBuyerResponse("")
      
      // Sayfayı yenile
      window.location.reload()
    } catch (error) {
      console.error("Error responding to offer:", error)
      alert(error instanceof Error ? error.message : "Bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gelen Teklifler</CardTitle>
          <CardDescription>
            Taleplerinize gelen satıcı tekliflerini inceleyin ve yanıtlayın
          </CardDescription>
        </CardHeader>
        <CardContent>
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Henüz teklif yok</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Taleplerinize satıcılar teklif gönderdiğinde burada görünecektir.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Talebim</TableHead>
                    <TableHead>Satıcı</TableHead>
                    <TableHead>Teklif</TableHead>
                    <TableHead>Teslimat</TableHead>
                    <TableHead>Mesaj</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
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
                            {offer.seller.name || "İsimsiz"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {offer.seller.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          ₺{offer.price.toLocaleString("tr-TR")}
                        </span>
                        {offer.productRequest.maxBudget && (
                          <p className="text-xs text-muted-foreground">
                            Bütçem: ₺{offer.productRequest.maxBudget.toLocaleString("tr-TR")}
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
                        {offer.message ? (
                          <p className="text-sm max-w-xs truncate">{offer.message}</p>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
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
                      <TableCell className="text-right">
                        {offer.status === "pending" && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                              onClick={() => handleOpenResponseModal(offer, "accepted")}
                            >
                              Kabul Et
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleOpenResponseModal(offer, "rejected")}
                            >
                              Reddet
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Modal */}
      <Dialog open={responseModalOpen} onOpenChange={setResponseModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Teklifi {responseType === "accepted" ? "Kabul Et" : "Reddet"}
            </DialogTitle>
            <DialogDescription>
              {selectedOffer?.seller.name || "Satıcı"} tarafından gönderilen teklifi{" "}
              {responseType === "accepted" ? "kabul ediyorsunuz" : "reddediyorsunuz"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitResponse} className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ürün:</span>
                <span className="font-medium">{selectedOffer?.productRequest.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Teklif:</span>
                <span className="font-medium text-green-600">
                  ₺{selectedOffer?.price.toLocaleString("tr-TR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Teslimat:</span>
                <span className="font-medium">{selectedOffer?.deliveryTime} gün</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerResponse">
                Mesajınız (Opsiyonel)
              </Label>
              <Textarea
                id="buyerResponse"
                placeholder={
                  responseType === "accepted"
                    ? "Teşekkürler, teklifinizi kabul ediyorum..."
                    : "Maalesef teklifinizi kabul edemiyorum..."
                }
                rows={4}
                value={buyerResponse}
                onChange={(e) => setBuyerResponse(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResponseModalOpen(false)}
                disabled={isSubmitting}
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant={responseType === "accepted" ? "default" : "destructive"}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Gönderiliyor..."
                  : responseType === "accepted"
                  ? "Kabul Et"
                  : "Reddet"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
