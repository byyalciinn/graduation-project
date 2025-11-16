"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

interface Payment {
  id: string
  amount: number
  status: string
  paymentMethod: string | null
  paidAt: Date | null
  createdAt: Date
  offer: {
    id: string
    deliveryTime: number
    productRequest: {
      productName: string
      quantity: number
      deliveryCity: string
      deliveryDistrict: string
    }
    seller: {
      name: string
      email: string
    }
  }
}

export default function PaymentsPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await fetch("/api/payments")
        if (!response.ok) throw new Error("Failed to fetch payments")
        const data = await response.json()
        setPayments(data)
      } catch (error) {
        console.error("Error fetching payments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      pending: {
        label: "Pending Payment",
        className: "bg-amber-100 text-amber-700 border border-amber-200",
        icon: AlertCircle,
      },
      completed: {
        label: "Paid",
        className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        icon: CheckCircle2,
      },
      failed: {
        label: "Failed",
        className: "bg-rose-100 text-rose-700 border border-rose-200",
        icon: XCircle,
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-gray-100 text-gray-600 border border-gray-200",
        icon: XCircle,
      },
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const pendingPayments = payments.filter(p => p.status === "pending")
  const completedPayments = payments.filter(p => p.status !== "pending")

  if (loading) {
    return (
      <BuyerDashboardLayout>
        <div className="text-center py-12 text-gray-500">Loading payments...</div>
      </BuyerDashboardLayout>
    )
  }

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">Payment History</h1>
          <p className="text-gray-600 mt-2">
            Manage your pending payments and view transaction history.
          </p>
        </div>

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <Card className="border-amber-200 shadow-sm">
            <CardHeader className="border-b border-amber-100 bg-amber-50/60">
              <CardTitle className="text-xl font-semibold text-[#1F1B24] flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Pending Payments ({pendingPayments.length})
              </CardTitle>
              <CardDescription className="text-gray-600">
                Complete these payments to finalize your orders.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <Card key={payment.id} className="border-gray-200 shadow-sm hover:shadow-md transition">
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg text-[#1F1B24] flex items-center gap-2">
                                <Package className="h-5 w-5 text-[#770022]" />
                                {payment.offer.productRequest.productName}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Quantity: {payment.offer.productRequest.quantity} pcs
                              </p>
                            </div>
                            {getStatusBadge(payment.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {payment.offer.productRequest.deliveryCity}, {payment.offer.productRequest.deliveryDistrict}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{payment.offer.deliveryTime} days delivery</span>
                            </div>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Seller</p>
                              <p className="font-medium text-[#1F1B24]">{payment.offer.seller.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Amount</p>
                              <p className="text-2xl font-bold text-[#770022]">
                                ₺{payment.amount.toLocaleString("en-US")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 lg:w-48">
                          <Button
                            onClick={() => router.push(`/buyer-dashboard/offers/${payment.offer.id}/payment`)}
                            className="w-full bg-[#770022] hover:bg-[#5a0019] text-white"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Complete Payment
                          </Button>
                          <p className="text-xs text-gray-500 text-center">
                            Created {format(new Date(payment.createdAt), "PP", { locale: enUS })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Payments */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/60">
            <CardTitle className="text-xl font-semibold text-[#1F1B24] flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Payment History
            </CardTitle>
            <CardDescription className="text-gray-600">
              All completed and cancelled transactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {completedPayments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-[#1F1B24]">No payment history</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Your completed payments will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedPayments.map((payment) => (
                  <Card key={payment.id} className="border-gray-200">
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-[#1F1B24]">
                                {payment.offer.productRequest.productName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {payment.offer.seller.name} • {payment.offer.productRequest.quantity} pcs
                              </p>
                            </div>
                            {getStatusBadge(payment.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>₺{payment.amount.toLocaleString("en-US")}</span>
                            <span>•</span>
                            <span>
                              {payment.paidAt 
                                ? format(new Date(payment.paidAt), "PPP", { locale: enUS })
                                : format(new Date(payment.createdAt), "PPP", { locale: enUS })}
                            </span>
                            {payment.paymentMethod && (
                              <>
                                <span>•</span>
                                <span className="capitalize">{payment.paymentMethod.replace("-", " ")}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BuyerDashboardLayout>
  )
}
