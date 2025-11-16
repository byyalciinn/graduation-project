import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch all orders for authenticated buyer
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch actual orders
    const orders = await prisma.order.findMany({
      where: { buyerId: user.id },
      include: {
        offer: {
          include: {
            productRequest: {
              select: {
                productName: true,
              },
            },
          },
        },
        payment: {
          select: {
            amount: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // If no orders exist, fetch payments and transform them to order format
    if (orders.length === 0) {
      const payments = await prisma.payment.findMany({
        where: { 
          buyerId: user.id,
          status: "completed"
        },
        include: {
          offer: {
            include: {
              productRequest: {
                select: {
                  productName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      // Transform payments to order format
      const transformedOrders = payments.map((payment: any, index: number) => ({
        id: payment.id,
        productName: payment.offer.productRequest.productName,
        orderNumber: `ORD-${new Date().getFullYear()}-${String(index + 1).padStart(3, '0')}`,
        totalAmount: payment.amount,
        currentStatus: payment.status === "completed" ? "processing" : "placed",
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        timelineEvents: null,
        createdAt: payment.createdAt.toISOString(),
      }))

      return NextResponse.json(transformedOrders)
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
