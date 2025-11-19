"use client"

import { useEffect, useMemo, useState } from "react"
import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { BuyerOffersTable } from "@/components/buyer/offers-table"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function OffersPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<any>(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOffers() {
      try {
        const response = await fetch("/api/offers/buyer")
        if (response.ok) {
          const data = await response.json()
          setOffers(data)
        }
      } catch (error) {
        console.error("Error fetching offers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  const handleAiSuggest = async () => {
    if (offers.length === 0) return

    setAnalysisLoading(true)
    setAnalysisError(null)
    setAnalysis(null)

    try {
      const grouped = offers.reduce((acc: any, offer: any) => {
        const reqId = offer.productRequest.id
        if (!acc[reqId]) {
          acc[reqId] = {
            productRequest: offer.productRequest,
            offers: [],
          }
        }
        acc[reqId].offers.push(offer)
        return acc
      }, {})

      const firstGroup = Object.values(grouped)[0] as any
      if (!firstGroup) {
        throw new Error("Analiz için teklif bulunamadı")
      }

      const response = await fetch("/api/ai/compare-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offers: firstGroup.offers,
          productRequest: firstGroup.productRequest,
        }),
      })

      if (!response.ok) {
        throw new Error("Analiz başarısız oldu")
      }

      const data = await response.json()
      setAnalysis({
        ...data.data,
        offers: firstGroup.offers,
        productRequest: firstGroup.productRequest,
        cached: data.cached,
      })
    } catch (error) {
      console.error("AI Suggest error:", error)
      setAnalysisError(
        error instanceof Error ? error.message : "Analiz başarısız oldu. Lütfen tekrar deneyin."
      )
    } finally {
      setAnalysisLoading(false)
    }
  }

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAiSuggest}
                  disabled={offers.length === 0 || analysisLoading}
                  variant="outline"
                  className="absolute right-0 top-0 border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600"
                >
                  {analysisLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  AI Suggest
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-900 text-white max-w-xs">
                <p className="text-sm">
                  AI ile teklifleri analiz edin ve en iyi seçeneği bulun. Fiyat, teslimat süresi ve kalite karşılaştırması yapar.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">Incoming Offers</h1>
          <p className="text-gray-600 mt-2">
            Compare seller proposals for your requests and accept the best match.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading offers...</div>
        ) : (
          <BuyerOffersTable 
            offers={offers} 
            aiAnalysis={analysis}
            aiAnalysisError={analysisError}
            aiAnalysisLoading={analysisLoading}
          />
        )}
      </div>
    </BuyerDashboardLayout>
  )
}
