"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProductRequest {
  id: string
  productName: string
  maxBudget: number | null
}

interface SendOfferModalProps {
  request: ProductRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function SendOfferModal({ request, open, onOpenChange, onSuccess }: SendOfferModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [offerForm, setOfferForm] = useState({
    price: "",
    deliveryTime: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!request) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productRequestId: request.id,
          price: parseFloat(offerForm.price),
          deliveryTime: parseInt(offerForm.deliveryTime),
          message: offerForm.message || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Offer could not be sent")
      }

      // Success
      alert("Your offer has been sent successfully!")
      setOfferForm({ price: "", deliveryTime: "", message: "" })
      onOpenChange(false)
      
      // Emit custom event to refresh data
      window.dispatchEvent(new Event('offerSubmitted'))
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error submitting offer:", error)
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg border-none bg-transparent shadow-none p-0 gap-0 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] duration-300"
      >
        {/* Red Header */}
        <DialogHeader className="bg-[#770022] text-white px-6 py-6 text-center sm:text-center relative">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-full bg-transparent p-1 opacity-80 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-0"
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
              className="text-white"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="sr-only">Close</span>
          </button>
          <DialogTitle className="text-2xl font-bold text-white tracking-tight">Send Offer</DialogTitle>
          <DialogDescription className="text-white/95 text-base">
            Send your offer for <span className="font-semibold">{request?.productName}</span>
          </DialogDescription>
        </DialogHeader>

        {/* White Form Section */}
        <form onSubmit={handleSubmit} className="bg-white px-6 py-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
              Your Price Offer (₺) *
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 1500"
              value={offerForm.price}
              onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })}
              required
              className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
            />
            {request?.maxBudget && (
              <p className="text-xs text-gray-500 mt-1">
                Buyer's maximum budget: <span className="font-semibold text-emerald-600">₺{request.maxBudget.toLocaleString("en-US")}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryTime" className="text-sm font-medium text-gray-700">
              Delivery Time (Days) *
            </Label>
            <Input
              id="deliveryTime"
              type="number"
              min="1"
              placeholder="e.g. 7"
              value={offerForm.deliveryTime}
              onChange={(e) => setOfferForm({ ...offerForm, deliveryTime: e.target.value })}
              required
              className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
              Your Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="You can provide additional information about your offer..."
              rows={4}
              value={offerForm.message}
              onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })}
              className="border-gray-300 focus:border-[#770022] focus:ring-[#770022] resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-[#770022] hover:bg-[#770022]/90 text-white px-6"
            >
              {isSubmitting ? "Sending..." : "Send Offer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
