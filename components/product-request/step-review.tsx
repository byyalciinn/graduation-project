"use client"

import { UseFormReturn } from "react-hook-form"
import { ProductRequestFormData } from "./multi-step-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Package, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Image as ImageIcon,
  Tag,
  FileText,
  Hash
} from "lucide-react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

interface StepReviewProps {
  form: UseFormReturn<ProductRequestFormData>
}

export function StepReview({ form }: StepReviewProps) {
  const formData = form.getValues()
  const dynamicFields = formData.dynamicFields as any

  return (
    <div className="space-y-6">
      <div className="bg-[#770022]/5 p-6 rounded-lg border border-[#770022]/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#770022] rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#4A0F1C]">Almost there! 🎉</h3>
            <p className="text-sm text-[#6C1A2C] mt-1">
              Review the information below and click "Submit Request" to send it to sellers.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Product Name</p>
            <p className="font-medium">{formData.productName}</p>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <Badge variant="secondary" className="mt-1">
              <Tag className="w-3 h-3 mr-1" />
              {formData.category}
            </Badge>
          </div>

          {dynamicFields?.warrantyStatus && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Warranty Status</p>
                <Badge variant="outline" className="mt-1">
                  {dynamicFields.warrantyStatus}
                </Badge>
              </div>
            </>
          )}
          
          <Separator />
          
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-sm mt-1 whitespace-pre-wrap">{formData.description}</p>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm text-muted-foreground">Requested Quantity</p>
            <p className="font-medium flex items-center gap-1">
              <Hash className="w-4 h-4" />
              {formData.quantity} pcs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Location & Budget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location & Budget
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Delivery Location</p>
            <p className="font-medium">
              {formData.deliveryCity} / {formData.deliveryDistrict}
            </p>
          </div>
          
          {formData.maxBudget && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Maximum Budget</p>
                <p className="font-medium flex items-center gap-1 text-[#770022]">
                  <DollarSign className="w-4 h-4" />
                  {formData.maxBudget.toLocaleString('en-US')} ₺
                </p>
              </div>
            </>
          )}
          
          {formData.offerDeadline && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Offer Deadline</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(formData.offerDeadline, "PPP", { locale: enUS })}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Additional Details */}
      {(formData.exampleImageUrl || formData.brandModel) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.exampleImageUrl && (
              <div>
                <p className="text-sm text-muted-foreground">Sample Image URL</p>
                <a 
                  href={formData.exampleImageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-[#770022] hover:underline break-all"
                >
                  {formData.exampleImageUrl}
                </a>
              </div>
            )}
            
            {formData.brandModel && (
              <>
                {formData.exampleImageUrl && <Separator />}
                <div>
                  <p className="text-sm text-muted-foreground">Brand / Model</p>
                  <p className="font-medium">{formData.brandModel}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="bg-[#770022]/5 p-4 rounded-lg border border-[#770022]/20">
        <p className="text-sm text-[#4A0F1C]">
          <strong>Heads up:</strong> Once your request is submitted, sellers can start sending offers.
          Review them on the "My Offers" page and accept the one that suits you best.
        </p>
      </div>
    </div>
  )
}
