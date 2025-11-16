"use client"

import { useState } from "react"
import { BuyerDashboardLayout } from "@/components/layout/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Home,
  Building2,
  CheckCircle2,
  X
} from "lucide-react"

interface Address {
  id: string
  title: string
  fullName: string
  phone: string
  addressLine: string
  city: string
  district: string
  postalCode: string
  type: "home" | "office" | "other"
  isDefault: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      title: "Home Address",
      fullName: "John Doe",
      phone: "+90 555 123 4567",
      addressLine: "123 Main Street, Apt 4B",
      city: "Istanbul",
      district: "Kadikoy",
      postalCode: "34710",
      type: "home",
      isDefault: true,
    },
    {
      id: "2",
      title: "Office",
      fullName: "John Doe",
      phone: "+90 555 123 4567",
      addressLine: "456 Business Ave, Floor 3",
      city: "Istanbul",
      district: "Besiktas",
      postalCode: "34340",
      type: "office",
      isDefault: false,
    },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [addressLine, setAddressLine] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [type, setType] = useState<"home" | "office" | "other">("home")

  const resetForm = () => {
    setTitle("")
    setFullName("")
    setPhone("")
    setAddressLine("")
    setCity("")
    setDistrict("")
    setPostalCode("")
    setType("home")
    setEditingAddress(null)
  }

  const handleAddAddress = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      title,
      fullName,
      phone,
      addressLine,
      city,
      district,
      postalCode,
      type,
      isDefault: addresses.length === 0,
    }
    setAddresses([...addresses, newAddress])
    setIsAddModalOpen(false)
    resetForm()
  }

  const handleEditAddress = () => {
    if (!editingAddress) return
    
    setAddresses(addresses.map(addr => 
      addr.id === editingAddress.id 
        ? { ...editingAddress, title, fullName, phone, addressLine, city, district, postalCode, type }
        : addr
    ))
    setIsAddModalOpen(false)
    resetForm()
  }

  const handleDeleteAddress = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter(addr => addr.id !== id))
    }
  }

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
  }

  const openEditModal = (address: Address) => {
    setEditingAddress(address)
    setTitle(address.title)
    setFullName(address.fullName)
    setPhone(address.phone)
    setAddressLine(address.addressLine)
    setCity(address.city)
    setDistrict(address.district)
    setPostalCode(address.postalCode)
    setType(address.type)
    setIsAddModalOpen(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="h-4 w-4" />
      case "office":
        return <Building2 className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <BuyerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1F1B24]">My Addresses</h1>
            <p className="text-gray-600 mt-2">
              Manage your delivery addresses for faster checkout
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setIsAddModalOpen(true)
            }}
            className="bg-[#770022] hover:bg-[#5a0019] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {/* Addresses Grid */}
        {addresses.length === 0 ? (
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-[#1F1B24] mb-2">No Addresses Yet</h3>
                <p className="text-gray-600 mb-6">
                  Add your first delivery address to get started
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#770022] hover:bg-[#5a0019] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={`border-2 shadow-sm hover:shadow-md transition ${
                  address.isDefault ? "border-[#770022] bg-[#770022]/5" : "border-gray-200"
                }`}
              >
                <CardHeader className="border-b border-gray-100 bg-gray-50/60">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        address.type === "home" ? "bg-blue-100" :
                        address.type === "office" ? "bg-purple-100" : "bg-gray-100"
                      }`}>
                        {getTypeIcon(address.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-[#1F1B24]">
                          {address.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 capitalize">
                          {address.type} address
                        </CardDescription>
                      </div>
                    </div>
                    {address.isDefault && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="font-semibold text-[#1F1B24]">{address.fullName}</p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  </div>

                  <div className="text-sm text-gray-700">
                    <p>{address.addressLine}</p>
                    <p>{address.district}, {address.city}</p>
                    <p>Postal Code: {address.postalCode}</p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    {!address.isDefault && (
                      <Button
                        onClick={() => handleSetDefault(address.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      onClick={() => openEditModal(address)}
                      variant="outline"
                      size="sm"
                      className="border-[#770022] text-[#770022] hover:bg-[#770022] hover:text-white"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteAddress(address.id)}
                      variant="outline"
                      size="sm"
                      className="border-rose-300 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Address Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent
            showCloseButton={false}
            className="max-w-2xl border-none p-0 gap-0 overflow-hidden shadow-2xl"
          >
            <DialogTitle className="sr-only">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Fill in the address details below
            </DialogDescription>

            {/* Header */}
            <div className="bg-[#770022] text-white px-8 py-6 relative">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false)
                  resetForm()
                }}
                className="absolute right-6 top-5 rounded-full bg-white/10 p-1.5 text-white transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold tracking-tight">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <p className="text-white/90 mt-1">
                {editingAddress ? "Update your address details" : "Enter your delivery address information"}
              </p>
            </div>

            {/* Form */}
            <div className="bg-white px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Address Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Home, Office, Parent's House"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+90 555 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="addressLine">Address Line *</Label>
                  <Textarea
                    id="addressLine"
                    placeholder="Street, building number, apartment..."
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    rows={3}
                    required
                    className="border-gray-300 focus:border-[#770022] focus:ring-[#770022] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Istanbul"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    placeholder="Kadikoy"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    placeholder="34710"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Address Type *</Label>
                  <Select value={type} onValueChange={(value: any) => setType(value)}>
                    <SelectTrigger className="border-gray-300 focus:border-[#770022] focus:ring-[#770022]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false)
                    resetForm()
                  }}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingAddress ? handleEditAddress : handleAddAddress}
                  disabled={!title || !fullName || !phone || !addressLine || !city || !district || !postalCode}
                  className="flex-1 bg-[#770022] hover:bg-[#5a0019] text-white"
                >
                  {editingAddress ? "Update Address" : "Add Address"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BuyerDashboardLayout>
  )
}
