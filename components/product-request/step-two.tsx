"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { ProductRequestFormData } from "./multi-step-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, MapPin, DollarSign, Clock, Info, Sparkles, Loader2, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface StepTwoProps {
  form: UseFormReturn<ProductRequestFormData>
}

// Turkish cities sample list (in a real app this would come from an API)
const cities = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya",
  "Gaziantep", "Şanlıurfa", "Mersin", "Diyarbakır", "Kayseri", "Eskişehir"
].sort()

// Districts (sample data, would be dynamic per city)
const districts: Record<string, string[]> = {
  "İstanbul": ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar", "Beyoğlu", "Fatih", "Bakırköy"],
  "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut"],
  "İzmir": ["Konak", "Karşıyaka", "Bornova", "Buca", "Çiğli"],
}

export function StepTwo({ form }: StepTwoProps) {
  const selectedCity = form.watch("deliveryCity")
  const availableDistricts = selectedCity ? districts[selectedCity] || [] : []
  const [priceResearching, setPriceResearching] = useState(false)
  const [priceResult, setPriceResult] = useState<any>(null)

  const handlePriceResearch = async () => {
    const productName = form.getValues("productName")
    const quantity = form.getValues("quantity")
    const category = form.getValues("category")

    if (!productName) {
      alert("Önce ürün adını girmelisiniz!")
      return
    }

    setPriceResearching(true)
    setPriceResult(null)

    try {
      const response = await fetch("/api/ai/price-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, quantity, category }),
      })

      if (!response.ok) {
        throw new Error("Price research failed")
      }

      const data = await response.json()
      setPriceResult(data.data)
      
      // Auto-fill recommended budget
      if (data.data.recommendedBudget) {
        form.setValue("maxBudget", data.data.recommendedBudget)
      }
    } catch (error) {
      console.error("Price research error:", error)
      alert("Fiyat araştırması başarısız oldu. Lütfen tekrar deneyin.")
    } finally {
      setPriceResearching(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* City & district */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="deliveryCity"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Delivery City <span className="text-destructive">*</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The city where the item should be delivered.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    // Reset district when city changes
                    form.setValue("deliveryDistrict", "")
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryDistrict"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Delivery District <span className="text-destructive">*</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{selectedCity ? "Select the district" : "Choose a city first"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedCity || availableDistricts.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Budget & deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxBudget"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Maximum Budget (₺) <span className="text-muted-foreground">(Optional)</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The highest amount you are ready to pay for this product.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 5000"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handlePriceResearch}
                    disabled={priceResearching}
                    className="flex-shrink-0 border-emerald-200 hover:bg-emerald-50"
                  >
                    {priceResearching ? (
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                    )}
                  </Button>
                </div>
                <FormDescription className="text-xs text-emerald-700">
                  🤖 Ne kadar fiyat yazacağınızı bilmiyor musunuz? Yanındaki butona basın, AI sizin için fiyat araştırması yapsın!
                </FormDescription>
                {priceResult && (
                  <Alert className="mt-2 border-emerald-200 bg-emerald-50">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-sm">
                      <div className="space-y-1">
                        <p className="font-semibold text-emerald-900">
                          Önerilen Bütçe: {priceResult.recommendedBudget?.toLocaleString("tr-TR")} ₺
                        </p>
                        <p className="text-emerald-700">
                          Fiyat Aralığı: {priceResult.minPrice?.toLocaleString("tr-TR")} - {priceResult.maxPrice?.toLocaleString("tr-TR")} ₺
                        </p>
                        {priceResult.explanation && (
                          <p className="text-xs text-emerald-600 mt-1">
                            {priceResult.explanation}
                          </p>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="offerDeadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Offer Deadline <span className="text-muted-foreground">(Optional)</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Set the latest date you can accept offers.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: enUS })
                        ) : (
                          <span>Select a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Accurate location details help sellers offer realistic shipping and pricing options. 
            A future Google Maps integration will add address auto-complete.
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}
