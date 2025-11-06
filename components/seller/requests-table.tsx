"use client"

import React, { useState, useMemo } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Eye,
  Package,
  MapPin,
  DollarSign,
  Calendar,
  Hash,
  Tag,
  Image as ImageIcon,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

interface ProductRequest {
  id: string
  productName: string
  category: string
  description: string
  quantity: number
  maxBudget: number | null
  deliveryCity: string
  deliveryDistrict: string
  offerDeadline: Date | null
  exampleImageUrl: string | null
  brandModel: string | null
  dynamicFields: any
  status: string
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  hasOffer?: boolean
  myOffer?: {
    id: string
    status: string
    price: number
    createdAt: Date
  } | null
}

interface RequestsTableProps {
  requests: ProductRequest[]
}

export function RequestsTable({ requests }: RequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [offerModalOpen, setOfferModalOpen] = useState(false)
  const [offerRequest, setOfferRequest] = useState<ProductRequest | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [offerForm, setOfferForm] = useState({
    price: "",
    deliveryTime: "",
    message: "",
  })

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      "elektronik": "Elektronik",
      "giyim": "Giyim",
      "ev-yasam": "Ev & Yaşam",
      "spor-outdoor": "Spor & Outdoor",
      "kitap-muzik-film": "Kitap, Müzik & Film",
      "otomotiv": "Otomotiv",
      "anne-bebek": "Anne & Bebek",
      "kozmetik": "Kozmetik & Kişisel Bakım",
      "diger": "Diğer",
    }
    return categories[category] || category
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: "Aktif", variant: "default" },
      completed: { label: "Tamamlandı", variant: "secondary" },
      cancelled: { label: "İptal Edildi", variant: "destructive" },
    }
    const config = statusConfig[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTimeRemaining = (deadline: Date | null) => {
    if (!deadline) return "Belirtilmemiş"
    
    const now = new Date()
    const deadlineDate = new Date(deadline)
    
    if (deadlineDate < now) {
      return "Süresi doldu"
    }
    
    return formatDistanceToNow(deadlineDate, { locale: tr, addSuffix: true })
  }

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  // Filter requests based on search query
  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests
    
    const query = searchQuery.toLowerCase()
    return requests.filter(
      (request) =>
        request.productName.toLowerCase().includes(query) ||
        request.description.toLowerCase().includes(query)
    )
  }, [requests, searchQuery])

  const handleOpenOfferModal = (request: ProductRequest) => {
    setOfferRequest(request)
    setOfferModalOpen(true)
    setOfferForm({ price: "", deliveryTime: "", message: "" })
  }

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!offerRequest) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productRequestId: offerRequest.id,
          price: parseFloat(offerForm.price),
          deliveryTime: parseInt(offerForm.deliveryTime),
          message: offerForm.message || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Teklif gönderilemedi")
      }

      // Başarılı
      alert("Teklifiniz başarıyla gönderildi!")
      setOfferModalOpen(false)
      setOfferForm({ price: "", deliveryTime: "", message: "" })
      
      // Emit custom event to refresh data
      window.dispatchEvent(new Event('offerSubmitted'))
    } catch (error) {
      console.error("Error submitting offer:", error)
      alert(error instanceof Error ? error.message : "Bir hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gelen Talepler</CardTitle>
        <CardDescription>
          Alıcılardan gelen ürün taleplerini görüntüleyin ve teklif gönderin
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Henüz talep yok</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Alıcılar talep oluşturduğunda burada görünecektir.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ürün adı veya açıklamasına göre ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün Adı</TableHead>
                    <TableHead>Teslimat Konumu</TableHead>
                    <TableHead>Kalan Süre</TableHead>
                    <TableHead className="hidden md:table-cell">Kategori</TableHead>
                    <TableHead className="hidden lg:table-cell">Miktar</TableHead>
                    <TableHead className="hidden lg:table-cell">Bütçe</TableHead>
                    <TableHead className="hidden xl:table-cell">Durum</TableHead>
                    <TableHead className="text-right">Eylem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Arama kriterlerine uygun talep bulunamadı.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => {
                      const isExpanded = expandedRows.has(request.id)
                      return (
                        <React.Fragment key={request.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <TableRow className="cursor-pointer hover:bg-muted/50">
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <span className="md:hidden">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => toggleRowExpansion(request.id)}
                                      >
                                        {isExpanded ? (
                                          <ChevronUp className="h-4 w-4" />
                                        ) : (
                                          <ChevronDown className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </span>
                                    {request.productName}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm">
                                      {request.deliveryCity} / {request.deliveryDistrict}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm">
                                      {getTimeRemaining(request.offerDeadline)}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <Badge variant="outline">
                                    {getCategoryLabel(request.category)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {request.quantity} adet
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {request.maxBudget ? (
                                    <span className="text-green-600 font-medium">
                                      ₺{request.maxBudget.toLocaleString("tr-TR")}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="hidden xl:table-cell">
                                  {getStatusBadge(request.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {request.hasOffer ? (
                                      <Badge variant="secondary" className="cursor-default">
                                        Teklif Verildi
                                      </Badge>
                                    ) : (
                                      <Badge 
                                        variant="default" 
                                        className="cursor-pointer hover:bg-primary/90"
                                        onClick={() => handleOpenOfferModal(request)}
                                      >
                                        Teklif Ver
                                      </Badge>
                                    )}
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => setSelectedRequest(request)}
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                    </Dialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-md">
                              <div className="space-y-2">
                                <p className="font-semibold">Açıklama:</p>
                                <p className="text-xs">
                                  {request.description.length > 150
                                    ? `${request.description.slice(0, 150)}...`
                                    : request.description}
                                </p>
                                {request.maxBudget && (
                                  <p className="text-xs font-medium text-green-400">
                                    Bütçe: ₺{request.maxBudget.toLocaleString("tr-TR")}
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                          
                          {/* Collapsible Mobile Details */}
                          {isExpanded && (
                            <TableRow className="md:hidden">
                              <TableCell colSpan={8} className="bg-muted/30">
                                <div className="space-y-3 py-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Kategori:</span>
                                    <Badge variant="outline">
                                      {getCategoryLabel(request.category)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Miktar:</span>
                                    <span className="text-sm font-medium">{request.quantity} adet</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Bütçe:</span>
                                    {request.maxBudget ? (
                                      <span className="text-sm font-medium text-green-600">
                                        ₺{request.maxBudget.toLocaleString("tr-TR")}
                                      </span>
                                    ) : (
                                      <span className="text-sm text-muted-foreground">-</span>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Durum:</span>
                                    {getStatusBadge(request.status)}
                                  </div>
                                  <Separator />
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Açıklama:</p>
                                    <p className="text-sm">{request.description}</p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Offer Modal */}
        <Dialog open={offerModalOpen} onOpenChange={setOfferModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Teklif Gönder</DialogTitle>
              <DialogDescription>
                {offerRequest?.productName} için teklifinizi gönderin
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitOffer} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat Teklifiniz (₺) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Örn: 1500"
                  value={offerForm.price}
                  onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })}
                  required
                />
                {offerRequest?.maxBudget && (
                  <p className="text-sm text-muted-foreground">
                    Alıcının maksimum bütçesi: ₺{offerRequest.maxBudget.toLocaleString("tr-TR")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryTime">Teslimat Süresi (Gün) *</Label>
                <Input
                  id="deliveryTime"
                  type="number"
                  min="1"
                  placeholder="Örn: 7"
                  value={offerForm.deliveryTime}
                  onChange={(e) => setOfferForm({ ...offerForm, deliveryTime: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mesajınız (Opsiyonel)</Label>
                <Textarea
                  id="message"
                  placeholder="Teklifiniz hakkında ek bilgi verebilirsiniz..."
                  rows={4}
                  value={offerForm.message}
                  onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })}
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOfferModalOpen(false)}
                  disabled={isSubmitting}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Gönderiliyor..." : "Teklif Gönder"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog - Outside the table */}
        {selectedRequest && (
          <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Talep Detayları</DialogTitle>
                <DialogDescription>
                  {selectedRequest.productName} - Talep No: {selectedRequest.id.slice(0, 8)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Temel Bilgiler */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Temel Bilgiler
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ürün Adı</p>
                      <p className="font-medium">{selectedRequest.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kategori</p>
                      <Badge variant="outline">
                        <Tag className="h-3 w-3 mr-1" />
                        {getCategoryLabel(selectedRequest.category)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">İstenen Miktar</p>
                      <p className="font-medium flex items-center gap-1">
                        <Hash className="h-4 w-4" />
                        {selectedRequest.quantity} adet
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Durum</p>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>

                  {selectedRequest.dynamicFields?.warrantyStatus && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Garanti Durumu</p>
                      <Badge variant="secondary" className="mt-1">
                        {selectedRequest.dynamicFields.warrantyStatus}
                      </Badge>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Açıklama</p>
                    <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                      {selectedRequest.description}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Konum ve Bütçe */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Konum ve Bütçe
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Teslimat Konumu</p>
                      <p className="font-medium">
                        {selectedRequest.deliveryCity} / {selectedRequest.deliveryDistrict}
                      </p>
                    </div>
                    {selectedRequest.maxBudget && (
                      <div>
                        <p className="text-sm text-muted-foreground">Maksimum Bütçe</p>
                        <p className="font-medium text-green-600 flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {selectedRequest.maxBudget.toLocaleString("tr-TR")} ₺
                        </p>
                      </div>
                    )}
                    {selectedRequest.offerDeadline && (
                      <div>
                        <p className="text-sm text-muted-foreground">Son Teklif Tarihi</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(selectedRequest.offerDeadline), "PPP", {
                            locale: tr,
                          })}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Oluşturulma Tarihi</p>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(selectedRequest.createdAt), "PPP", {
                          locale: tr,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ek Bilgiler */}
                {(selectedRequest.exampleImageUrl || selectedRequest.brandModel) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Ek Bilgiler
                      </h3>
                      <div className="space-y-4">
                        {selectedRequest.exampleImageUrl && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Örnek Resim URL
                            </p>
                            <a
                              href={selectedRequest.exampleImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline break-all"
                            >
                              {selectedRequest.exampleImageUrl}
                            </a>
                          </div>
                        )}
                        {selectedRequest.brandModel && (
                          <div>
                            <p className="text-sm text-muted-foreground">Marka / Model</p>
                            <p className="font-medium">{selectedRequest.brandModel}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Alıcı Bilgileri */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Alıcı Bilgileri</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="text-muted-foreground">İsim:</span>{" "}
                      <span className="font-medium">
                        {selectedRequest.user.name || "Belirtilmemiş"}
                      </span>
                    </p>
                    <p className="text-sm mt-2">
                      <span className="text-muted-foreground">E-posta:</span>{" "}
                      <span className="font-medium">{selectedRequest.user.email}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline">İletişime Geç</Button>
                  <Button>Teklif Gönder</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
