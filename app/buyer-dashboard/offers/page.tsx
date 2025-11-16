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
          <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">Incoming Offers</h1>
          <p className="text-gray-600 mt-2">
            Compare seller proposals for your requests and accept the best match.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading offers...</div>
        ) : (
          <BuyerOffersTable offers={offers} />
        )}
      </div>
    </BuyerDashboardLayout>
  )
}
