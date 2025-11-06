import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()

    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user has admin role
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    // Parse query parameters for pagination and filtering
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || ""

    const skip = (page - 1) * limit

    // Build where clause for filtering
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    if (role && role !== "all") {
      where.role = role
    }

    // Fetch users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              productRequests: true,
              sentOffers: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    // Get full user data to access role field
    const usersWithRole = await Promise.all(
      users.map(async (user) => {
        const fullUser = await prisma.user.findUnique({
          where: { id: user.id },
        })
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: (fullUser as any)?.role || null,
          onboardingCompleted: (fullUser as any)?.onboardingCompleted || false,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          requestsCount: user._count.productRequests,
          offersCount: user._count.sentOffers,
        }
      })
    )

    return NextResponse.json({
      users: usersWithRole,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
