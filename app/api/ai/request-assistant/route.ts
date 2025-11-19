import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const SYSTEM_PROMPT = `Sen bir B2B tedarik asistanısın. Alıcıların detaylı ürün talepleri oluşturmasına yardımcı oluyorsun.

Görevlerin:
1. Ürün özellikleri hakkında açıklayıcı sorular sormak
2. İlgili kategoriler ve alanlar önermek
3. Tüm kritik bilgilerin toplanmasını sağlamak
4. Eksik veya belirsiz bilgileri tespit etmek
5. Konuşma sonunda tüm toplanan bilgileri özetlemek
6. Sistematik olarak tüm gerekli alanları toplamak

Kurallar:
- Her zaman Türkçe yanıt ver
- Kısa ve öz ol (maksimum 3-4 cümle)
- Somut öneriler sun
- Profesyonel ve yardımsever bir ton kullan
- Bir seferde 1-2 soru sor, kullanıcıyı bunaltma
- Yeterli bilgi toplandığında "Tüm bilgiler toplandı, formu doldurabilirsiniz" ifadesini kullan

Kategoriler:
- elektronik: Bilgisayar, telefon, tablet, elektronik cihazlar (Garanti durumu sor)
- giyim: Tekstil, hazır giyim, ayakkabı, aksesuar
- ev-yasam: Mobilya, ev dekorasyon, beyaz eşya
- spor-outdoor: Spor malzemeleri, kamp ekipmanları
- kitap-muzik-film: Medya ürünleri
- otomotiv: Araç parçaları, aksesuar
- anne-bebek: Bebek ürünleri, oyuncak
- kozmetik: Kişisel bakım, kozmetik ürünler
- diger: Diğer kategoriler

ÖNEMLİ: Toplanması ZORUNLU olan bilgiler (sırayla sor):
1. Ürün adı (productName) - Marka ve model dahil
2. Miktar (quantity) - Kaç adet?
3. Kategori (category) - Yukarıdaki kategorilerden biri
4. Detaylı açıklama (description) - Özellikler, gereksinimler
5. Garanti durumu (warrantyStatus) - Elektronik için: "Var" veya "Yok"
6. Teslimat şehri (deliveryCity) - Türkiye'deki bir şehir
7. Teslimat ilçesi (deliveryDistrict) - Seçilen şehirdeki bir ilçe
8. Maksimum bütçe (maxBudget) - TL cinsinden (opsiyonel ama önerilir)
9. Teklif son tarihi (offerDeadline) - Tarih formatı: GG/AA/YYYY
10. Örnek ürün görsel linki (exampleImageUrl) - Opsiyonel
11. Marka/Model numarası (brandModel) - Varsa

Bütçe hakkında:
- Eğer kullanıcı bütçe bilmiyorsa, "Fiyat araştırması yapabilirsiniz" önerisinde bulun
- Piyasa fiyatları hakkında genel bilgi ver`

export async function POST(req: Request) {
  try {
    const { messages, currentFormData } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Build conversation context
    const conversationHistory = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    // Add form context
    const formContext = `\n\nMevcut form verileri:\n${JSON.stringify(currentFormData, null, 2)}`
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Anladım! Ürün talebinizi oluşturmanıza yardımcı olmak için hazırım. Hangi ürünü satın almak istiyorsunuz?" }],
        },
        ...conversationHistory,
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    })

    const lastMessage = messages[messages.length - 1]?.content || ""
    const result = await chat.sendMessage(lastMessage + formContext)
    const response = result.response.text()

    // Extract suggestions from response and conversation history
    const fullConversation = messages.map((m: any) => m.content).join(" ") + " " + response
    const suggestions = extractFormSuggestions(response, fullConversation, currentFormData)

    return NextResponse.json({
      message: response,
      suggestions,
    })
  } catch (error) {
    console.error("Error in AI assistant:", error)
    return NextResponse.json(
      { error: "AI assistant error occurred" },
      { status: 500 }
    )
  }
}

