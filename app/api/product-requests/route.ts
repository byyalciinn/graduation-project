import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const productRequestSchema = z.object({
  productName: z.string().min(3),
  category: z.string().min(1),
  description: z.string().min(10),
  quantity: z.number().min(1),
  maxBudget: z.number().optional().nullable(),
  deliveryCity: z.string().min(1),
  deliveryDistrict: z.string().min(1),
  offerDeadline: z.string().optional().nullable().transform((val) => val ? new Date(val) : null),
  exampleImageUrl: z.string().optional().nullable(),
  brandModel: z.string().optional().nullable(),
  dynamicFields: z.record(z.any()).optional().nullable(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = productRequestSchema.parse(body)

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Ürün talebini oluştur
    const productRequest = await prisma.productRequest.create({
      data: {
        userId: user.id,
        productName: validatedData.productName,
        category: validatedData.category,
        description: validatedData.description,
        quantity: validatedData.quantity,
        maxBudget: validatedData.maxBudget,
        deliveryCity: validatedData.deliveryCity,
        deliveryDistrict: validatedData.deliveryDistrict,
        offerDeadline: validatedData.offerDeadline,
        exampleImageUrl: validatedData.exampleImageUrl || null,
        brandModel: validatedData.brandModel || null,
        dynamicFields: validatedData.dynamicFields || null,
        status: "active",
      },
    })

    return NextResponse.json(
      { 
        success: true, 
        data: productRequest,
        message: "Talep başarıyla oluşturuldu" 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Product request creation error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Kullanıcının tüm taleplerini getir
    const productRequests = await prisma.productRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: productRequests,
    })
  } catch (error) {
    console.error("Product requests fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
