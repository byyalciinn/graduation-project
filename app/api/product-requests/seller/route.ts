import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Satıcı için aktif talepleri getir (teklif durumu ile birlikte)
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

    // Aktif talepleri getir
    const requests = await prisma.productRequest.findMany({
      where: {
        status: "active",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        offers: {
          where: {
            sellerId: user.id,
          },
          select: {
            id: true,
            status: true,
            price: true,
            createdAt: true,
            negotiations: {
              select: {
                id: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Her talep için kullanıcının teklif durumunu ekle
    const requestsWithOfferStatus = requests.map((request) => ({
      ...request,
      hasOffer: request.offers.length > 0,
      myOffer: request.offers[0] || null,
      hasNegotiation: request.offers.length > 0 && request.offers[0].negotiations.length > 0,
    }))

    return NextResponse.json(requestsWithOfferStatus)
  } catch (error) {
    console.error("Error fetching product requests:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
