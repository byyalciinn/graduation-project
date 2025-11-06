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
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Opsiyonel Bilgiler</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Bu adımdaki tüm alanlar opsiyoneldir. Ancak doldurmanız satıcıların size daha uygun teklifler sunmasına yardımcı olur.
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
                  <FormLabel>Örnek Ürün Resmi URL'si</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Aradığınız ürünün örnek fotoğrafının web adresi (URL)</p>
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
                  <FormLabel>Marka / Model Numarası</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Varsa, ürünün tam marka ve model kodunu belirtin</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    placeholder="Örn: Apple iPhone 15 Pro Max 256GB"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-muted/50 p-6 rounded-lg border border-border">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Neden bu bilgileri vermeliyim?</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Örnek resim, satıcıların tam olarak ne aradığınızı anlamasını sağlar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Marka ve model bilgisi, daha kesin fiyat teklifleri almanızı sağlar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Detaylı bilgi, yanlış anlamaları ve zaman kaybını önler</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
