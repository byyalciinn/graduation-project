"use client"

import { useState, useEffect } from "react"
import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit, 
  Save,
  CreditCard,
  Package,
  ShoppingBag,
  Bell,
  ShieldCheck
} from "lucide-react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string | null
  city: string | null
  postalCode: string | null
  bio: string | null
  notifications: boolean
  createdAt: Date
  _count?: {
    productRequests: number
    payments: number
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/user/profile")
        if (!response.ok) throw new Error("Failed to fetch profile")
        const data = await response.json()
        setProfile(data)
        setName(data.name || "")
        setCity(data.city || "")
        setPostalCode(data.postalCode || "")
        setBio(data.bio || "")
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, postalCode, bio }),
      })

      if (!response.ok) throw new Error("Failed to update profile")
      
      const updatedData = await response.json()
      setProfile(updatedData)
      setIsEditing(false)
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <BuyerDashboardLayout>
        <div className="text-center py-12 text-gray-500">Loading profile...</div>
      </BuyerDashboardLayout>
    )
  }

  if (!profile) {
    return (
      <BuyerDashboardLayout>
        <div className="text-center py-12 text-gray-500">Profile not found</div>
      </BuyerDashboardLayout>
    )
  }

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.image || undefined} />
                <AvatarFallback className="bg-[#770022] text-white text-2xl">
                  {profile.name?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#1F1B24]">{profile.name || "Anonymous User"}</h2>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge className="bg-[#770022] text-white">
                    {profile.role === "buyer" ? "Buyer" : "User"}
                  </Badge>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {format(new Date(profile.createdAt), "MMMM yyyy", { locale: enUS })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-[#1F1B24]">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Update your personal details and information
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-[#770022] text-[#770022] hover:bg-[#770022] hover:text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setIsEditing(false)
                          setName(profile.name || "")
                          setCity(profile.city || "")
                          setPostalCode(profile.postalCode || "")
                          setBio(profile.bio || "")
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#770022] hover:bg-[#5a0019] text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                      />
                    ) : (
                      <p className="text-[#1F1B24] font-medium py-2">{profile.name || "Not set"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <p className="text-[#1F1B24] font-medium py-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {profile.email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter your city"
                        className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                      />
                    ) : (
                      <p className="text-[#1F1B24] font-medium py-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {profile.city || "Not set"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    {isEditing ? (
                      <Input
                        id="postalCode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Enter postal code"
                        className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                      />
                    ) : (
                      <p className="text-[#1F1B24] font-medium py-2">{profile.postalCode || "Not set"}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="border-gray-300 focus:border-[#770022] focus:ring-[#770022] resize-none"
                    />
                  ) : (
                    <p className="text-gray-700 py-2">{profile.bio || "No bio added yet"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50/60">
                <CardTitle className="text-xl font-semibold text-[#1F1B24]">
                  Account Activity
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Overview of your platform activity
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-gray-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <ShoppingBag className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Requests</p>
                          <p className="text-2xl font-bold text-[#1F1B24]">
                            {profile._count?.productRequests || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-lg">
                          <CreditCard className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Payments</p>
                          <p className="text-2xl font-bold text-[#1F1B24]">
                            {profile._count?.payments || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                          <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Member Since</p>
                          <p className="text-lg font-bold text-[#1F1B24]">
                            {format(new Date(profile.createdAt), "MMM yyyy", { locale: enUS })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50/60">
                <CardTitle className="text-xl font-semibold text-[#1F1B24]">
                  Payment Methods
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Add and manage your payment methods securely
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Security Notice */}
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-3 rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                  <p className="text-sm font-medium">Your information is stored securely</p>
                </div>

                {/* Payment Method Tabs */}
                <Tabs defaultValue="credit-card" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="credit-card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit Card
                    </TabsTrigger>
                    <TabsTrigger value="wire-transfer" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Wire Transfer
                    </TabsTrigger>
                  </TabsList>

                  {/* Credit Card Tab */}
                  <TabsContent value="credit-card" className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#1F1B24]">Add Credit/Debit Card</h3>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          <CreditCard className="h-3 w-3 mr-1" />
                          Visa, Mastercard, Amex
                        </Badge>
                      </div>

                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardHolder">Cardholder Name</Label>
                          <Input
                            id="cardHolder"
                            placeholder="John Doe"
                            className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              maxLength={5}
                              className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              type="password"
                              placeholder="123"
                              maxLength={3}
                              className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <CreditCard className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Secure Payment Processing</p>
                            <p>All card details are encrypted using industry-standard SSL technology. We never store your CVV.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-gray-300 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-[#770022] hover:bg-[#5a0019] text-white"
                          >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Save Card
                          </Button>
                        </div>
                      </form>
                    </div>
                  </TabsContent>

                  {/* Wire Transfer Tab */}
                  <TabsContent value="wire-transfer" className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#1F1B24]">Bank Account Details</h3>
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                          <Package className="h-3 w-3 mr-1" />
                          Bank Transfer
                        </Badge>
                      </div>

                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="accountHolder">Account Holder Name</Label>
                          <Input
                            id="accountHolder"
                            placeholder="John Doe"
                            className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            placeholder="e.g., Garanti BBVA"
                            className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="iban">IBAN</Label>
                          <Input
                            id="iban"
                            placeholder="TR00 0000 0000 0000 0000 0000 00"
                            className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="swift">SWIFT/BIC Code (Optional)</Label>
                          <Input
                            id="swift"
                            placeholder="AAAA BB CC 123"
                            className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                          />
                        </div>

                        <Separator />

                        <div className="flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <Package className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-purple-800">
                            <p className="font-medium mb-1">Bank Transfer Information</p>
                            <p>Your bank account details will be securely stored and used for wire transfer payments. Transfers typically take 1-3 business days.</p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-gray-300 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-[#770022] hover:bg-[#5a0019] text-white"
                          >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Save Bank Account
                          </Button>
                        </div>
                      </form>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50/60">
                <CardTitle className="text-xl font-semibold text-[#1F1B24]">
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-[#1F1B24]">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <Badge className={profile.notifications ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}>
                      {profile.notifications ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BuyerDashboardLayout>
  )
}
