"use client"

import { useState } from "react"
import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { MultiStepForm } from "@/components/product-request/multi-step-form"
import { AIAssistantModal } from "@/components/product-request/ai-assistant-modal"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function NewRequestPage() {
  const [assistantOpen, setAssistantOpen] = useState(false)

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div className="relative text-center">
          <Button
            onClick={() => setAssistantOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg flex items-center gap-2 absolute right-0 top-0"
          >
            <Sparkles className="h-4 w-4" />
            Woopy AI Asistan
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">Create New Request</h1>
          <p className="text-gray-600 mt-2">
            Send a request to sellers for the product you're looking for. Fill out the form step by step.
          </p>
        </div>

        <MultiStepForm assistantOpen={assistantOpen} setAssistantOpen={setAssistantOpen} />
      </div>

      <AIAssistantModal open={assistantOpen} onOpenChange={setAssistantOpen} />
    </BuyerDashboardLayout>
  )
}
