import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Alıcının taleplerine gelen teklifleri getir
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

    // Kullanıcının taleplerine gelen teklifleri getir
    const offers = await prisma.offer.findMany({
      where: {
        productRequest: {
          userId: user.id,
        },
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        productRequest: {
          select: {
            id: true,
            productName: true,
            category: true,
            quantity: true,
            maxBudget: true,
            deliveryCity: true,
            deliveryDistrict: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(offers)
  } catch (error) {
    console.error("Error fetching buyer offers:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
