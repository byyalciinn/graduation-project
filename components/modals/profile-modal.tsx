"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Tag,
  FileText,
  CheckCircle2,
} from "lucide-react"

interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string | null
  categories: string[]
  city: string | null
  postalCode: string | null
  notifications: boolean
  bio: string | null
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      fetchUserData()
    }
  }, [open])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/me")
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "seller":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "buyer":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Profile Information</DialogTitle>
          <DialogDescription>
            View your account details and information
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ) : userData ? (
          <div className="space-y-6 py-4">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={userData.image || undefined} alt={userData.name || "User"} />
                <AvatarFallback className="text-xl font-semibold">
                  {getInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{userData.name || "User"}</h3>
                  {userData.onboardingCompleted && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getRoleBadgeColor(userData.role)}>
                    {userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : "No Role"}
                  </Badge>
                  {userData.notifications && (
                    <Badge variant="outline" className="text-xs">
                      Notifications On
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Contact Information
              </h4>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">{userData.email}</p>
                  </div>
                </div>

                {userData.city && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {userData.city}
                        {userData.postalCode && `, ${userData.postalCode}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {userData.bio && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    About
                  </h4>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Bio</p>
                      <p className="text-sm text-muted-foreground">{userData.bio}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Categories */}
            {userData.categories && userData.categories.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Interests
                  </h4>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {userData.categories.map((category, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Account Information */}
            <Separator />
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Account Information
              </h4>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(userData.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Account Status</p>
                    <p className="text-sm text-muted-foreground">
                      {userData.onboardingCompleted ? "Active" : "Pending Setup"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Failed to load profile data
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
