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
          <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">My Offers</h1>
          <p className="text-gray-600 mt-2">
            Track every offer you've submitted, see their latest status, and follow up with buyers in one place.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading offers...</div>
        ) : (
          <OffersTable offers={offers} />
        )}
      </div>
    </SellerDashboardLayout>
  )
}
