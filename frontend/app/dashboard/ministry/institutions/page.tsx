"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Building2,
  Users,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Search,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import apiClient, { type Institution, type InstitutionCreate } from "@/lib/api-client"
import { toast } from "sonner"

const regions = [
  "Adamawa",
  "Centre",
  "East",
  "Far North",
  "Littoral",
  "North",
  "Northwest",
  "South",
  "Southwest",
  "West",
]

const institutionTypes = ["University", "Higher Institute", "Secondary School", "Technical School"]

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [verifiedFilter, setVerifiedFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalInstitutions, setTotalInstitutions] = useState(0)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state for creating institution
  const [formData, setFormData] = useState<InstitutionCreate>({
    name: "",
    type: "University",
    region: "Centre",
    address: "",
    phone_number: "",
    email: "",
  })

  useEffect(() => {
    fetchInstitutions()
  }, [currentPage, searchTerm, selectedRegion, selectedType, verifiedFilter])

  const fetchInstitutions = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: currentPage,
        size: 12,
      }

      if (searchTerm) params.search = searchTerm
      if (selectedRegion !== "all") params.region = selectedRegion
      if (selectedType !== "all") params.type = selectedType
      if (verifiedFilter !== "all") params.verified = verifiedFilter === "verified"

      const response = await apiClient.getInstitutions(params)
      setInstitutions(response.items)
      setTotalPages(response.pages)
      setTotalInstitutions(response.total)
    } catch (error: any) {
      console.error("Error fetching institutions:", error)
      toast.error("Failed to load institutions")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Institution name is required")
      return
    }
    if (!formData.address.trim()) {
      toast.error("Address is required")
      return
    }
    if (!formData.type) {
      toast.error("Institution type is required")
      return
    }
    if (!formData.region) {
      toast.error("Region is required")
      return
    }

    setIsSubmitting(true)

    try {
      const payload: InstitutionCreate = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        type: formData.type,
        region: formData.region,
        phone_number: formData.phone_number?.trim() || undefined,
        email: formData.email?.trim() || undefined,
      }

      console.log("Submitting institution data:", payload)

      await apiClient.createInstitution(payload)
      toast.success("Institution created successfully")
      setIsCreateDialogOpen(false)
      setFormData({
        name: "",
        type: "University",
        region: "Centre",
        address: "",
        phone_number: "",
        email: "",
      })
      fetchInstitutions()
    } catch (error: any) {
      console.error("Error creating institution:", error)
      toast.error(error.message || "Failed to create institution")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyInstitution = async (institutionId: string) => {
    try {
      await apiClient.verifyInstitution(institutionId)
      toast.success("Institution verified successfully")
      fetchInstitutions()
    } catch (error: any) {
      console.error("Error verifying institution:", error)
      toast.error(error.message || "Failed to verify institution")
    }
  }

  const handleDeleteInstitution = async (institutionId: string) => {
    if (!confirm("Are you sure you want to delete this institution?")) return

    try {
      await apiClient.deleteInstitution(institutionId)
      toast.success("Institution deleted successfully")
      fetchInstitutions()
    } catch (error: any) {
      console.error("Error deleting institution:", error)
      toast.error(error.message || "Failed to delete institution")
    }
  }

  const stats = [
    {
      title: "Total Institutions",
      value: totalInstitutions.toString(),
      change: "+12%",
      icon: Building2,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Universities",
      value: institutions.filter((i) => i.type === "University").length.toString(),
      change: "+1",
      icon: GraduationCap,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Secondary Schools",
      value: institutions.filter((i) => i.type === "Secondary School").length.toString(),
      change: "+45",
      icon: Users,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Verified",
      value: institutions.filter((i) => i.is_verified).length.toString(),
      change: "+23",
      icon: CheckCircle,
      color: "from-teal-500 to-cyan-600",
    },
  ]

  return (
    <DashboardLayout userRole="ministry_admin" userName="Dr. Marie Ngozi">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Educational Institutions
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and monitor all educational institutions across Cameroon
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Institution
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Institution</DialogTitle>
                <DialogDescription>Add a new educational institution to the system</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateInstitution} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Institution Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Enter institution name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region *</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => setFormData({ ...formData, region: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Institution"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search institutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {institutionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Institutions Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((institution) => (
              <Card
                key={institution.institution_id}
                className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          {institution.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{institution.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {institution.region}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {!institution.is_verified && (
                          <DropdownMenuItem onClick={() => handleVerifyInstitution(institution.institution_id)}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Verify
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDeleteInstitution(institution.institution_id)}
                          className="text-red-600"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {institution.type}
                    </Badge>
                    <Badge variant={institution.is_verified ? "default" : "secondary"}>
                      {institution.is_verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-2" />
                      Created {new Date(institution.created_at).toLocaleDateString()}
                    </div>
                    {institution.phone_number && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-3 h-3 mr-2" />
                        {institution.phone_number}
                      </div>
                    )}
                    {institution.email && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="w-3 h-3 mr-2" />
                        {institution.email}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
