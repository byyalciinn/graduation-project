import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch negotiations for an offer
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const offerId = searchParams.get("offerId")

    if (!offerId) {
      return NextResponse.json({ error: "Offer ID required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify user has access to this offer
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        productRequest: true,
        seller: true,
      },
    })

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Check if user is buyer or seller
    const isBuyer = offer.productRequest.userId === user.id
    const isSeller = offer.sellerId === user.id

    if (!isBuyer && !isSeller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Fetch negotiations
    const negotiations = await prisma.negotiation.findMany({
      where: { offerId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(negotiations)
  } catch (error) {
    console.error("Error fetching negotiations:", error)
    return NextResponse.json(
      { error: "Failed to fetch negotiations" },
      { status: 500 }
    )
  }
}

// POST - Create new negotiation message
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { offerId, message, proposedPrice, proposedDelivery, isAiGenerated } = body

    if (!offerId || !message) {
      return NextResponse.json(
        { error: "Offer ID and message required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify user has access to this offer
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        productRequest: true,
      },
    })

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    const isBuyer = offer.productRequest.userId === user.id
    const isSeller = offer.sellerId === user.id

    if (!isBuyer && !isSeller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create negotiation
    const negotiation = await prisma.negotiation.create({
      data: {
        offerId,
        senderId: user.id,
        message,
        proposedPrice: proposedPrice ? parseFloat(proposedPrice) : null,
        proposedDelivery: proposedDelivery ? parseInt(proposedDelivery) : null,
        isAiGenerated: isAiGenerated || false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(negotiation)
  } catch (error) {
    console.error("Error creating negotiation:", error)
    return NextResponse.json(
      { error: "Failed to create negotiation" },
      { status: 500 }
    )
  }
}
