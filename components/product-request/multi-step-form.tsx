"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Package, MapPin, ImageIcon, Eye, Sparkles } from "lucide-react"
import { StepOne } from "./step-one"
import { StepTwo } from "./step-two"
import { StepThree } from "./step-three"
import { StepReview } from "./step-review"
import { AIAssistant } from "./ai-assistant"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Form validation schema
const formSchema = z.object({
  // Step 1: Basic Information
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  category: z.string().min(1, "Category selection is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  
  // Step 2: Location and Budget
  maxBudget: z.number().optional().nullable(),
  deliveryCity: z.string().min(1, "City selection is required"),
  deliveryDistrict: z.string().min(1, "District selection is required"),
  offerDeadline: z.date().optional().nullable(),
  
  // Step 3: Images and Additional Info
  exampleImageUrl: z.string().optional().nullable(),
  brandModel: z.string().optional().nullable(),
  
  // Dynamic fields
  dynamicFields: z.record(z.any()).optional().nullable(),
})

export type ProductRequestFormData = z.infer<typeof formSchema>

const steps = [
  { id: 1, name: "Basic Information", description: "Product details", icon: Package },
  { id: 2, name: "Location & Budget", description: "Delivery and price", icon: MapPin },
  { id: 3, name: "Images & Additional Info", description: "Optional information", icon: ImageIcon },
  { id: 4, name: "Preview", description: "Review and submit", icon: Eye },
]

interface MultiStepFormProps {
  assistantOpen?: boolean
  setAssistantOpen?: (open: boolean) => void
}

export function MultiStepForm({ assistantOpen, setAssistantOpen }: MultiStepFormProps) {
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

  // Listen for AI suggestions from modal
  useEffect(() => {
    const handleAISuggestions = async () => {
      const suggestionsStr = localStorage.getItem("aiSuggestions")
      if (suggestionsStr) {
        try {
          const suggestions = JSON.parse(suggestionsStr)
          Object.entries(suggestions).forEach(([field, value]) => {
            if (field === "warrantyStatus") {
              form.setValue("dynamicFields", { warrantyStatus: value })
            } else if (field === "offerDeadline" && typeof value === "string") {
              // Parse date string to Date object
              const parts = value.split("/")
              if (parts.length === 3) {
                const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
                form.setValue("offerDeadline", date, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            } else {
              form.setValue(field as keyof ProductRequestFormData, value as any, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          })
          localStorage.removeItem("aiSuggestions")

          // Check if all required fields are filled
          setTimeout(async () => {
            const requiredFields: (keyof ProductRequestFormData)[] = [
              "productName", "category", "description", "quantity",
              "deliveryCity", "deliveryDistrict"
            ]
            
            const allFilled = requiredFields.every(field => {
              const value = form.getValues(field)
              return value !== "" && value !== null && value !== undefined
            })

            if (allFilled) {
              // Validate and progress to preview
              const isValid = await form.trigger(requiredFields)
              if (isValid) {
                setCurrentStep(4) // Jump to preview
              }
            }
          }, 500)
        } catch (error) {
          console.error("Error parsing AI suggestions:", error)
        }
      }
    }

    window.addEventListener("aiSuggestionsReady", handleAISuggestions)
    return () => window.removeEventListener("aiSuggestionsReady", handleAISuggestions)
  }, [form, setCurrentStep])

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

  const handleApplySuggestion = (field: string, value: any) => {
    form.setValue(field as keyof ProductRequestFormData, value, {
      shouldValidate: true,
      shouldDirty: true,
    })
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
          : result.error || "An error occurred while creating the request"
        throw new Error(errorMessage)
      }

      // Success, redirect to request list
      alert("Request created successfully!")
      router.push("/buyer-dashboard/requests?success=true")
      router.refresh()
    } catch (error) {
      console.error("Form submission error:", error)
      alert(`An error occurred: ${error instanceof Error ? error.message : "Please try again."}`)
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
                      ? "bg-[#770022] border-[#770022] text-white"
                      : currentStep === step.id
                      ? "border-[#770022] text-[#770022] bg-[#770022]/10"
                      : "border-gray-300 text-gray-400 bg-gray-50"
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
                        ? "text-[#1F1B24]"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {step.description}
                  </p>
                </div>
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-[#770022]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="mt-4 bg-[#770022]/20 [&>div]:bg-[#770022]" />
      </div>

      {/* Form Content */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-xl font-semibold text-[#1F1B24]">{steps[currentStep - 1].name}</CardTitle>
          <CardDescription className="text-gray-600">{steps[currentStep - 1].description}</CardDescription>
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
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-[#770022] hover:bg-[#5a0019] text-white"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    onClick={() => console.log("Button clicked!", form.formState.errors)}
                    className="bg-[#770022] hover:bg-[#5a0019] text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
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
