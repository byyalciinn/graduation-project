"use client"

import { useEffect, useState } from "react"
import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

interface ProductRequest {
  id: string
  productName: string
  category: string
  description: string
  quantity: number
  maxBudget: number | null
  deliveryCity: string
  deliveryDistrict: string
  offerDeadline: string | null
  status: string
  createdAt: string
}

const statusStyles: Record<string, string> = {
  active: "bg-[#770022]/10 text-[#770022]",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<ProductRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/product-requests")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Unable to fetch requests")
        }

        setRequests(data.data || [])
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "Unexpected error")
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const renderEmptyState = () => (
    <Card className="border-dashed border-2 border-gray-200">
      <CardContent className="py-12 text-center space-y-4">
        <p className="text-gray-600">You haven't created any product requests yet.</p>
        <Button
          onClick={() => window.location.assign("/buyer-dashboard/requests/new")}
          className="bg-[#770022] hover:bg-[#5a0019] text-white"
        >
          Create your first request
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">My Requests</h1>
          <p className="text-gray-600">
            Track every product request you've created and monitor their status in one place.
          </p>
        </div>

        {error && (
          <Card className="border-rose-200 bg-rose-50">
            <CardContent className="py-4 text-rose-700 font-medium">
              {error}
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">Loading your requests...</CardContent>
          </Card>
        ) : requests.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-gray-100">
                  <div>
                    <CardTitle className="text-xl text-[#1F1B24]">{request.productName}</CardTitle>
                    <CardDescription>
                      {request.category} · Created {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <Badge className={statusStyles[request.status] || "bg-gray-100 text-gray-700"}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <p className="text-sm text-gray-600 whitespace-pre-line">{request.description}</p>

                  <div className="grid gap-4 md:grid-cols-3 text-sm">
                    <div>
                      <p className="text-gray-500">Quantity</p>
                      <p className="font-semibold text-[#1F1B24]">{request.quantity} pcs</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Budget</p>
                      <p className="font-semibold text-[#1F1B24]">
                        {request.maxBudget ? `${request.maxBudget.toLocaleString("en-US")} ₺` : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivery</p>
                      <p className="font-semibold text-[#1F1B24]">
                        {request.deliveryCity} / {request.deliveryDistrict}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="px-3 py-1 rounded-full bg-[#770022]/5 text-[#770022] font-medium">
                      Offer deadline: {request.offerDeadline ? new Date(request.offerDeadline).toLocaleDateString() : "Flexible"}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                      Request ID: {request.id.slice(0, 8)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BuyerDashboardLayout>
  )
}
