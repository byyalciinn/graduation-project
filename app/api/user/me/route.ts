import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Fetch full user data with all fields
    const fullUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!fullUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Return selected fields from full user
    // Type assertion needed until Prisma client types are refreshed in IDE
    const userData = fullUser as any
    return NextResponse.json({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
      role: userData.role,
      categories: userData.categories,
      city: userData.city,
      postalCode: userData.postalCode,
      notifications: userData.notifications,
      bio: userData.bio,
      onboardingCompleted: userData.onboardingCompleted,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
