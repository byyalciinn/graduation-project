import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const offerSchema = z.object({
  productRequestId: z.string(),
  price: z.number().positive(),
  deliveryTime: z.number().int().positive(),
  message: z.string().optional(),
})

// GET - Satıcının gönderdiği teklifleri getir
export async function GET(request: Request) {
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

    const offers = await prisma.offer.findMany({
      where: {
        sellerId: user.id,
      },
      include: {
        productRequest: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(offers)
  } catch (error) {
    console.error("Error fetching offers:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Yeni teklif gönder
export async function POST(request: Request) {
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

    const body = await request.json()
    const validatedData = offerSchema.parse(body)

    // Talep var mı kontrol et
    const productRequest = await prisma.productRequest.findUnique({
      where: { id: validatedData.productRequestId },
    })

    if (!productRequest) {
      return NextResponse.json(
        { error: "Product request not found" },
        { status: 404 }
      )
    }

    // Daha önce teklif verilmiş mi kontrol et
    const existingOffer = await prisma.offer.findFirst({
      where: {
        productRequestId: validatedData.productRequestId,
        sellerId: user.id,
      },
    })

    if (existingOffer) {
      return NextResponse.json(
        { error: "You have already submitted an offer for this request" },
        { status: 400 }
      )
    }

    // Yeni teklif oluştur
    const offer = await prisma.offer.create({
      data: {
        productRequestId: validatedData.productRequestId,
        sellerId: user.id,
        price: validatedData.price,
        deliveryTime: validatedData.deliveryTime,
        message: validatedData.message,
      },
      include: {
        productRequest: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(offer, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating offer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
