"use client"

import React, { useState, useMemo } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SendOfferModal } from "@/components/seller/send-offer-modal"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Eye,
  Package,
  MapPin,
  DollarSign,
  Calendar,
  Hash,
  Tag,
  Image as ImageIcon,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  AlertCircle,
} from "lucide-react"
import { NegotiationPanel } from "@/components/buyer/negotiation-panel"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format, formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"

interface ProductRequest {
  id: string
  productName: string
  category: string
  description: string
  quantity: number
  maxBudget: number | null
  deliveryCity: string
  deliveryDistrict: string
  offerDeadline: Date | null
  exampleImageUrl: string | null
  brandModel: string | null
  dynamicFields: any
  status: string
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  hasOffer?: boolean
  hasNegotiation?: boolean
  myOffer?: {
    id: string
    status: string
    price: number
    createdAt: Date
    negotiations?: Array<{
      id: string
      createdAt: Date
    }>
  } | null
}

interface RequestsTableProps {
  requests: ProductRequest[]
}

export function RequestsTable({ requests }: RequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [offerModalOpen, setOfferModalOpen] = useState(false)
  const [offerRequest, setOfferRequest] = useState<ProductRequest | null>(null)
  const [negotiationOpen, setNegotiationOpen] = useState(false)
  const [negotiationRequest, setNegotiationRequest] = useState<ProductRequest | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  React.useEffect(() => {
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

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      "elektronik": "Electronics",
      "giyim": "Apparel",
      "ev-yasam": "Home & Living",
      "spor-outdoor": "Sports & Outdoor",
      "kitap-muzik-film": "Books, Music & Movies",
      "otomotiv": "Automotive",
      "anne-bebek": "Mother & Baby",
      "kozmetik": "Cosmetics & Personal Care",
      "diger": "Other",
    }
    return categories[category] || category
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        label: string
        variant?: "default" | "secondary" | "destructive" | "outline"
        className?: string
      }
    > = {
      active: {
        label: "Active",
        variant: "default",
        className: "bg-[#E6F4EA] text-[#0F9D58] border-transparent",
      },
      completed: { label: "Completed", variant: "secondary" },
      cancelled: { label: "Cancelled", variant: "destructive" },
    }
    const config = statusConfig[status] || { label: status, variant: "outline" }
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getTimeRemaining = (deadline: Date | null) => {
    if (!deadline) return "Not specified"
    
    const now = new Date()
    const deadlineDate = new Date(deadline)
    
    if (deadlineDate < now) {
      return "Expired"
    }
    
    return formatDistanceToNow(deadlineDate, { locale: enUS, addSuffix: true })
  }

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  // Filter requests based on search query
  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests
    
    const query = searchQuery.toLowerCase()
    return requests.filter(
      (request) =>
        request.productName.toLowerCase().includes(query) ||
        request.description.toLowerCase().includes(query)
    )
  }, [requests, searchQuery])

  const handleOpenOfferModal = (request: ProductRequest) => {
    setOfferRequest(request)
    setOfferModalOpen(true)
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50">
        <CardTitle className="text-2xl font-semibold text-[#1F1B24] flex items-center gap-2">
          <Package className="h-5 w-5 text-[#770022]" />
          Incoming Buyer Requests
        </CardTitle>
        <CardDescription className="text-gray-600">
          Review buyer demand, respond with offers, and manage opportunities in real time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-[#1F1B24]">No requests yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Once buyers create a request you will see it listed here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Negotiation Notification Banner */}
            {requests.some(r => r.hasNegotiation) && (
              <Alert className="border-amber-300 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-900">
                  <p className="font-semibold">Müzakere Talebi</p>
                  <p className="text-sm mt-1">
                    {requests.filter(r => r.hasNegotiation).length} alıcı müzakere başlattı. 
                    Tablodaki sarı "Müzakere" butonuna tıklayarak görüşmelere katılabilirsiniz.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#770022]/5 text-[#1F1B24]">
                    <TableHead>Product</TableHead>
                    <TableHead>Delivery Location</TableHead>
                    <TableHead>Time Left</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden lg:table-cell">Quantity</TableHead>
                    <TableHead className="hidden lg:table-cell">Budget</TableHead>
                    <TableHead className="hidden xl:table-cell">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No requests match your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => {
                      const isExpanded = expandedRows.has(request.id)
                      return (
                        <React.Fragment key={request.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <TableRow className="cursor-pointer hover:bg-muted/50">
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <span className="md:hidden">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => toggleRowExpansion(request.id)}
                                      >
                                        {isExpanded ? (
                                          <ChevronUp className="h-4 w-4" />
                                        ) : (
                                          <ChevronDown className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </span>
                                    {request.productName}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm">
                                      {request.deliveryCity} / {request.deliveryDistrict}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm">
                                      {getTimeRemaining(request.offerDeadline)}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <Badge variant="outline">
                                    {getCategoryLabel(request.category)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {request.quantity} pcs
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {request.maxBudget ? (
                                    <span className="text-[#0F9D58] font-semibold">
                                      ₺{request.maxBudget.toLocaleString("en-US")}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell className="hidden xl:table-cell">
                                  {getStatusBadge(request.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {request.hasNegotiation && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                        onClick={() => {
                                          setNegotiationRequest(request)
                                          setNegotiationOpen(true)
                                        }}
                                      >
                                        <MessageSquare className="h-4 w-4 mr-1" />
                                        Müzakere
                                      </Button>
                                    )}
                                    {request.hasOffer ? (
                                      <Badge className="cursor-default bg-[#E6F4EA] text-[#0F9D58] border-transparent">
                                        Offer Sent
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="default"
                                        className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                                        onClick={() => handleOpenOfferModal(request)}
                                      >
                                        Send Offer
                                      </Badge>
                                    )}
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => setSelectedRequest(request)}
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                    </Dialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-md">
                              <div className="space-y-2">
                                <p className="font-semibold text-[#1F1B24]">Description</p>
                                <p className="text-xs">
                                  {request.description.length > 150
                                    ? `${request.description.slice(0, 150)}...`
                                    : request.description}
                                </p>
                                {request.maxBudget && (
                                  <p className="text-xs font-medium text-[#0F9D58]">
                                    Budget: ₺{request.maxBudget.toLocaleString("en-US")}
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                          
                          {/* Collapsible Mobile Details */}
                          {isExpanded && (
                            <TableRow className="md:hidden">
                              <TableCell colSpan={8} className="bg-muted/30">
                                <div className="space-y-3 py-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Category</span>
                                    <Badge variant="outline">
                                      {getCategoryLabel(request.category)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Quantity</span>
                                    <span className="text-sm font-medium">{request.quantity} pcs</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Budget</span>
                                    {request.maxBudget ? (
                                      <span className="text-sm font-medium text-[#0F9D58]">
                                        ₺{request.maxBudget.toLocaleString("en-US")}
                                      </span>
                                    ) : (
                                      <span className="text-sm text-muted-foreground">-</span>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    {getStatusBadge(request.status)}
                                  </div>
                                  <Separator />
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                                    <p className="text-sm">{request.description}</p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Offer Modal */}
        <SendOfferModal
          request={offerRequest}
          open={offerModalOpen}
          onOpenChange={setOfferModalOpen}
        />

        {/* Detail Dialog - Outside the table */}
        {selectedRequest && (
          <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
            <DialogContent
              showCloseButton={false}
              className="max-w-3xl border-none p-0 gap-0 overflow-hidden shadow-2xl"
            >
              <DialogTitle className="sr-only">Request Details</DialogTitle>
              <DialogDescription className="sr-only">
                Detailed information about the selected buyer request
              </DialogDescription>
              {/* Header */}
              <div className="bg-[#770022] text-white px-8 py-6 relative text-center sm:text-left">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
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
                <h2 className="text-2xl font-bold tracking-tight">Request Details</h2>
                <p className="text-white/90 mt-1 text-base">
                  {selectedRequest.productName} · ID #{selectedRequest.id.slice(0, 8)}
                </p>
              </div>

              {/* Body */}
              <div className="bg-white px-8 py-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Overview */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Product Name</p>
                      <p className="font-medium">{selectedRequest.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <Badge variant="outline">
                        <Tag className="h-3 w-3 mr-1" />
                        {getCategoryLabel(selectedRequest.category)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Requested Quantity</p>
                      <p className="font-medium flex items-center gap-1">
                        <Hash className="h-4 w-4" />
                        {selectedRequest.quantity} pcs
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>

                  {selectedRequest.dynamicFields?.warrantyStatus && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Warranty Status</p>
                      <Badge variant="secondary" className="mt-1">
                        {selectedRequest.dynamicFields.warrantyStatus}
                      </Badge>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                      {selectedRequest.description}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Location & Budget */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location & Budget
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Location</p>
                      <p className="font-medium">
                        {selectedRequest.deliveryCity} / {selectedRequest.deliveryDistrict}
                      </p>
                    </div>
                    {selectedRequest.maxBudget && (
                      <div>
                        <p className="text-sm text-muted-foreground">Maximum Budget</p>
                        <p className="font-medium text-[#0F9D58] flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {selectedRequest.maxBudget.toLocaleString("en-US")} ₺
                        </p>
                      </div>
                    )}
                    {selectedRequest.offerDeadline && (
                      <div>
                        <p className="text-sm text-muted-foreground">Offer Deadline</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(selectedRequest.offerDeadline), "PPP", {
                            locale: enUS,
                          })}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Created At</p>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(selectedRequest.createdAt), "PPP", {
                          locale: enUS,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {(selectedRequest.exampleImageUrl || selectedRequest.brandModel) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Additional Information
                      </h3>
                      <div className="space-y-4">
                        {selectedRequest.exampleImageUrl && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Reference Image URL
                            </p>
                            <a
                              href={selectedRequest.exampleImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline break-all"
                            >
                              {selectedRequest.exampleImageUrl}
                            </a>
                          </div>
                        )}
                        {selectedRequest.brandModel && (
                          <div>
                            <p className="text-sm text-muted-foreground">Brand / Model</p>
                            <p className="font-medium">{selectedRequest.brandModel}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Buyer Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Buyer Information</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Name:</span>{" "}
                      <span className="font-medium">
                        {selectedRequest.user.name || "Not specified"}
                      </span>
                    </p>
                    <p className="text-sm mt-2">
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <span className="font-medium">{selectedRequest.user.email}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-end pt-4 items-center">
                  {selectedRequest.hasOffer && (
                    <Badge className="bg-[#E6F4EA] text-[#0F9D58] border-transparent order-last sm:order-first">
                      Offer already sent
                    </Badge>
                  )}
                  <Button variant="outline" className="border-[#770022]/30 text-[#770022]">
                    Contact Buyer
                  </Button>
                  {!selectedRequest.hasOffer && (
                    <Button
                      className="bg-[#770022] hover:bg-[#770022]/90 text-white"
                      onClick={() => handleOpenOfferModal(selectedRequest)}
                    >
                      Send Offer
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>

      {/* Negotiation Dialog */}
      <Dialog open={negotiationOpen} onOpenChange={setNegotiationOpen}>
        <DialogContent className="!max-w-[95vw] max-h-[95vh] p-0 gap-0 overflow-hidden">
          <DialogTitle className="sr-only">Negotiation Panel</DialogTitle>
          {negotiationRequest?.myOffer && currentUserId && (
            <NegotiationPanel
              offerId={negotiationRequest.myOffer.id}
              offer={{
                price: negotiationRequest.myOffer.price,
                deliveryTime: 7,
                productRequest: {
                  productName: negotiationRequest.productName,
                  maxBudget: negotiationRequest.maxBudget,
                  quantity: negotiationRequest.quantity,
                  deliveryCity: negotiationRequest.deliveryCity,
                },
              }}
              currentUserId={currentUserId}
              userType="seller"
              buyerInfo={{
                name: negotiationRequest.user.name,
                email: negotiationRequest.user.email,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
