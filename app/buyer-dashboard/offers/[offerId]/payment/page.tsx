"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  ShieldCheck, 
  Package, 
  Clock,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Info,
  Lock,
  FileText,
  Zap
} from "lucide-react"

interface OfferDetails {
  id: string
  price: number
  deliveryTime: number
  message: string | null
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

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const offerId = params.offerId as string

  const [offer, setOffer] = useState<OfferDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("wire-transfer")
  const [isProcessing, setIsProcessing] = useState(false)

  // Form states for wire transfer
  const [accountName, setAccountName] = useState("")
  const [bankName, setBankName] = useState("")
  const [iban, setIban] = useState("")
  const [transferDate, setTransferDate] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")

  useEffect(() => {
    async function fetchOfferDetails() {
      try {
        const response = await fetch(`/api/offers/${offerId}`)
        if (!response.ok) throw new Error("Failed to fetch offer")
        const data = await response.json()
        setOffer(data)
      } catch (error) {
        console.error("Error fetching offer:", error)
      } finally {
        setLoading(false)
      }
    }

    if (offerId) {
      fetchOfferDetails()
    }
  }, [offerId])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Here you would integrate with a real payment gateway
      const response = await fetch(`/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId,
          paymentMethod,
          amount: offer?.price,
          // Add payment details here (encrypted in production)
        }),
      })

      if (!response.ok) throw new Error("Payment failed")

      // Redirect to success page or orders
      router.push(`/buyer-dashboard/orders?payment=success`)
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <BuyerDashboardLayout>
        <div className="text-center py-12 text-gray-500">Loading payment details...</div>
      </BuyerDashboardLayout>
    )
  }

  if (!offer) {
    return (
      <BuyerDashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Offer not found</p>
          <Button onClick={() => router.push("/buyer-dashboard/offers")} className="mt-4">
            Back to Offers
          </Button>
        </div>
      </BuyerDashboardLayout>
    )
  }

  // Render Step 1: How It Works
  const renderHowItWorks = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/buyer-dashboard/offers")}
          className="text-gray-600 hover:text-[#770022]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Offers
        </Button>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[#1F1B24]">Secure Payment Process</h1>
        <p className="text-gray-600 mt-3 text-lg">
          Understanding how our payment system works
        </p>
      </div>

      {/* How It Works Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card className="border-gray-200 shadow-sm hover:shadow-md transition">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-[#770022]/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-[#770022]" />
            </div>
            <h3 className="font-semibold text-lg text-[#1F1B24] mb-2">Secure & Encrypted</h3>
            <p className="text-gray-600 text-sm">
              All transactions are protected with bank-level encryption. Your payment information is never stored on our servers.
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm hover:shadow-md transition">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-[#770022]/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-[#770022]" />
            </div>
            <h3 className="font-semibold text-lg text-[#1F1B24] mb-2">Buyer Protection</h3>
            <p className="text-gray-600 text-sm">
              Your payment is held securely until you confirm receipt of the product. Full refund guarantee if terms are not met.
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm hover:shadow-md transition">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-[#770022]/10 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-[#770022]" />
            </div>
            <h3 className="font-semibold text-lg text-[#1F1B24] mb-2">Fast Processing</h3>
            <p className="text-gray-600 text-sm">
              Payments are verified within 24 hours. Sellers are notified immediately to begin order preparation.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Process Steps */}
      <Card className="border-gray-200 shadow-sm mt-8">
        <CardHeader className="border-b border-gray-100 bg-gray-50/60">
          <CardTitle className="text-xl font-semibold text-[#1F1B24] flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#770022]" />
            Payment Process Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#770022] text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-[#1F1B24] mb-1">Select Payment Method</h4>
                <p className="text-gray-600 text-sm">
                  Choose your preferred payment method. Currently, we support Wire Transfer/EFT for secure transactions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#770022] text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-[#1F1B24] mb-1">Complete Transfer</h4>
                <p className="text-gray-600 text-sm">
                  Transfer the payment to our secure account using the provided bank details. Keep your transaction reference number.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#770022] text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-[#1F1B24] mb-1">Submit Payment Details</h4>
                <p className="text-gray-600 text-sm">
                  Enter your transfer details including reference number. Our team will verify the payment within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#770022] text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-[#1F1B24] mb-1">Order Confirmation</h4>
                <p className="text-gray-600 text-sm">
                  Once verified, the seller will be notified and your order will be processed. Track your order status in real-time.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Important Notes</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Payment verification typically takes 1-24 hours during business days</li>
                <li>• Keep your transaction reference number for tracking purposes</li>
                <li>• Contact support if payment is not verified within 48 hours</li>
                <li>• Refunds are processed within 5-7 business days if order is cancelled</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={() => setCurrentStep(2)}
          className="bg-[#770022] hover:bg-[#5a0019] text-white px-8"
          size="lg"
        >
          Continue to Payment
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  )

  return (
    <BuyerDashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {currentStep === 1 ? (
          renderHowItWorks()
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="text-gray-600 hover:text-[#770022]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Guide
              </Button>
              <Badge variant="outline" className="text-[#770022] border-[#770022]">
                Step 2 of 2
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">Complete Payment</h1>
              <p className="text-gray-600 mt-2">
                Select your payment method and complete the transaction.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-3 rounded-xl">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-sm font-medium">Your payment is protected by Woopy.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100 bg-gray-50/60">
                    <CardTitle className="text-xl font-semibold text-[#1F1B24] flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-[#770022]" />
                      Payment Method
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Choose Wire Transfer / EFT to proceed (other options coming soon)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 border-2 border-[#770022] bg-[#770022]/5 rounded-lg p-4 cursor-pointer">
                          <RadioGroupItem value="wire-transfer" id="wire-transfer" />
                          <Label htmlFor="wire-transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                            <Building2 className="h-5 w-5 text-[#770022]" />
                            <div className="flex-1">
                              <span className="font-semibold text-[#1F1B24]">Wire Transfer / EFT</span>
                              <p className="text-xs text-gray-600 mt-0.5">Secure bank transfer</p>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                              Available
                            </Badge>
                          </Label>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                          {[{
                            label: "Credit / Debit Card",
                            icon: <CreditCard className="h-4 w-4" />, //
                          }, {
                            label: "Direct Bank Transfer",
                            icon: <Building2 className="h-4 w-4" />,
                          }, {
                            label: "Digital Wallet",
                            icon: <Wallet className="h-4 w-4" />,
                          }].map((method) => (
                            <div
                              key={method.label}
                              className="border border-dashed border-gray-200 bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-500"
                            >
                              <div className="flex items-center justify-center gap-2 text-gray-400">
                                {method.icon}
                                <span>{method.label}</span>
                              </div>
                              <p className="mt-2 text-xs">Coming Soon</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100 bg-gray-50/60">
                    <CardTitle className="text-xl font-semibold text-[#1F1B24]">
                      Bank Account Information
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Transfer the payment to the account below
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="bg-[#770022]/5 p-5 rounded-xl border border-[#770022]/20 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bank Name</span>
                        <span className="font-semibold text-[#1F1B24]">Woopy Bank</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Account Holder</span>
                        <span className="font-semibold text-[#1F1B24]">Woopy Trading Ltd.</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">IBAN</span>
                        <span className="font-mono font-semibold text-[#1F1B24]">TR12 3456 7890 1234 5678 9012 34</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Amount to Transfer</span>
                        <span className="text-2xl font-bold text-[#770022]">
                          ₺{offer.price.toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Your Account Holder Name</Label>
                        <Input
                          id="accountName"
                          placeholder="John Doe"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          required
                          className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankName">Your Bank Name</Label>
                        <Input
                          id="bankName"
                          placeholder="e.g., Garanti BBVA"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          required
                          className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="iban">Your IBAN</Label>
                        <Input
                          id="iban"
                          placeholder="TR00 0000 0000 0000 0000 0000 00"
                          value={iban}
                          onChange={(e) => setIban(e.target.value)}
                          required
                          className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="transferDate">Transfer Date</Label>
                          <Input
                            id="transferDate"
                            type="date"
                            value={transferDate}
                            onChange={(e) => setTransferDate(e.target.value)}
                            required
                            className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="referenceNumber">Reference Number</Label>
                          <Input
                            id="referenceNumber"
                            placeholder="123456789"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            required
                            className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900 mb-1">Important</p>
                          <p>Keep your reference number. Payment verification may take up to 24 hours.</p>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-[#770022] hover:bg-[#5a0019] text-white mt-6"
                        size="lg"
                      >
                        {isProcessing ? "Submitting..." : (
                          <>
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            Submit Transfer Details
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="border-gray-200 shadow-sm sticky top-6">
                  <CardHeader className="border-b border-gray-100 bg-gray-50/60">
                    <CardTitle className="text-xl font-semibold text-[#1F1B24] flex items-center gap-2">
                      <Package className="h-5 w-5 text-[#770022]" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-[#1F1B24] mb-1">
                        {offer.productRequest.productName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {offer.productRequest.quantity} pcs
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Delivery Location</p>
                          <p className="font-medium text-[#1F1B24]">
                            {offer.productRequest.deliveryCity}, {offer.productRequest.deliveryDistrict}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Delivery Time</p>
                          <p className="font-medium text-[#1F1B24]">
                            {offer.deliveryTime} days
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Seller</p>
                      <p className="font-medium text-[#1F1B24]">{offer.seller.name}</p>
                      <p className="text-sm text-gray-500">{offer.seller.email}</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₺{offer.price.toLocaleString("en-US")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Service Fee</span>
                        <span className="font-medium">₺0</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold text-[#1F1B24]">Total</span>
                        <span className="font-bold text-xl text-[#770022]">
                          ₺{offer.price.toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>

                    {offer.message && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Seller's Message</p>
                          <p className="text-sm text-[#1F1B24] bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {offer.message}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </BuyerDashboardLayout>
  )
}
