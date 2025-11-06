"use client"

import { useEffect, useState } from "react"
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { RequestsTable } from "@/components/seller/requests-table"

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await fetch("/api/product-requests/seller")
        if (response.ok) {
          const data = await response.json()
          setRequests(data)
        }
      } catch (error) {
        console.error("Error fetching requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()

    // Listen for offer submission events
    const handleOfferSubmitted = () => {
      fetchRequests()
    }

    window.addEventListener('offerSubmitted', handleOfferSubmitted)
    return () => window.removeEventListener('offerSubmitted', handleOfferSubmitted)
  }, [])

  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gelen Talepler</h1>
          <p className="text-muted-foreground mt-2">
            Alıcılardan gelen ürün taleplerini inceleyin, teklif gönderin veya reddedin.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Yükleniyor...</div>
        ) : (
          <RequestsTable requests={requests} />
        )}
      </div>
    </SellerDashboardLayout>
  )
}
