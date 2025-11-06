import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const responseSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
  buyerResponse: z.string().optional(),
})

// POST - Teklifi kabul et veya reddet
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const validatedData = responseSchema.parse(body)

    // Teklifi getir ve kullanıcının bu talebin sahibi olduğunu kontrol et
    const offer = await prisma.offer.findUnique({
      where: { id: params.id },
      include: {
        productRequest: true,
      },
    })

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      )
    }

    if (offer.productRequest.userId !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to respond to this offer" },
        { status: 403 }
      )
    }

    // Teklifi güncelle
    const updatedOffer = await prisma.offer.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        buyerResponse: validatedData.buyerResponse,
        respondedAt: new Date(),
      },
      include: {
        seller: {
          select: {
            name: true,
            email: true,
          },
        },
        productRequest: {
          select: {
            productName: true,
          },
        },
      },
    })

    return NextResponse.json(updatedOffer)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error responding to offer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
