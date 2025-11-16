import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params for Next.js 15+
    const { id } = await params

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        productRequest: {
          select: {
            productName: true,
            quantity: true,
            deliveryCity: true,
            deliveryDistrict: true,
          },
        },
        seller: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Verify the user is the buyer of this offer's product request
    const productRequest = await prisma.productRequest.findUnique({
      where: { id: offer.productRequestId },
      select: { userId: true },
    })

    if (productRequest?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(offer)
  } catch (error) {
    console.error("Error fetching offer:", error)
    return NextResponse.json(
      { error: "Failed to fetch offer" },
      { status: 500 }
    )
  }
}
