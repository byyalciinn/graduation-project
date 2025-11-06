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
  { value: "elektronik", label: "Elektronik", hasDynamicFields: true },
  { value: "giyim", label: "Giyim" },
  { value: "ev-yasam", label: "Ev & Yaşam" },
  { value: "spor-outdoor", label: "Spor & Outdoor" },
  { value: "kitap-muzik-film", label: "Kitap, Müzik & Film" },
  { value: "otomotiv", label: "Otomotiv" },
  { value: "anne-bebek", label: "Anne & Bebek" },
  { value: "kozmetik", label: "Kozmetik & Kişisel Bakım" },
  { value: "diger", label: "Diğer" },
]

export function StepOne({ form }: StepOneProps) {
  const selectedCategory = form.watch("category")

  // Dinamik alan yönetimi - Elektronik kategorisi için garanti durumu
  const handleCategoryChange = (value: string) => {
    form.setValue("category", value)
    
    // Elektronik seçildiğinde dinamik alan ekle
    if (value === "elektronik") {
      const currentDynamicFields = form.getValues("dynamicFields") || {}
      form.setValue("dynamicFields", {
        ...currentDynamicFields,
        warrantyStatus: "",
      })
    } else {
      // Diğer kategorilerde garanti alanını kaldır
      const currentDynamicFields = form.getValues("dynamicFields") || {}
      const { warrantyStatus, ...rest } = currentDynamicFields as any
      form.setValue("dynamicFields", rest)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Ürün Adı ve Miktar - Yan Yana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <FormLabel>Ürün Adı <span className="text-destructive">*</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Aradığınız ürünün kısa ve öz adını girin</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input placeholder="Örn: iPhone 15 Pro Max" {...field} />
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
                  <FormLabel>İstenen Miktar <span className="text-destructive">*</span></FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Kaç adet ürün talep ettiğinizi belirtin</p>
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

        {/* Kategori */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <FormLabel>Kategori <span className="text-destructive">*</span></FormLabel>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ürünün ait olduğu kategoriyi seçin</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                onValueChange={handleCategoryChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
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

        {/* Dinamik Alan: Garanti Durumu (Sadece Elektronik için) */}
        {selectedCategory === "elektronik" && (
          <FormItem>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <FormLabel>Garanti Durumu</FormLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Elektronik ürünler için garanti durumunu belirtin</p>
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
                  <SelectValue placeholder="Garanti durumu seçin" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="yeni-garantili">Yeni - Garantili</SelectItem>
                <SelectItem value="ikinci-el-garantili">İkinci El - Garantili</SelectItem>
                <SelectItem value="ikinci-el-garantisiz">İkinci El - Garantisiz</SelectItem>
                <SelectItem value="fark-etmez">Fark Etmez</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}

        {/* Açıklama */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <FormLabel>Açıklama/Detaylar <span className="text-destructive">*</span></FormLabel>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ürün durumu ve beklentilerinizi detaylı açıklayın</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Ürün hakkında detaylı bilgi verin (durum, özellikler, beklentiler vb.)"
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
