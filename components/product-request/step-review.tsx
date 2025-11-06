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
import { tr } from "date-fns/locale"

interface StepReviewProps {
  form: UseFormReturn<ProductRequestFormData>
}

export function StepReview({ form }: StepReviewProps) {
  const formData = form.getValues()
  const dynamicFields = formData.dynamicFields as any

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Neredeyse Tamamlandı! 🎉</h3>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Talep bilgilerinizi kontrol edin ve göndermek için "Talebi Gönder" butonuna tıklayın.
            </p>
          </div>
        </div>
      </div>

      {/* Temel Bilgiler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Temel Bilgiler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Ürün Adı</p>
            <p className="font-medium">{formData.productName}</p>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm text-muted-foreground">Kategori</p>
            <Badge variant="secondary" className="mt-1">
              <Tag className="w-3 h-3 mr-1" />
              {formData.category}
            </Badge>
          </div>

          {dynamicFields?.warrantyStatus && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Garanti Durumu</p>
                <Badge variant="outline" className="mt-1">
                  {dynamicFields.warrantyStatus}
                </Badge>
              </div>
            </>
          )}
          
          <Separator />
          
          <div>
            <p className="text-sm text-muted-foreground">Açıklama</p>
            <p className="text-sm mt-1 whitespace-pre-wrap">{formData.description}</p>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm text-muted-foreground">İstenen Miktar</p>
            <p className="font-medium flex items-center gap-1">
              <Hash className="w-4 h-4" />
              {formData.quantity} adet
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Konum ve Bütçe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Konum ve Bütçe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Teslimat Konumu</p>
            <p className="font-medium">
              {formData.deliveryCity} / {formData.deliveryDistrict}
            </p>
          </div>
          
          {formData.maxBudget && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Maksimum Bütçe</p>
                <p className="font-medium flex items-center gap-1 text-green-600 dark:text-green-400">
                  <DollarSign className="w-4 h-4" />
                  {formData.maxBudget.toLocaleString('tr-TR')} ₺
                </p>
              </div>
            </>
          )}
          
          {formData.offerDeadline && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Son Teklif Tarihi</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(formData.offerDeadline, "PPP", { locale: tr })}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Ek Bilgiler */}
      {(formData.exampleImageUrl || formData.brandModel) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Ek Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.exampleImageUrl && (
              <div>
                <p className="text-sm text-muted-foreground">Örnek Resim URL</p>
                <a 
                  href={formData.exampleImageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {formData.exampleImageUrl}
                </a>
              </div>
            )}
            
            {formData.brandModel && (
              <>
                {formData.exampleImageUrl && <Separator />}
                <div>
                  <p className="text-sm text-muted-foreground">Marka / Model</p>
                  <p className="font-medium">{formData.brandModel}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Önemli:</strong> Talebiniz gönderildikten sonra satıcılar size teklif göndermeye başlayacaktır. 
          Teklifleri "Tekliflerim" sayfasından inceleyebilir ve uygun olanı kabul edebilirsiniz.
        </p>
      </div>
    </div>
  )
}
