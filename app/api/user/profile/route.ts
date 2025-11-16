import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch user profile
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
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        city: true,
        postalCode: true,
        bio: true,
        notifications: true,
        createdAt: true,
        _count: {
          select: {
            productRequests: true,
            payments: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// PATCH - Update user profile
export async function PATCH(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, city, postalCode, bio } = body

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        city,
        postalCode,
        bio,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        city: true,
        postalCode: true,
        bio: true,
        notifications: true,
        createdAt: true,
        _count: {
          select: {
            productRequests: true,
            payments: true,
          },
        },
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
