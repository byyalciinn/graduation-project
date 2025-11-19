"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Loader2, TrendingUp, Clock, DollarSign, Award, AlertCircle } from "lucide-react"

interface Offer {
  id: string
  price: number
  deliveryTime: number
  message: string | null
  seller: {
    name: string | null
    email: string
  }
  productRequest: {
    id: string
    productName: string
    quantity: number
    maxBudget: number | null
  }
}

interface AIOfferComparisonProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offers: Offer[]
}

export function AIOfferComparison({ open, onOpenChange, offers }: AIOfferComparisonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (offers.length === 0) return

    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null)

    try {
      // Group offers by product request
      const groupedOffers = offers.reduce((acc: any, offer) => {
        const reqId = offer.productRequest.id
        if (!acc[reqId]) {
          acc[reqId] = {
            productRequest: offer.productRequest,
            offers: []
          }
        }
        acc[reqId].offers.push(offer)
        return acc
      }, {})

      // Analyze first group (or could let user select)
      const firstGroup = Object.values(groupedOffers)[0] as any
      
      const response = await fetch("/api/ai/compare-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offers: firstGroup.offers,
          productRequest: firstGroup.productRequest,
        }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()
      setAnalysis({
        ...data.data,
        offers: firstGroup.offers,
        productRequest: firstGroup.productRequest,
        cached: data.cached
      })
    } catch (error) {
      console.error("Error analyzing offers:", error)
      setError("Analiz başarısız oldu. Lütfen tekrar deneyin.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Auto-analyze when modal opens
  useState(() => {
    if (open && !analysis && offers.length > 0) {
      handleAnalyze()
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            AI Teklif Analizi
          </DialogTitle>
          <DialogDescription>
            Tekliflerinizi karşılaştırıp en iyi seçeneği bulmanıza yardımcı oluyoruz
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4" />
              <p className="text-gray-600">Teklifler analiz ediliyor...</p>
              <p className="text-sm text-gray-500 mt-1">Bu birkaç saniye sürebilir</p>
            </div>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">{error}</AlertDescription>
            </Alert>
          )}

          {analysis && !isAnalyzing && (
            <div className="space-y-6">
              {/* Cache indicator */}
              {analysis.cached && (
                <Badge variant="outline" className="text-xs">
                  ⚡ Önbellekten yüklendi
                </Badge>
              )}

              {/* Top Picks */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  En İyi 3 Teklif
                </h3>
                <div className="grid gap-3">
                  {analysis.topPicks?.slice(0, 3).map((idx: number) => {
                    const offer = analysis.offers[idx]
                    if (!offer) return null
                    
                    const isValue = idx === analysis.bestValue
                    const isFast = idx === analysis.fastestDelivery

                    return (
                      <div
                        key={offer.id}
                        className="border rounded-lg p-4 hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {offer.seller.name || offer.seller.email}
                            </p>
                            <div className="flex gap-2 mt-1">
                              {isValue && (
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  En İyi Fiyat
                                </Badge>
                              )}
                              {isFast && (
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                  <Clock className="h-3 w-3 mr-1" />
                                  En Hızlı Teslimat
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-600">
                              {offer.price.toLocaleString("tr-TR")} ₺
                            </p>
                            <p className="text-sm text-gray-500">
                              {Math.round(offer.price / analysis.productRequest.quantity).toLocaleString("tr-TR")} ₺/adet
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {offer.deliveryTime} gün
                          </span>
                        </div>
                        {offer.message && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {offer.message}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* AI Analysis */}
              <Alert className="border-emerald-200 bg-emerald-50">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <AlertDescription>
                  <p className="font-semibold text-emerald-900 mb-2">AI Analizi</p>
                  <p className="text-sm text-emerald-800 mb-3">{analysis.analysis}</p>
                  <p className="text-sm text-emerald-700">
                    <strong>Öneri:</strong> {analysis.recommendation}
                  </p>
                </AlertDescription>
              </Alert>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{analysis.offers.length}</p>
                  <p className="text-sm text-gray-600">Toplam Teklif</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    {Math.min(...analysis.offers.map((o: any) => o.price)).toLocaleString("tr-TR")} ₺
                  </p>
                  <p className="text-sm text-gray-600">En Düşük Fiyat</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.min(...analysis.offers.map((o: any) => o.deliveryTime))} gün
                  </p>
                  <p className="text-sm text-gray-600">En Hızlı Teslimat</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Kapat
                </Button>
                <Button 
                  onClick={handleAnalyze}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Yeniden Analiz Et
                </Button>
              </div>
            </div>
          )}

          {!analysis && !isAnalyzing && !error && offers.length > 0 && (
            <div className="text-center py-12">
              <Button onClick={handleAnalyze} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Sparkles className="h-5 w-5 mr-2" />
                Analizi Başlat
              </Button>
            </div>
          )}

          {offers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Henüz teklif bulunmuyor.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
