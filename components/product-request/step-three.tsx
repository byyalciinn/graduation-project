"use client"

import { UseFormReturn } from "react-hook-form"
import { ProductRequestFormData } from "./multi-step-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { ImageIcon, Package, Info } from "lucide-react"

interface StepThreeProps {
  form: UseFormReturn<ProductRequestFormData>
}

export function StepThree({ form }: StepThreeProps) {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="bg-[#770022]/5 p-4 rounded-lg border border-[#770022]/20">
          <div className="flex items-start gap-3">
            <ImageIcon className="w-5 h-5 text-[#770022] mt-0.5" />
            <div>
              <h4 className="font-medium text-[#4A0F1C]">Optional Information</h4>
              <p className="text-sm text-[#6C1A2C] mt-1">
                Everything on this step is optional, but providing details helps sellers craft more accurate offers.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="exampleImageUrl"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Sample Product Image URL</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Link to a reference photo that represents the product you need.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/product-image.jpg"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brandModel"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Brand / Model Number</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Provide the exact brand/model code if you have one.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g., Apple iPhone 15 Pro Max 256GB"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-[#770022]/5 p-6 rounded-lg border border-[#770022]/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#770022]/15 rounded-lg">
              <Package className="w-6 h-6 text-[#770022]" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2 text-[#4A0F1C]">Why provide these details?</h4>
              <ul className="space-y-2 text-sm text-[#6C1A2C]">
                <li className="flex items-start gap-2">
                  <span className="text-[#770022] mt-1">•</span>
                  <span>A sample image ensures sellers understand exactly what you want.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#770022] mt-1">•</span>
                  <span>Brand/model info helps you receive precise pricing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#770022] mt-1">•</span>
                  <span>Extra context prevents misunderstandings and back-and-forth.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
