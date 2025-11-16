import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { MultiStepForm } from "@/components/product-request/multi-step-form"

export default function NewRequestPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">Create New Request</h1>
          <p className="text-gray-600 mt-2">
            Send a request to sellers for the product you're looking for. Fill out the form step by step.
          </p>
        </div>

        <MultiStepForm />
      </div>
    </BuyerDashboardLayout>
  )
}
