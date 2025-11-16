"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { Package, MapPin, Clock, Mail } from "lucide-react"

interface Offer {
  id: string
  price: number
  deliveryTime: number
  message: string | null
  status: string
  createdAt: Date
  respondedAt: Date | null
  buyerResponse: string | null
  productRequest: {
    id: string
    productName: string
    category: string
    quantity: number
    maxBudget: number | null
    deliveryCity: string
    deliveryDistrict: string
    user: {
      name: string | null
      email: string
    }
  }
}

interface OffersTableProps {
  offers: Offer[]
}

export function OffersTable({ offers }: OffersTableProps) {
  const getStatusBadge = (status: string) => {
    if (status === "pending") {
      return (
        <Badge className="bg-amber-100 text-amber-700 border border-amber-200">
          Pending
        </Badge>
      )
    }

    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      accepted: { label: "Accepted", variant: "secondary" },
      rejected: { label: "Rejected", variant: "destructive" },
      withdrawn: { label: "Withdrawn", variant: "outline" },
    }
    const config = statusConfig[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-gray-50/60">
        <CardTitle className="text-xl font-semibold text-[#1F1B24] flex items-center gap-2">
          <Package className="h-5 w-5 text-[#770022]" />
          Offers You Submitted
        </CardTitle>
        <CardDescription className="text-gray-600">
          Keep an eye on how buyers respond to your proposals and follow up quickly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {offers.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-[#1F1B24]">No offers yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              When you submit an offer for a buyer request, it will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#770022]/5 text-[#1F1B24]">
                  <TableHead>Product</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Your Offer</TableHead>
                  <TableHead>Delivery Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timeline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{offer.productRequest.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {offer.productRequest.quantity} pcs
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {offer.productRequest.user.name || "Anonymous"}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {offer.productRequest.user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-[#0F9D58] font-semibold">
                        ₺{offer.price.toLocaleString("en-US")}
                      </div>
                      {offer.productRequest.maxBudget && (
                        <p className="text-xs text-muted-foreground">
                          Buyer budget: ₺{offer.productRequest.maxBudget.toLocaleString("en-US")}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{offer.deliveryTime} days</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {offer.productRequest.deliveryCity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(offer.status)}
                      {offer.buyerResponse && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          “{offer.buyerResponse}”
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {format(new Date(offer.createdAt), "PPP", {
                            locale: enUS,
                          })}
                        </p>
                        {offer.respondedAt && (
                          <p className="text-xs text-muted-foreground">
                            Responded: {format(new Date(offer.respondedAt), "PP", { locale: enUS })}
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
