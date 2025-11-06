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
import { CalendarIcon, MapPin, DollarSign, Clock, Info } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface StepTwoProps {
  form: UseFormReturn<ProductRequestFormData>
}

// Türkiye şehirleri (örnek liste - gerçek uygulamada API'den gelebilir)
const cities = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya",
  "Gaziantep", "Şanlıurfa", "Mersin", "Diyarbakır", "Kayseri", "Eskişehir"
].sort()

// İlçeler (şehre göre dinamik olacak - şimdilik örnek)
const districts: Record<string, string[]> = {
  "İstanbul": ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar", "Beyoğlu", "Fatih", "Bakırköy"],
  "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut"],
  "İzmir": ["Konak", "Karşıyaka", "Bornova", "Buca", "Çiğli"],
}

export function StepTwo({ form }: StepTwoProps) {
  const selectedCity = form.watch("deliveryCity")
  const availableDistricts = selectedCity ? districts[selectedCity] || [] : []

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Şehir ve İlçe - Yan Yana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="deliveryCity"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Teslimat Şehri <span className="text-destructive">*</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ürünün teslim edileceği şehir</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    // Şehir değiştiğinde ilçeyi sıfırla
                    form.setValue("deliveryDistrict", "")
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Şehir seçin" />
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
                  <FormLabel>Teslimat İlçesi <span className="text-destructive">*</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{selectedCity ? "İlçe seçin" : "Önce şehir seçin"}</p>
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
                      <SelectValue placeholder="İlçe seçin" />
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

        {/* Bütçe ve Tarih - Yan Yana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxBudget"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Maksimum Bütçe (₺) <span className="text-muted-foreground">(Önerilir)</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bu ürün için ödemeye hazır olduğunuz maksimum tutar</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Örn: 5000"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                    value={field.value || ""}
                  />
                </FormControl>
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
                  <FormLabel>Son Teklif Tarihi <span className="text-muted-foreground">(Önerilir)</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tekliflerin ne zamana kadar kabul edileceği</p>
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
                          format(field.value, "PPP", { locale: tr })
                        ) : (
                          <span>Tarih seçin</span>
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
            <strong>Not:</strong> Konum bilgileri satıcıların size uygun teklifler sunmasına yardımcı olur. 
            Gelecekte Google Maps entegrasyonu ile otomatik tamamlama özelliği eklenecektir.
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}
