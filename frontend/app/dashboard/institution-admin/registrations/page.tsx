"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Search,
  Check,
  X,
  Eye,
  Download,
  Upload,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import apiClient from "@/lib/api-client"
import { toast } from "sonner"

export default function InstitutionRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExam, setSelectedExam] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    fetchRegistrations()
  }, [searchTerm, selectedExam, selectedStatus])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const params: any = {}

      if (searchTerm) params.search = searchTerm
      if (selectedExam !== "all") params.exam_id = selectedExam
      if (selectedStatus !== "all") params.status = selectedStatus

      const response = await apiClient.getRegistrations(params)
      setRegistrations(response.registrations || [])
    } catch (error: any) {
      console.error("Error fetching registrations:", error)
      toast.error("Failed to load registrations")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (registrationId: string) => {
    try {
      await apiClient.approveRegistration(registrationId)
      toast.success("Registration approved successfully")
      fetchRegistrations()
    } catch (error: any) {
      console.error("Error approving registration:", error)
      toast.error(error.message || "Failed to approve registration")
    }
  }

  const handleReject = async (registrationId: string) => {
    try {
      await apiClient.rejectRegistration(registrationId)
      toast.success("Registration rejected")
      fetchRegistrations()
    } catch (error: any) {
      console.error("Error rejecting registration:", error)
      toast.error(error.message || "Failed to reject registration")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
      case "under_review":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "under_review":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const stats = [
    {
      title: "Total Registrations",
      value: registrations.length.toString(),
      description: "All time registrations",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Pending Review",
      value: registrations.filter((r) => r.status === "pending").length.toString(),
      description: "Awaiting approval",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Approved",
      value: registrations.filter((r) => r.status === "approved").length.toString(),
      description: "Successfully approved",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "This Month",
      value: registrations.filter((r) => new Date(r.created_at).getMonth() === new Date().getMonth()).length.toString(),
      description: "New registrations",
      icon: Calendar,
      color: "purple",
    },
  ]

  const getTabRegistrations = (status: string) => {
    if (status === "all") return registrations
    return registrations.filter((reg) => reg.status === status)
  }

  return (
    <DashboardLayout userRole="institution-admin" userName="Dr. Sarah Wilson">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Exam Registrations</h1>
            <p className="text-slate-600 dark:text-slate-400">Review and manage student exam registrations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Actions
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{stat.description}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by student name, ID, or exam..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Exams</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending">Pending ({getTabRegistrations("pending").length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({getTabRegistrations("approved").length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({getTabRegistrations("rejected").length})</TabsTrigger>
            <TabsTrigger value="under_review">Under Review ({getTabRegistrations("under_review").length})</TabsTrigger>
            <TabsTrigger value="all">All ({registrations.length})</TabsTrigger>
          </TabsList>

          {["pending", "approved", "rejected", "under_review", "all"].map((tabStatus) => (
            <TabsContent key={tabStatus} value={tabStatus}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {tabStatus === "all"
                      ? "All Registrations"
                      : `${tabStatus.replace("_", " ").charAt(0).toUpperCase() + tabStatus.replace("_", " ").slice(1)} Registrations`}{" "}
                    ({getTabRegistrations(tabStatus).length})
                  </CardTitle>
                  <CardDescription>
                    {tabStatus === "pending" && "Registrations awaiting your review and approval"}
                    {tabStatus === "approved" && "Successfully approved registrations"}
                    {tabStatus === "rejected" && "Rejected registrations with reasons"}
                    {tabStatus === "under_review" && "Registrations currently under detailed review"}
                    {tabStatus === "all" && "Complete list of all exam registrations"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  ) : getTabRegistrations(tabStatus).length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
                      <p className="text-gray-500">No registrations match the current filter</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Exam</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getTabRegistrations(tabStatus).map((registration) => (
                          <TableRow key={registration.registration_id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                                  <AvatarFallback>
                                    {registration.student_name
                                      ? registration.student_name
                                          .split(" ")
                                          .map((n: string) => n[0])
                                          .join("")
                                      : "ST"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-slate-900 dark:text-white">
                                    {registration.student_name || "Unknown Student"}
                                  </div>
                                  <div className="text-sm text-slate-500 dark:text-slate-400">
                                    {registration.student_id || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{registration.exam_title || "Unknown Exam"}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                  {registration.exam_code || "N/A"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                {registration.created_at
                                  ? new Date(registration.created_at).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(registration.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(registration.status)}
                                  {registration.status
                                    ? registration.status.replace("_", " ").charAt(0).toUpperCase() +
                                      registration.status.replace("_", " ").slice(1)
                                    : "Unknown"}
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setSelectedRegistration(registration)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                      <DialogTitle>Registration Details</DialogTitle>
                                      <DialogDescription>
                                        Complete information for {registration.student_name}'s registration
                                      </DialogDescription>
                                    </DialogHeader>
                                    {selectedRegistration && (
                                      <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                          <div className="space-y-4">
                                            <div>
                                              <Label className="text-sm font-medium">Student Information</Label>
                                              <div className="mt-2 space-y-2">
                                                <p className="text-sm">
                                                  <span className="font-medium">Name:</span>{" "}
                                                  {selectedRegistration.student_name || "N/A"}
                                                </p>
                                                <p className="text-sm">
                                                  <span className="font-medium">ID:</span>{" "}
                                                  {selectedRegistration.student_id || "N/A"}
                                                </p>
                                              </div>
                                            </div>
                                            <div>
                                              <Label className="text-sm font-medium">Exam Information</Label>
                                              <div className="mt-2 space-y-2">
                                                <p className="text-sm">
                                                  <span className="font-medium">Exam:</span>{" "}
                                                  {selectedRegistration.exam_title || "N/A"}
                                                </p>
                                                <p className="text-sm">
                                                  <span className="font-medium">Code:</span>{" "}
                                                  {selectedRegistration.exam_code || "N/A"}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {selectedRegistration.status === "pending" && (
                                          <div className="flex justify-end gap-2 pt-4 border-t">
                                            <Button
                                              variant="outline"
                                              onClick={() => handleReject(selectedRegistration.registration_id)}
                                            >
                                              <X className="w-4 h-4 mr-2" />
                                              Reject
                                            </Button>
                                            <Button onClick={() => handleApprove(selectedRegistration.registration_id)}>
                                              <Check className="w-4 h-4 mr-2" />
                                              Approve
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                {registration.status === "pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleApprove(registration.registration_id)}
                                    >
                                      <Check className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReject(registration.registration_id)}
                                    >
                                      <X className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
