"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { Package, MapPin, Clock, Mail, CheckCircle2, XCircle, MessageSquare } from "lucide-react"
import { NegotiationPanel } from "@/components/buyer/negotiation-panel"

interface Offer {
  id: string
  price: number
  deliveryTime: number
  message: string | null
  status: string
  createdAt: Date
  respondedAt: Date | null
  buyerResponse: string | null
  seller: {
    id: string
    name: string | null
    email: string
  }
  productRequest: {
    id: string
    productName: string
    category: string
    quantity: number
    maxBudget: number | null
    deliveryCity: string
    deliveryDistrict: string
  }
}

interface OffersTableProps {
  offers: Offer[]
  aiAnalysis?: {
    analysis: string
    recommendation: string
    offers: Offer[]
    productRequest: {
      productName: string
      quantity: number
    }
    cached?: boolean
  } | null
  aiAnalysisError?: string | null
  aiAnalysisLoading?: boolean
}

export function BuyerOffersTable({ offers, aiAnalysis, aiAnalysisError, aiAnalysisLoading }: OffersTableProps) {
  const router = useRouter()
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [responseModalOpen, setResponseModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [responseType, setResponseType] = useState<"accepted" | "rejected">("accepted")
  const [buyerResponse, setBuyerResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [negotiationOpen, setNegotiationOpen] = useState(false)
  const [negotiationOffer, setNegotiationOffer] = useState<Offer | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    // Fetch current user ID
    async function fetchUser() {
      try {
        const response = await fetch("/api/user")
        if (response.ok) {
          const data = await response.json()
          setCurrentUserId(data.id)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }
    fetchUser()
  }, [])

  const getStatusBadge = (status: string) => {
    if (status === "pending") {
      return (
        <Badge className="bg-amber-100 text-amber-700 border border-amber-200">
          Pending
        </Badge>
      )
    }

    const statusConfig: Record<string, { label: string; className: string }> = {
      accepted: {
        label: "Accepted",
        className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      },
      rejected: {
        label: "Rejected",
        className: "bg-rose-100 text-rose-700 border border-rose-200",
      },
      withdrawn: {
        label: "Withdrawn",
        className: "bg-gray-100 text-gray-600 border border-gray-200",
      },
    }

    const config = statusConfig[status]

    if (config) {
      return <Badge className={config.className}>{config.label}</Badge>
    }

    return <Badge variant="outline">{status}</Badge>
  }

  const handleOpenResponseModal = (offer: Offer, type: "accepted" | "rejected") => {
    setSelectedOffer(offer)
    setResponseType(type)
    setResponseModalOpen(true)
    setBuyerResponse("")
  }

  // Countdown timer for success modal
  useEffect(() => {
    if (successModalOpen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (successModalOpen && countdown === 0) {
      // Redirect to payment page
      router.push(`/buyer-dashboard/offers/${selectedOffer?.id}/payment`)
    }
  }, [successModalOpen, countdown, router, selectedOffer])

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedOffer) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/offers/${selectedOffer.id}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: responseType,
          buyerResponse: buyerResponse || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("API Error Response:", error)
        throw new Error(error.details || error.error || "Failed to send response")
      }

      setResponseModalOpen(false)
      setBuyerResponse("")
      
      if (responseType === "accepted") {
        // Show success modal for accepted offers
        setSuccessModalOpen(true)
        setCountdown(5)
      } else {
        // For rejected offers, just refresh
        alert("Offer rejected successfully")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error responding to offer:", error)
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/60">
          <CardTitle className="text-xl font-semibold text-[#1F1B24] flex items-center gap-2">
            <Package className="h-5 w-5 text-[#770022]" />
            Offers from Sellers
          </CardTitle>
          <CardDescription className="text-gray-600">
            Review and respond to seller proposals for your product requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(aiAnalysisLoading || aiAnalysis || aiAnalysisError) && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              {aiAnalysisLoading && (
                <div className="flex items-center gap-3 text-gray-600">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  AI teklif analizi yapılıyor...
                </div>
              )}
              {aiAnalysisError && (
                <div className="text-sm text-red-600">{aiAnalysisError}</div>
              )}
              {aiAnalysis && !aiAnalysisLoading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-emerald-900">
                      AI Önerisi: {aiAnalysis.productRequest.productName} ({aiAnalysis.productRequest.quantity} adet)
                    </p>
                    {aiAnalysis.cached && (
                      <Badge variant="outline" className="text-xs">Önbellekten yüklendi</Badge>
                    )}
                  </div>
                  <p className="text-sm text-emerald-800">{aiAnalysis.analysis}</p>
                  <p className="text-sm text-emerald-700 font-medium">Öneri: {aiAnalysis.recommendation}</p>
                </div>
              )}
            </div>
          )}
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-[#1F1B24]">No offers yet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                When sellers submit offers for your requests, they will appear here.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#770022]/5 text-[#1F1B24]">
                    <TableHead>My Request</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Offer Price</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                            {offer.seller.name || "Anonymous"}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {offer.seller.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-[#0F9D58]">
                          ₺{offer.price.toLocaleString("en-US")}
                        </span>
                        {offer.productRequest.maxBudget && (
                          <p className="text-xs text-muted-foreground">
                            My budget: ₺{offer.productRequest.maxBudget.toLocaleString("en-US")}
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
                        {offer.message ? (
                          <p className="text-sm max-w-xs truncate">{offer.message}</p>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(offer.status)}
                        {offer.buyerResponse && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {offer.buyerResponse}
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
                      <TableCell className="text-right">
                        {offer.status === "pending" && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 bg-gray-50 hover:bg-gray-100"
                              onClick={() => {
                                setNegotiationOffer(offer)
                                setNegotiationOpen(true)
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Müzakere
                            </Button>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                              onClick={() => handleOpenResponseModal(offer, "accepted")}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={() => handleOpenResponseModal(offer, "rejected")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Modal */}
      <Dialog open={responseModalOpen} onOpenChange={setResponseModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-lg border-none p-0 gap-0 overflow-hidden shadow-2xl"
        >
          <DialogTitle className="sr-only">
            {responseType === "accepted" ? "Accept Offer" : "Reject Offer"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Respond to the seller's offer
          </DialogDescription>
          {/* Header */}
          <div className="bg-[#770022] text-white px-8 py-6 relative text-center sm:text-left">
            <button
              type="button"
              onClick={() => setResponseModalOpen(false)}
              className="absolute right-6 top-5 rounded-full bg-white/10 p-1.5 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className="sr-only">Close</span>
            </button>
            <h2 className="text-2xl font-bold tracking-tight">
              {responseType === "accepted" ? "Accept Offer" : "Reject Offer"}
            </h2>
            <p className="text-white/90 mt-1 text-base">
              {responseType === "accepted" ? "Confirm your acceptance" : "Decline this proposal"} from {selectedOffer?.seller.name || "seller"}
            </p>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmitResponse} className="bg-white px-8 py-6 space-y-5">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Product</span>
                <span className="font-semibold text-[#1F1B24]">{selectedOffer?.productRequest.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Offer Price</span>
                <span className="font-semibold text-[#0F9D58]">
                  ₺{selectedOffer?.price.toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Delivery Time</span>
                <span className="font-semibold text-[#1F1B24]">{selectedOffer?.deliveryTime} days</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerResponse" className="text-sm font-medium text-gray-700">
                Your Message (Optional)
              </Label>
              <Textarea
                id="buyerResponse"
                placeholder={
                  responseType === "accepted"
                    ? "Thank you, I accept your offer..."
                    : "Unfortunately, I cannot accept this offer..."
                }
                rows={4}
                value={buyerResponse}
                onChange={(e) => setBuyerResponse(e.target.value)}
                className="border-gray-300 focus:border-[#770022] focus:ring-[#770022] resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResponseModalOpen(false)}
                disabled={isSubmitting}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={responseType === "accepted" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white"}
              >
                {isSubmitting
                  ? "Sending..."
                  : responseType === "accepted"
                  ? "Accept Offer"
                  : "Reject Offer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-md border-none p-0 gap-0 overflow-hidden shadow-2xl"
        >
          <DialogTitle className="sr-only">Offer Accepted Successfully</DialogTitle>
          <DialogDescription className="sr-only">
            Redirecting to payment page
          </DialogDescription>
          
          {/* Success Header */}
          <div className="bg-emerald-600 text-white px-8 py-6 text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Congratulations!
            </h2>
            <p className="text-white/90 mt-1 text-base">
              You've accepted the seller's offer
            </p>
          </div>

          {/* Success Body */}
          <div className="bg-white px-8 py-6 space-y-4">
            <div className="text-center space-y-3">
              <p className="text-gray-700 leading-relaxed">
                The offer for <span className="font-semibold text-[#1F1B24]">{selectedOffer?.productRequest.productName}</span> has been successfully accepted. You're being redirected to our secure payment page to complete the transaction.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">Before making payment:</p>
                <p>Please review the offer details and seller information one last time.</p>
              </div>

              <div className="pt-4">
                <div className="inline-flex items-center justify-center gap-3 bg-[#770022]/10 text-[#770022] px-6 py-3 rounded-full">
                  <Clock className="h-5 w-5 animate-pulse" />
                  <span className="font-semibold text-lg">
                    Redirecting in {countdown} seconds...
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => router.push(`/buyer-dashboard/offers/${selectedOffer?.id}/payment`)}
              className="w-full bg-[#770022] hover:bg-[#5a0019] text-white"
              size="lg"
            >
              Go to Payment Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Negotiation Dialog */}
      <Dialog open={negotiationOpen} onOpenChange={setNegotiationOpen}>
        <DialogContent className="!max-w-[95vw] max-h-[95vh] p-0 gap-0 overflow-hidden">
          <DialogTitle className="sr-only">Negotiation Panel</DialogTitle>
          {negotiationOffer && currentUserId && (
            <NegotiationPanel
              offerId={negotiationOffer.id}
              offer={{
                ...negotiationOffer,
                productRequest: {
                  ...negotiationOffer.productRequest,
                  quantity: negotiationOffer.productRequest.quantity,
                  deliveryCity: negotiationOffer.productRequest.deliveryCity,
                },
                seller: {
                  name: negotiationOffer.seller.name,
                  email: negotiationOffer.seller.email,
                  role: null,
                },
              }}
              currentUserId={currentUserId}
              userType="buyer"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
