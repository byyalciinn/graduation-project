import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { productRequest, sellerProfile } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    if (!productRequest) {
      return NextResponse.json(
        { error: "Product request data is required" },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 400, // Limit output
      }
    })

    // Compact prompt - minimize tokens
    const prompt = `B2B teklif oluştur:

Ürün: ${productRequest.productName}
Miktar: ${productRequest.quantity}
Bütçe: ${productRequest.maxBudget || "?"} ₺
Lokasyon: ${productRequest.deliveryCity}

JSON dön:
{
  "price": ${productRequest.maxBudget ? Math.round(productRequest.maxBudget * 0.85) : "?"}, 
  "deliveryTime": 7-14,
  "message": "Kısa profesyonel mesaj (100 kelime)"
}`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Try to parse JSON from response
    let offerData
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        offerData = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        throw new Error("Could not parse offer data")
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      return NextResponse.json(
        { 
          error: "Could not parse offer generation results",
          rawResponse: response 
        },
        { status: 500 }
      )
    }

    // Validate and sanitize data
    if (!offerData.price || !offerData.deliveryTime || !offerData.message) {
      return NextResponse.json(
        { error: "Incomplete offer data from AI" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        price: Math.round(offerData.price),
        unitPrice: offerData.unitPrice ? Math.round(offerData.unitPrice) : Math.round(offerData.price / productRequest.quantity),
        deliveryTime: Math.min(Math.max(offerData.deliveryTime, 1), 90), // 1-90 days
        message: offerData.message.trim(),
        confidence: offerData.confidence || "medium",
        reasoning: offerData.reasoning || ""
      },
      rawResponse: response
    })

  } catch (error) {
    console.error("Error in offer generation:", error)
    return NextResponse.json(
      { error: "Offer generation failed" },
      { status: 500 }
    )
  }
}
