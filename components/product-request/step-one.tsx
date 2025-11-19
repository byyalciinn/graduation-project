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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Package, Tag, FileText, Hash, Info } from "lucide-react"

interface StepOneProps {
  form: UseFormReturn<ProductRequestFormData>
}

const categories = [
  { value: "elektronik", label: "Electronics", hasDynamicFields: true },
  { value: "giyim", label: "Apparel" },
  { value: "ev-yasam", label: "Home & Living" },
  { value: "spor-outdoor", label: "Sports & Outdoor" },
  { value: "kitap-muzik-film", label: "Books, Music & Film" },
  { value: "otomotiv", label: "Automotive" },
  { value: "anne-bebek", label: "Mom & Baby" },
  { value: "kozmetik", label: "Cosmetics & Personal Care" },
  { value: "diger", label: "Other" },
]

export function StepOne({ form }: StepOneProps) {
  const selectedCategory = form.watch("category")

  // Dynamic field management - warranty status for electronics
  const handleCategoryChange = (value: string) => {
    form.setValue("category", value)
    
    // If electronics is selected, add warranty dynamic field
    if (value === "elektronik") {
      const currentDynamicFields = form.getValues("dynamicFields") || {}
      form.setValue("dynamicFields", {
        ...currentDynamicFields,
        warrantyStatus: "",
      })
    } else {
      // Remove warranty field for other categories
      const currentDynamicFields = form.getValues("dynamicFields") || {}
      const { warrantyStatus, ...rest } = currentDynamicFields as any
      form.setValue("dynamicFields", rest)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Product name & quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Product Name <span className="text-destructive">*</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Provide a short, descriptive name for the product you need.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input placeholder="e.g., iPhone 15 Pro Max" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Requested Quantity <span className="text-destructive">*</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Specify how many items you would like sellers to quote.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category & Warranty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Category <span className="text-destructive">*</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the category that best fits your product.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  onValueChange={handleCategoryChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedCategory === "elektronik" && (
            <FormItem>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <FormLabel>Warranty Status</FormLabel>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Please specify the warranty status for your electronic product.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                onValueChange={(value) => {
                  const currentDynamicFields = form.getValues("dynamicFields") || {}
                  form.setValue("dynamicFields", {
                    ...currentDynamicFields,
                    warrantyStatus: value,
                  })
                }}
                defaultValue={
                  (form.getValues("dynamicFields") as any)?.warrantyStatus || ""
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warranty status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yeni-garantili">New - Under Warranty</SelectItem>
                  <SelectItem value="ikinci-el-garantili">Pre-owned - Under Warranty</SelectItem>
                  <SelectItem value="ikinci-el-garantisiz">Pre-owned - No Warranty</SelectItem>
                  <SelectItem value="fark-etmez">No Preference</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <FormLabel>Description / Details <span className="text-destructive">*</span></FormLabel>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share condition, expectations, and any important specifics.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Describe condition, features, expectations, etc."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TooltipProvider>
  )
}