function extractFormSuggestions(aiResponse: string, fullConversation: string, currentFormData: any) {
  const suggestions: any = {}
  const textToAnalyze = fullConversation.toLowerCase()

  // Category detection
  const categories = [
    "elektronik", "giyim", "ev-yasam", "spor-outdoor",
    "kitap-muzik-film", "otomotiv", "anne-bebek", "kozmetik", "diger"
  ]
  
  for (const category of categories) {
    if (textToAnalyze.includes(category)) {
      suggestions.category = category
      break
    }
  }

  // Product name extraction - improved patterns
  const productPatterns = [
    /(?:almak istiyorum|satın almak|ihtiyacım var|arıyorum|talep ediyorum)\s+([A-Za-zğüşıöçĞÜŞİÖÇ0-9\s-]+?)(?:\s+(?:adet|için|,|\.|$))/i,
    /([A-Z][a-z]+(?:\s+[A-Z0-9][a-z0-9-]*)+)/g,
    /(ürün|product)\s*:?\s*([A-Za-zğüşıöçĞÜŞİÖÇ0-9\s-]+)/i
  ]
  
  for (const pattern of productPatterns) {
    const match = fullConversation.match(pattern)
    if (match) {
      const productName = (match[1] || match[2] || "").trim()
      if (productName.length > 2 && !productName.match(/^\d+$/)) {
        suggestions.productName = productName
        break
      }
    }
  }

  // Quantity extraction - improved
  const quantityMatch = fullConversation.match(/(\d+)\s*(?:adet|piece|pcs|tane|unit)/i)
  if (quantityMatch) {
    suggestions.quantity = parseInt(quantityMatch[1])
  }

  // Description extraction - improved
  const descriptionParts: string[] = []
  
  // Extract specification sentences
  const specs = fullConversation.match(/(?:RAM|işlemci|ekran|boyut|renk|özellik|malzeme|materyal|kapasit|güç|performans)[^.!?]*[.!?]/gi)
  if (specs) {
    descriptionParts.push(...specs)
  }
  
  // Extract requirement sentences
  const requirements = fullConversation.match(/(?:olmalı|gerekli|istiyorum|lazim|ihtiyaç)[^.!?]*[.!?]/gi)
  if (requirements) {
    descriptionParts.push(...requirements.slice(0, 2))
  }
  
  if (descriptionParts.length > 0) {
    suggestions.description = descriptionParts.join(" ").trim().substring(0, 500)
  }

  // Warranty status
  if (suggestions.category === "elektronik" || textToAnalyze.includes("garanti")) {
    if (textToAnalyze.includes("garantili") || textToAnalyze.includes("garanti var") || textToAnalyze.includes("garanti ile") || textToAnalyze.includes("garanti istiyorum")) {
      suggestions.warrantyStatus = "Var"
    } else if (textToAnalyze.includes("garantisiz") || textToAnalyze.includes("garanti yok") || textToAnalyze.includes("garanti olmadan")) {
      suggestions.warrantyStatus = "Yok"
    }
  }

  // Budget extraction
  const budgetMatch = fullConversation.match(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)\s*(?:₺|TL|lira|tl)/i)
  if (budgetMatch) {
    const budgetStr = budgetMatch[1].replace(/\./g, "").replace(",", ".")
    suggestions.maxBudget = parseFloat(budgetStr)
  }

  // City detection - all major Turkish cities
  const cities = [
    "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", 
    "Konya", "Gaziantep", "Şanlıurfa", "Kocaeli", "Mersin", "Diyarbakır",
    "Hatay", "Manisa", "Kayseri", "Balıkesir", "Denizli", "Sakarya",
    "Samsun", "Kahramanmaraş", "Van", "Aydın", "Tekirdağ", "Muğla"
  ]
  
  for (const city of cities) {
    if (fullConversation.includes(city)) {
      suggestions.deliveryCity = city
      break
    }
  }

  // District extraction - look for patterns after city
  if (suggestions.deliveryCity) {
    const districtPattern = new RegExp(`${suggestions.deliveryCity}[,\\s]+(\\w+(?:\\s+\\w+)?)`, "i")
    const districtMatch = fullConversation.match(districtPattern)
    if (districtMatch && districtMatch[1]) {
      suggestions.deliveryDistrict = districtMatch[1].trim()
    }
  }

  // Deadline extraction - various date formats
  const datePatterns = [
    /(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/,  // DD/MM/YYYY
    /(\d{1,2})\s+(ocak|\u015fubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)/i,
    /(\d+)\s+gün\s+içinde/i
  ]
  
  for (const pattern of datePatterns) {
    const match = fullConversation.match(pattern)
    if (match) {
      if (match[3]) {
        // DD/MM/YYYY format
        suggestions.offerDeadline = `${match[1]}/${match[2]}/${match[3]}`
      } else if (match[2]) {
        // Turkish month name
        const months: Record<string, string> = {
          "ocak": "01", "şubat": "02", "mart": "03", "nisan": "04",
          "mayıs": "05", "haziran": "06", "temmuz": "07", "ağustos": "08",
          "eylül": "09", "ekim": "10", "kasım": "11", "aralık": "12"
        }
        const month = months[match[2].toLowerCase()]
        if (month) {
          const year = new Date().getFullYear()
          suggestions.offerDeadline = `${match[1]}/${month}/${year}`
        }
      } else if (match[1]) {
        // X days from now
        const days = parseInt(match[1])
        const deadline = new Date()
        deadline.setDate(deadline.getDate() + days)
        suggestions.offerDeadline = deadline.toLocaleDateString("tr-TR")
      }
      break
    }
  }

  // Image URL extraction
  const urlPattern = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp))/i
  const urlMatch = fullConversation.match(urlPattern)
  if (urlMatch) {
    suggestions.exampleImageUrl = urlMatch[1]
  }

  // Brand/Model extraction
  const brandModelPatterns = [
    /(?:marka|brand)[:\s]+([A-Za-z0-9\s-]+?)(?:,|\.|$)/i,
    /(?:model)[:\s]+([A-Za-z0-9\s-]+?)(?:,|\.|$)/i,
  ]
  
  for (const pattern of brandModelPatterns) {
    const match = fullConversation.match(pattern)
    if (match && match[1]) {
      suggestions.brandModel = match[1].trim()
      break
    }
  }

  return suggestions
}
