import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Simple in-memory cache (5 minutes TTL)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function POST(req: Request) {
  try {
    const { offers, productRequest } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    if (!offers || offers.length === 0) {
      return NextResponse.json(
        { error: "No offers provided" },
        { status: 400 }
      )
    }

    // Create cache key from offers
    const cacheKey = `compare_${offers.map((o: any) => o.id).sort().join("_")}`
    
    // Check cache
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        data: cached.data,
        cached: true
      })
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3, // Lower for consistent analysis
        maxOutputTokens: 500,
      }
    })

    // Ultra-compact prompt - minimize tokens
    const offersSummary = offers.slice(0, 10).map((o: any, i: number) => 
      `${i+1}. ${o.price}₺ (${Math.round(o.price/productRequest.quantity)}₺/adet) - ${o.deliveryTime}gün`
    ).join("\n")

    const prompt = `Talep: ${productRequest.productName} (${productRequest.quantity} adet, max ${productRequest.maxBudget || "?"}₺)

Teklifler:
${offersSummary}

JSON dön:
{
  "topPicks": [1,2,3],
  "bestValue": 1,
  "fastestDelivery": 1,
  "analysis": "50 kelime özet",
  "recommendation": "Hangisi neden?"
}`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Parse JSON
    let analysisData
    try {
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        throw new Error("Could not parse analysis data")
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      
      // Fallback: basic analysis
      const sorted = [...offers].sort((a, b) => a.price - b.price)
      analysisData = {
        topPicks: [0, 1, 2],
        bestValue: 0,
        fastestDelivery: offers.reduce((min: any, curr: any, idx: number) => 
          curr.deliveryTime < offers[min].deliveryTime ? idx : min, 0
        ),
        analysis: "Fiyat ve teslimat süresine göre sıralandı.",
        recommendation: "En düşük fiyatlı teklifi değerlendirin."
      }
    }

    // Cache result
    cache.set(cacheKey, {
      data: analysisData,
      timestamp: Date.now()
    })

    // Clean old cache entries
    if (cache.size > 100) {
      const now = Date.now()
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          cache.delete(key)
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: analysisData,
      cached: false
    })

  } catch (error) {
    console.error("Error in offer comparison:", error)
    return NextResponse.json(
      { error: "Offer comparison failed" },
      { status: 500 }
    )
  }
}
