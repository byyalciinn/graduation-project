"use client"

import { useState, useEffect } from "react"
import { ModernDashboardLayout } from "@/components/layout/modern-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical, ChevronLeft, ChevronRight, Store } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string | null
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
  requestsCount: number
  offersCount: number
}

interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
}

export default function SellersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchSellers()
  }, [page, search])

  const fetchSellers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        role: "seller",
        ...(search && { search }),
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data: UsersResponse = await response.json()
        setUsers(data.users)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching sellers:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return "S"
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
      month: "short",
      day: "numeric",
    })
  }

  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">Sellers</h1>
            </div>
            <p className="text-gray-600 text-base">
              Manage sellers and their product offerings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Sellers</p>
              <p className="text-2xl font-semibold text-[#770022]">{pagination.totalCount}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search sellers by name or email..."
                className="pl-10 h-11 border-gray-200 focus:border-[#770022] focus:ring-[#770022]"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sellers list */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 bg-gray-50/50">
            <div>
              <CardTitle className="text-xl font-semibold text-[#1F1B24]">All Sellers</CardTitle>
              <CardDescription className="text-gray-600">
                {loading ? "Loading..." : `Showing ${users.length} of ${pagination.totalCount} sellers`}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No sellers found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-blue-500/30 hover:shadow-md transition-all duration-200 bg-white"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                          <AvatarImage src={user.image || undefined} alt={user.name || "Seller"} />
                          <AvatarFallback className="bg-blue-600 text-white font-semibold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-base font-semibold text-[#1F1B24]">{user.name || "No name"}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
                            Joined {formatDate(user.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center px-3">
                          <p className="text-xs text-gray-500 font-medium">Requests</p>
                          <p className="text-lg font-bold text-[#770022]">{user.requestsCount}</p>
                        </div>
                        <div className="text-center px-3">
                          <p className="text-xs text-gray-500 font-medium">Offers</p>
                          <p className="text-lg font-bold text-[#770022]">{user.offersCount}</p>
                        </div>
                        <div className="min-w-[100px]">
                          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                            Seller
                          </Badge>
                          {user.onboardingCompleted && (
                            <p className="text-xs text-emerald-600 mt-1.5 font-medium flex items-center gap-1">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Verified
                            </p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 font-medium">
                      Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="border-gray-200 hover:bg-[#770022] hover:text-white hover:border-[#770022] transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === pagination.totalPages}
                        className="border-gray-200 hover:bg-[#770022] hover:text-white hover:border-[#770022] transition-colors"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ModernDashboardLayout>
  )
}
