"use client"

import { useEffect, useState } from "react"
import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { BuyerOffersTable } from "@/components/buyer/offers-table"

export default function OffersPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gelen Teklifler</h1>
          <p className="text-muted-foreground mt-2">
            Taleplerinize gelen satıcı tekliflerini karşılaştırın ve kabul edin.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Yükleniyor...</div>
        ) : (
          <BuyerOffersTable offers={offers} />
        )}
      </div>
    </BuyerDashboardLayout>
  )
}
