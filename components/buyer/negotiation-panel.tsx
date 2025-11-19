"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { Sparkles, Loader2, Send, MessageSquare, DollarSign, Clock, User, Package, MapPin, Calendar, AlertTriangle, ShieldAlert, UserCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

interface Negotiation {
  id: string
  message: string
  proposedPrice: number | null
  proposedDelivery: number | null
  isAiGenerated: boolean
  createdAt: Date
  sender: {
    id: string
    name: string | null
    email: string
    role: string | null
  }
}

interface NegotiationPanelProps {
  offerId: string
  offer: {
    price: number
    deliveryTime: number
    productRequest: {
      productName: string
      maxBudget: number | null
      quantity?: number
      deliveryCity?: string
    }
    seller?: {
      name: string | null
      email: string
      role: string | null
    }
  }
  currentUserId: string
  userType: "buyer" | "seller"
  buyerInfo?: {
    name: string | null
    email: string
  }
}

export function NegotiationPanel({ offerId, offer, currentUserId, userType, buyerInfo: propBuyerInfo }: NegotiationPanelProps) {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([])
  const [message, setMessage] = useState("")
  const [proposedPrice, setProposedPrice] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<any>(null)
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)
  const [buyerInfo, setBuyerInfo] = useState<{ name: string | null; email: string } | null>(propBuyerInfo || null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [negotiations])

  useEffect(() => {
    fetchNegotiations()
    // Fetch buyer info if not provided
    if (!buyerInfo && offer.productRequest) {
      fetchBuyerInfo()
    }
  }, [offerId])

  const fetchBuyerInfo = async () => {
    try {
      // Get buyer info from the offer's product request
      const response = await fetch(`/api/user`)
      if (response.ok) {
        const userData = await response.json()
        // If current user is seller, we need buyer info from the offer
        if (userType === "seller") {
          setBuyerInfo({
            name: "Buyer",
            email: "buyer@example.com"
          })
        }
      }
    } catch (error) {
      console.error("Error fetching buyer info:", error)
    }
  }

  const fetchNegotiations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/negotiations?offerId=${offerId}`)
      if (response.ok) {
        const data = await response.json()
        setNegotiations(data)
      }
    } catch (error) {
      console.error("Error fetching negotiations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAiSuggest = async () => {
    setIsGeneratingAi(true)
    setAiSuggestion(null)

    try {
      const response = await fetch("/api/ai/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer,
          negotiationHistory: negotiations,
          userType,
          userMessage: message || null,
        }),
      })

      if (!response.ok) {
        throw new Error("AI suggestion failed")
      }

      const data = await response.json()
      setAiSuggestion(data.data)
      
      // Auto-fill suggestion
      setMessage(data.data.message)
      if (data.data.proposedPrice) {
        setProposedPrice(data.data.proposedPrice.toString())
      }
    } catch (error) {
      console.error("Error getting AI suggestion:", error)
      alert("AI öneri alınamadı. Lütfen tekrar deneyin.")
    } finally {
      setIsGeneratingAi(false)
    }
  }

  const handleSend = async () => {
    if (!message.trim()) return

    setIsSending(true)

    try {
      const response = await fetch("/api/negotiations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId,
          message: message.trim(),
          proposedPrice: proposedPrice ? parseFloat(proposedPrice) : null,
          isAiGenerated: aiSuggestion !== null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const newNegotiation = await response.json()
      setNegotiations([...negotiations, newNegotiation])
      setMessage("")
      setProposedPrice("")
      setAiSuggestion(null)
    } catch (error) {
      console.error("Error sending negotiation:", error)
      alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="h-[85vh] w-full flex flex-col">
      {/* Warning Banner */}
      <div className="border-b bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3">
        <div className="flex items-center justify-center gap-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-xs text-amber-900 font-medium">
              Session closes in 12 hours
            </p>
          </div>
          <div className="h-4 w-px bg-amber-300" />
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <ShieldAlert className="h-4 w-4 text-red-600" />
            </div>
            <p className="text-xs text-red-900 font-medium">
              Abusive behavior results in removal
            </p>
          </div>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Column - Buyer Info */}
        <ResizablePanel defaultSize={25} minSize={20}>
          <ScrollArea className="h-full">
            <div className="p-3 space-y-3 bg-gray-50">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Buyer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt="Buyer" />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {buyerInfo?.name?.charAt(0)?.toUpperCase() || "B"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{buyerInfo?.name || "Not specified"}</p>
                      <p className="text-xs text-muted-foreground truncate">{buyerInfo?.email || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Package className="h-4 w-4 text-emerald-600" />
                    Request Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div>
                    <p className="text-xs text-muted-foreground">Product</p>
                    <p className="text-sm font-medium">{offer.productRequest.productName}</p>
                  </div>
                  {offer.productRequest.quantity && (
                    <div>
                      <p className="text-xs text-muted-foreground">Quantity</p>
                      <p className="text-sm font-medium">{offer.productRequest.quantity} pcs</p>
                    </div>
                  )}
                  {offer.productRequest.maxBudget && (
                    <div>
                      <p className="text-xs text-muted-foreground">Max Budget</p>
                      <p className="text-sm font-semibold text-emerald-600">
                        ₺{offer.productRequest.maxBudget.toLocaleString("tr-TR")}
                      </p>
                    </div>
                  )}
                  {offer.productRequest.deliveryCity && (
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {offer.productRequest.deliveryCity}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Middle Column - Chat */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col bg-white">
            {/* Chat Header */}
            <div className="border-b px-4 py-2 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                Negotiation Chat
              </h3>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : negotiations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                    <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs">Send the first message</p>
                  </div>
                ) : (
                  negotiations.map((neg) => {
                    const isCurrentUser = neg.sender.id === currentUserId
                    return (
                      <div
                        key={neg.id}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            isCurrentUser
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-semibold">
                              {neg.sender.name || neg.sender.email}
                            </p>
                            {neg.isAiGenerated && (
                              <Badge variant="outline" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{neg.message}</p>
                          {neg.proposedPrice && (
                            <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2 text-xs">
                              <DollarSign className="h-3 w-3" />
                              <span className="font-semibold">
                                {neg.proposedPrice.toLocaleString("tr-TR")} ₺
                              </span>
                            </div>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {format(new Date(neg.createdAt), "HH:mm")}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input Area */}
            <div className="border-t p-4 space-y-3 bg-gray-50">
              {aiSuggestion && (
                <Alert className="border-emerald-200 bg-emerald-50">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-sm text-emerald-900">
                    <p className="font-semibold mb-1">AI Suggestion</p>
                    <p className="text-xs text-emerald-700">{aiSuggestion.strategy}</p>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Price proposal (₺)"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button
                  onClick={handleAiSuggest}
                  disabled={isGeneratingAi || isSending}
                  variant="outline"
                  size="icon"
                  className="border-gray-300 bg-gray-50 hover:bg-gray-100"
                >
                  {isGeneratingAi ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="resize-none focus:ring-2 focus:ring-emerald-500"
              />

              <Button
                onClick={handleSend}
                disabled={!message.trim() || isSending}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send
              </Button>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Column - Seller Info */}
        <ResizablePanel defaultSize={25} minSize={20}>
          <ScrollArea className="h-full">
            <div className="p-3 space-y-3 bg-gray-50">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-600" />
                    Seller Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt="Seller" />
                      <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">
                        {offer.seller?.name?.charAt(0)?.toUpperCase() || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{offer.seller?.name || "Not specified"}</p>
                      <p className="text-xs text-muted-foreground truncate">{offer.seller?.email || "N/A"}</p>
                      {offer.seller?.role && (
                        <Badge variant="outline" className="text-xs mt-1">{offer.seller.role}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    Offer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div>
                    <p className="text-xs text-muted-foreground">Offered Price</p>
                    <p className="text-xl font-bold text-emerald-600">
                      ₺{offer.price.toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery Time</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {offer.deliveryTime} days
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
