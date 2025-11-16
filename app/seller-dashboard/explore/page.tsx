"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { SellerDashboardLayout } from "@/components/layout/seller-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MapPin, Package, ChevronDown } from "lucide-react"
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api"
import { getCityCoordinates } from "@/lib/location"
import { motion, AnimatePresence } from "framer-motion"
import { SendOfferModal } from "@/components/seller/send-offer-modal"

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
  user: {
    name: string | null
    email: string
  }
}

const TURKEY_CENTER = { lat: 39.0, lng: 35.0 }
const MAP_CONTAINER_STYLE = { width: "100%", height: "500px" }
const DEFAULT_ZOOM = 5
const FOCUSED_ZOOM = 8
const TURKEY_BOUNDS = {
  north: 42.5,
  south: 35.5,
  west: 25.5,
  east: 45.5,
}

type RequestWithCoords = ProductRequest & { coordinates: google.maps.LatLngLiteral | null }

export default function ExplorePage() {
  const [requests, setRequests] = useState<ProductRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [offerModalOpen, setOfferModalOpen] = useState(false)
  const [offerRequest, setOfferRequest] = useState<ProductRequest | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/product-requests/explore")
        const data = await response.json()

        if (response.ok) {
          setRequests(data)
        } else {
          throw new Error(data.error || "Unable to fetch requests")
        }
      } catch (error) {
        console.error("Error fetching requests:", error)
        setError(error instanceof Error ? error.message : "Unexpected error")
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const requestsWithCoordinates: RequestWithCoords[] = useMemo(
    () =>
      requests.map((request) => ({
        ...request,
        coordinates: getCityCoordinates(request.deliveryCity),
      })),
    [requests]
  )

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequest(requestId)
    setExpandedRequestId(requestId)
    const target = requestsWithCoordinates.find((req) => req.id === requestId)
    if (target?.coordinates && mapRef.current) {
      mapRef.current.panTo(target.coordinates)
      mapRef.current.setZoom(FOCUSED_ZOOM)
    }
    const cardNode = cardRefs.current[requestId]
    if (cardNode) {
      cardNode.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const toggleExpand = (requestId: string) => {
    if (expandedRequestId === requestId) {
      setExpandedRequestId(null)
    } else {
      handleSelectRequest(requestId)
    }
  }

  const handleOpenOfferModal = (request: ProductRequest) => {
    setOfferRequest(request)
    setOfferModalOpen(true)
  }

  useEffect(() => {
    const handleOfferSubmitted = () => {
      // Refresh requests list
      fetch("/api/product-requests/explore")
        .then((res) => res.json())
        .then((data) => setRequests(data))
        .catch((err) => console.error("Error refreshing requests:", err))
    }
    window.addEventListener('offerSubmitted', handleOfferSubmitted)
    return () => window.removeEventListener('offerSubmitted', handleOfferSubmitted)
  }, [])

  return (
    <SellerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">Explore Requests</h1>
          <p className="text-gray-600 mt-2">
            Discover buyer requests across Turkey on the map and find opportunities to offer your products.
          </p>
        </div>

        {/* Map Container */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-xl font-semibold text-[#1F1B24] flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#770022]" />
              Request Map
            </CardTitle>
            <CardDescription className="text-gray-600">
              Interactive map showing all active buyer requests by location
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!isLoaded || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
              <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center text-gray-500">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="font-medium">Google Maps loading…</p>
                  <p className="text-sm">Ensure your API key is set to display request markers.</p>
                </div>
              </div>
            ) : (
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                mapContainerClassName="rounded-b-xl overflow-hidden"
                center={TURKEY_CENTER}
                zoom={DEFAULT_ZOOM}
                onLoad={(map) => {
                  mapRef.current = map
                  if (map && TURKEY_BOUNDS) {
                    map.fitBounds(TURKEY_BOUNDS)
                  }
                }}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  restriction: {
                    latLngBounds: TURKEY_BOUNDS,
                    strictBounds: false,
                  },
                  minZoom: 5,
                  maxZoom: 10,
                }}
              >
                <TooltipProvider delayDuration={100} disableHoverableContent>
                  {requestsWithCoordinates.map((request) =>
                    request.coordinates ? (
                      <OverlayView
                        key={request.id}
                        position={request.coordinates}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => handleSelectRequest(request.id)}
                              className={`group relative flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white shadow transition ${
                                selectedRequest === request.id
                                  ? "bg-[#770022] text-white scale-110"
                                  : "bg-[#A2405B] text-white hover:scale-105"
                              }`}
                            >
                              <span className="sr-only">{request.productName}</span>
                              <div className="h-2 w-2 rounded-full bg-white" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="w-64 space-y-1 bg-white text-left text-[#1F1B24]">
                            <p className="text-sm font-semibold">{request.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              {request.deliveryCity} / {request.deliveryDistrict}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{request.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="secondary" className="text-[10px]">
                                {request.category}
                              </Badge>
                              <span>{request.quantity} pcs</span>
                              {request.maxBudget && <span>{request.maxBudget?.toLocaleString("en-US")} ₺</span>}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </OverlayView>
                    ) : null
                  )}
                </TooltipProvider>
              </GoogleMap>
            )}
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-xl font-semibold text-[#1F1B24] flex items-center gap-2">
              <Package className="h-5 w-5 text-[#770022]" />
              All Active Requests
            </CardTitle>
            <CardDescription className="text-gray-600">
              {loading ? "Loading..." : `${requests.length} active requests available`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No active requests at the moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => {
                  const isExpanded = expandedRequestId === request.id
                  return (
                    <Card
                      key={request.id}
                      className={`border transition-all ${
                        selectedRequest === request.id
                          ? "border-[#770022] shadow-md"
                          : "border-gray-200 hover:border-[#770022]/50"
                      }`}
                      ref={(node) => {
                        cardRefs.current[request.id] = node
                      }}
                    >
                      {/* Header - Always visible */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(request.id)}
                        className="w-full text-left"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-base font-semibold text-[#1F1B24] truncate">
                                  {request.productName}
                                </CardTitle>
                                <motion.span
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex-shrink-0"
                                >
                                  <ChevronDown className="h-4 w-4 text-gray-500" />
                                </motion.span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  {request.category}
                                </Badge>
                                <span className="text-xs text-gray-500">by {request.user.name || "Anonymous"}</span>
                              </div>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 font-semibold uppercase tracking-wide text-sm px-3 py-1 flex-shrink-0">
                              A
                            </Badge>
                          </div>
                        </CardHeader>
                      </button>

                      {/* Expandable Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <CardContent className="pt-0 pb-4 space-y-4 bg-gray-50 border-t border-gray-100">
                              {/* Description */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Description</p>
                                <p className="text-sm text-gray-700">{request.description}</p>
                              </div>

                              {/* Details Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <p className="text-xs text-gray-500">Quantity</p>
                                  <p className="font-semibold text-[#1F1B24]">{request.quantity} pcs</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Budget</p>
                                  <p className="font-semibold text-[#1F1B24]">
                                    {request.maxBudget ? `${request.maxBudget.toLocaleString("en-US")} ₺` : "Flexible"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Location</p>
                                  <p className="font-semibold text-[#1F1B24] flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {request.deliveryCity}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Deadline</p>
                                  <p className="font-semibold text-[#1F1B24]">
                                    {request.offerDeadline ? new Date(request.offerDeadline).toLocaleDateString() : "Flexible"}
                                  </p>
                                </div>
                              </div>

                              {/* Full Location */}
                              <div className="text-xs text-gray-500">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {request.deliveryCity} / {request.deliveryDistrict}
                              </div>

                              {/* CTA Button */}
                              <div className="flex justify-end pt-2">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleOpenOfferModal(request)
                                  }}
                                  className="bg-[#770022] hover:bg-[#770022]/90 text-white"
                                >
                                  Send Offer
                                </Button>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Send Offer Modal */}
      <SendOfferModal
        request={offerRequest}
        open={offerModalOpen}
        onOpenChange={setOfferModalOpen}
      />
    </SellerDashboardLayout>
  )
}
