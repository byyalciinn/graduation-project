"use client"

import { useEffect, useState } from "react"
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { OffersTable } from "@/components/seller/offers-table"

export default function OffersPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOffers() {
      try {
        const response = await fetch("/api/offers")
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
    <SellerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tekliflerim</h1>
          <p className="text-muted-foreground mt-2">
            Daha önce gönderdiğiniz aktif veya süresi dolmuş tekliflerin takibi.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Yükleniyor...</div>
        ) : (
          <OffersTable offers={offers} />
        )}
      </div>
    </SellerDashboardLayout>
  )
}
