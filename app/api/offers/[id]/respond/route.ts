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
  { params }: { params: Promise<{ id: string }> }
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

    // Await params for Next.js 15+
    const { id } = await params

    // Teklifi getir ve kullanıcının bu talebin sahibi olduğunu kontrol et
    const offer = await prisma.offer.findUnique({
      where: { id },
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
      where: { id },
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

    // If offer is accepted, create a payment record and order
    if (validatedData.status === "accepted") {
      const payment = await prisma.payment.create({
        data: {
          offerId: id,
          buyerId: user.id,
          amount: offer.price,
          status: "pending",
        },
      })

      // Generate unique order number
      const orderCount = await prisma.order.count()
      const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(3, '0')}`

      // Create order with initial timeline
      const initialTimeline = [
        {
          id: "placed",
          label: "Order Placed",
          description: "Your order has been confirmed",
          timestamp: new Date().toISOString(),
          completed: true,
          current: true,
        },
        {
          id: "processing",
          label: "Processing",
          description: "Seller is preparing your order",
          completed: false,
          current: false,
        },
        {
          id: "shipped",
          label: "Shipped",
          description: "Your order is on the way",
          completed: false,
          current: false,
        },
        {
          id: "delivered",
          label: "Delivered",
          description: "Order delivered to your address",
          completed: false,
          current: false,
        },
      ]

      await prisma.order.create({
        data: {
          buyerId: user.id,
          offerId: id,
          paymentId: payment.id,
          orderNumber,
          productName: offer.productRequest.productName,
          totalAmount: offer.price,
          currentStatus: "placed",
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          timelineEvents: initialTimeline,
        },
      })
    }

    return NextResponse.json(updatedOffer)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error responding to offer:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
