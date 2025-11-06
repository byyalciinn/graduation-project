"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Package, MapPin, ImageIcon, Eye } from "lucide-react"
import { StepOne } from "./step-one"
import { StepTwo } from "./step-two"
import { StepThree } from "./step-three"
import { StepReview } from "./step-review"

// Form validation schema
const formSchema = z.object({
  // Step 1: Temel Bilgiler
  productName: z.string().min(3, "Ürün adı en az 3 karakter olmalıdır"),
  category: z.string().min(1, "Kategori seçimi zorunludur"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  quantity: z.number().min(1, "Miktar en az 1 olmalıdır"),
  
  // Step 2: Konum ve Bütçe
  maxBudget: z.number().optional().nullable(),
  deliveryCity: z.string().min(1, "Şehir seçimi zorunludur"),
  deliveryDistrict: z.string().min(1, "İlçe seçimi zorunludur"),
  offerDeadline: z.date().optional().nullable(),
  
  // Step 3: Görsel ve Ek Bilgiler
  exampleImageUrl: z.string().optional().nullable(),
  brandModel: z.string().optional().nullable(),
  
  // Dinamik alanlar
  dynamicFields: z.record(z.any()).optional().nullable(),
})

export type ProductRequestFormData = z.infer<typeof formSchema>

const steps = [
  { id: 1, name: "Temel Bilgiler", description: "Ürün detayları", icon: Package },
  { id: 2, name: "Konum ve Bütçe", description: "Teslimat ve fiyat", icon: MapPin },
  { id: 3, name: "Görsel ve Ek Bilgiler", description: "Opsiyonel bilgiler", icon: ImageIcon },
  { id: 4, name: "Önizleme", description: "Kontrol ve gönder", icon: Eye },
]

export function MultiStepForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProductRequestFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      category: "",
      description: "",
      quantity: 1,
      maxBudget: null,
      deliveryCity: "",
      deliveryDistrict: "",
      offerDeadline: null,
      exampleImageUrl: null,
      brandModel: null,
      dynamicFields: null,
    },
    mode: "onChange",
  })

  const progress = (currentStep / steps.length) * 100

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProductRequestFormData)[] = []
    
    if (currentStep === 1) {
      fieldsToValidate = ["productName", "category", "description", "quantity"]
    } else if (currentStep === 2) {
      fieldsToValidate = ["deliveryCity", "deliveryDistrict"]
    }

    const isValid = await form.trigger(fieldsToValidate)
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: ProductRequestFormData) => {
    console.log("onSubmit called with data:", data)
    setIsSubmitting(true)
    
    try {
      // Tarihi ISO string'e çevir
      const submitData = {
        ...data,
        offerDeadline: data.offerDeadline ? data.offerDeadline.toISOString() : undefined,
      }

      console.log("Submitting data to API:", submitData)

      const response = await fetch("/api/product-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()
      console.log("Response:", result)

      if (!response.ok) {
        const errorMessage = result.details 
          ? `Validation error: ${JSON.stringify(result.details)}` 
          : result.error || "Talep oluşturulurken bir hata oluştu"
        throw new Error(errorMessage)
      }

      // Başarılı, talep listesine yönlendir
      alert("Talep başarıyla oluşturuldu!")
      router.push("/buyer-dashboard/requests?success=true")
      router.refresh()
    } catch (error) {
      console.error("Form submission error:", error)
      alert(`Bir hata oluştu: ${error instanceof Error ? error.message : "Lütfen tekrar deneyin."}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index !== steps.length - 1 ? "flex-1" : ""
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep > step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "border-primary text-primary bg-primary/10"
                      : "border-muted text-muted-foreground bg-muted/30"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="mt-2 text-center hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="mt-4" />
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {currentStep === 1 && <StepOne form={form} />}
              {currentStep === 2 && <StepTwo form={form} />}
              {currentStep === 3 && <StepThree form={form} />}
              {currentStep === 4 && <StepReview form={form} />}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Önceki
                </Button>

                {currentStep < steps.length ? (
                  <Button type="button" onClick={nextStep}>
                    Sonraki
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    onClick={() => console.log("Button clicked!", form.formState.errors)}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      "Talebi Gönder"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
