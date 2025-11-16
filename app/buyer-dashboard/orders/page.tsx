"use client"

import { useState, useEffect } from "react"
import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  Circle,
  Clock,
  Package,
  Truck,
  Home,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

interface OrderStatus {
  id: string
  label: string
  description: string
  timestamp?: string
  completed: boolean
  current: boolean
  icon: React.ElementType
}

interface Order {
  id: string
  productName: string
  orderNumber: string
  totalAmount: number
  currentStatus: string
  estimatedDelivery: string | null
  timelineEvents: OrderStatus[] | null
  createdAt: string
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "in_transit":
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          <Truck className="h-3 w-3 mr-1" />
          In Transit
        </Badge>
      )
    case "processing":
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          Processing
        </Badge>
      )
    case "delivered":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Delivered
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-rose-100 text-rose-700 border-rose-200">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      )
    default:
      return (
        <Badge className="bg-gray-100 text-gray-700 border-gray-200">
          <Circle className="h-3 w-3 mr-1" />
          Unknown
        </Badge>
      )
  }
}

const getDefaultTimeline = (currentStatus: string, createdAt: string): OrderStatus[] => {
  const statuses = ["placed", "processing", "shipped", "in_transit", "delivered"]
  const currentIndex = statuses.indexOf(currentStatus)
  
  return [
    {
      id: "placed",
      label: "Order Placed",
      description: "Your order has been confirmed",
      timestamp: createdAt,
      completed: currentIndex >= 0,
      current: currentStatus === "placed",
      icon: CheckCircle2,
    },
    {
      id: "processing",
      label: "Processing",
      description: "Seller is preparing your order",
      completed: currentIndex >= 1,
      current: currentStatus === "processing",
      icon: Package,
    },
    {
      id: "shipped",
      label: "Shipped",
      description: "Your order is on the way",
      completed: currentIndex >= 2 || currentIndex >= 3,
      current: currentStatus === "shipped" || currentStatus === "in_transit",
      icon: Truck,
    },
    {
      id: "delivered",
      label: "Delivered",
      description: "Order delivered to your address",
      completed: currentIndex >= 4,
      current: currentStatus === "delivered",
      icon: Home,
    },
  ]
}

const calculateProgress = (timeline: OrderStatus[]) => {
  const completed = timeline.filter((step) => step.completed).length
  return (completed / timeline.length) * 100
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders")
        if (!response.ok) throw new Error("Failed to fetch orders")
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <BuyerDashboardLayout>
        <div className="text-center py-12 text-gray-500">Loading orders...</div>
      </BuyerDashboardLayout>
    )
  }

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">My Orders</h1>
          <p className="text-gray-600 mt-2">
            Track all your orders and their delivery status
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            // Always generate timeline from current status to ensure icons work properly
            const timeline = getDefaultTimeline(order.currentStatus, order.createdAt)
            
            return (
            <Card key={order.id} className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold text-[#1F1B24]">
                      {order.productName}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Order #{order.orderNumber}
                    </CardDescription>
                  </div>
                  {getStatusBadge(order.currentStatus)}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Order Info */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-lg font-bold text-[#770022]">
                      ₺{order.totalAmount.toLocaleString("en-US")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="text-lg font-semibold text-[#1F1B24]">
                      {order.estimatedDelivery 
                        ? format(new Date(order.estimatedDelivery), "MMM dd, yyyy", { locale: enUS })
                        : "TBD"
                      }
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Order Progress</p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={calculateProgress(timeline)}
                        className="h-2 flex-1"
                      />
                      <span className="text-sm font-medium text-[#1F1B24]">
                        {Math.round(calculateProgress(timeline))}%
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Timeline */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-[#1F1B24] mb-4">Order Timeline</h3>
                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[15px] top-[20px] bottom-[20px] w-[2px] bg-gray-200" />

                    <div className="space-y-6">
                      {timeline.map((step: OrderStatus, index: number) => {
                        const Icon = step.icon
                        const isLast = index === timeline.length - 1

                        return (
                          <div key={step.id} className="relative flex gap-4">
                            {/* Icon Circle */}
                            <div
                              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                                step.completed
                                  ? "bg-[#770022] border-[#770022]"
                                  : step.current
                                  ? "bg-white border-[#770022] ring-4 ring-[#770022]/20"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 ${
                                  step.completed
                                    ? "text-white"
                                    : step.current
                                    ? "text-[#770022]"
                                    : "text-gray-400"
                                }`}
                              />
                            </div>

                            {/* Content */}
                            <div className={`flex-1 ${!isLast ? "pb-6" : ""}`}>
                              <div className="flex items-start justify-between">
                                <div>
                                  <p
                                    className={`font-semibold ${
                                      step.completed || step.current
                                        ? "text-[#1F1B24]"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-0.5">
                                    {step.description}
                                  </p>
                                  {step.timestamp && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {format(step.timestamp, "MMM dd, yyyy 'at' HH:mm", {
                                        locale: enUS,
                                      })}
                                    </p>
                                  )}
                                </div>
                                {step.current && (
                                  <Badge className="bg-[#770022] text-white">Current</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Info Alert */}
                {order.currentStatus === "in_transit" && (
                  <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Tracking Information</p>
                      <p>
                        Your order is currently in transit. You can track your package using the
                        tracking number provided in your email.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-[#1F1B24] mb-2">No Orders Yet</h3>
                <p className="text-gray-600">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BuyerDashboardLayout>
  )
}
