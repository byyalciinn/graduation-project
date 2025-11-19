import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { productName } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    if (!productName) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `Sen bir B2B fiyat araştırma uzmanısın. Sadece ürün adını kullanarak Türkiye pazarındaki toptan fiyatları tahmin et.

Ürün: ${productName}

Yanıtını JSON olarak dön:
{
  "minPrice": number,
  "maxPrice": number,
  "recommendedBudget": number,
  "explanation": "kısa metin",
  "confidence": "high|medium|low"
}`

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Try to parse JSON from response
    let priceData
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        priceData = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        // Fallback: try to extract numbers from text
        const numbers = response.match(/\d+(?:\.\d+)?/g)
        if (numbers && numbers.length >= 2) {
          priceData = {
            minPrice: parseFloat(numbers[0]),
            maxPrice: parseFloat(numbers[1]),
            recommendedBudget: parseFloat(numbers[1]),
            explanation: response,
            confidence: "medium"
          }
        } else {
          throw new Error("Could not parse price data")
        }
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      return NextResponse.json(
        { 
          error: "Could not parse price research results",
          rawResponse: response 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: priceData,
      rawResponse: response
    })

  } catch (error) {
    console.error("Error in price research:", error)
    return NextResponse.json(
      { error: "Price research failed" },
      { status: 500 }
    )
  }
}
