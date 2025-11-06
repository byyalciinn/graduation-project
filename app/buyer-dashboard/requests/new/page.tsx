import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { MultiStepForm } from "@/components/product-request/multi-step-form"

export default function NewRequestPage() {
  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Yeni Talep Oluştur</h1>
          <p className="text-muted-foreground mt-2">
            Aradığınız ürün için satıcılara talep gönderin. Formu adım adım doldurun.
          </p>
        </div>

        <MultiStepForm />
      </div>
    </BuyerDashboardLayout>
  )
}
