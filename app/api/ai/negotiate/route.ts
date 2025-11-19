import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { offer, negotiationHistory, userType, userMessage } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    if (!offer || !userType) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 300,
      }
    })

    // Ultra-compact prompt for negotiation
    const isBuyer = userType === "buyer"
    const currentPrice = offer.price
    const budget = offer.productRequest?.maxBudget || currentPrice * 1.2

    const historyText = negotiationHistory?.slice(-3).map((n: any) => 
      `${n.sender}: ${n.message}${n.proposedPrice ? ` (${n.proposedPrice}₺)` : ""}`
    ).join("\n") || "Yeni müzakere"

    const prompt = `${isBuyer ? "Alıcı" : "Satıcı"} müzakere önerisi:

Teklif: ${currentPrice}₺
Bütçe: ${budget}₺
Son mesajlar:
${historyText}

Kullanıcı: ${userMessage || "Öneri iste"}

JSON dön:
{
  "message": "Kısa profesyonel yanıt (50 kelime)",
  "proposedPrice": ${isBuyer ? Math.round(currentPrice * 0.9) : Math.round(currentPrice * 1.05)},
  "strategy": "Neden bu fiyat?"
}`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Parse JSON
    let suggestionData
    try {
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        suggestionData = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        throw new Error("Could not parse suggestion")
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      
      // Fallback suggestion
      suggestionData = {
        message: isBuyer 
          ? `Teklifiniz için teşekkürler. ${Math.round(currentPrice * 0.9)}₺ fiyat konusunda anlaşabilir miyiz?`
          : `Anlayışınız için teşekkürler. ${Math.round(currentPrice * 1.05)}₺ en iyi teklifimiz.`,
        proposedPrice: isBuyer ? Math.round(currentPrice * 0.9) : Math.round(currentPrice * 1.05),
        strategy: "Orta nokta bulma stratejisi"
      }
    }

    return NextResponse.json({
      success: true,
      data: suggestionData
    })

  } catch (error) {
    console.error("Error in negotiation AI:", error)
    return NextResponse.json(
      { error: "Negotiation suggestion failed" },
      { status: 500 }
    )
  }
}
