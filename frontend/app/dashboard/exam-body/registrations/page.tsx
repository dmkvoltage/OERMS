"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Users,
  Search,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  FileText,
  CreditCard,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { useState } from "react"

export default function RegistrationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [examFilter, setExamFilter] = useState("all")

  const registrations = [
    {
      id: 1,
      candidateId: "CAN-2024-001",
      name: "Jean Baptiste Nkomo",
      email: "jean.nkomo@email.com",
      phone: "+237 678 901 234",
      exam: "GCE Advanced Level 2024",
      examCode: "GCE-AL-2024",
      subjects: ["Mathematics", "Physics", "Chemistry"],
      registrationDate: "2024-01-15",
      status: "approved",
      paymentStatus: "paid",
      amount: 25000,
      venue: "Government High School Yaoundé",
      documents: ["ID Card", "Birth Certificate", "Photo"],
      region: "Centre",
    },
    {
      id: 2,
      candidateId: "CAN-2024-002",
      name: "Marie Claire Fotso",
      email: "marie.fotso@email.com",
      phone: "+237 699 123 456",
      exam: "BEPC Examination 2024",
      examCode: "BEPC-2024",
      subjects: ["Mathematics", "English", "French", "Science"],
      registrationDate: "2024-02-10",
      status: "pending",
      paymentStatus: "pending",
      amount: 15000,
      venue: "Lycée de Douala",
      documents: ["ID Card", "Birth Certificate"],
      region: "Littoral",
    },
    {
      id: 3,
      candidateId: "CAN-2024-003",
      name: "Paul Mbarga Essono",
      email: "paul.mbarga@email.com",
      phone: "+237 677 555 888",
      exam: "University Entrance Exam",
      examCode: "UEE-2024",
      subjects: ["General Knowledge", "Mathematics", "English"],
      registrationDate: "2024-01-20",
      status: "rejected",
      paymentStatus: "refunded",
      amount: 20000,
      venue: "University of Yaoundé I",
      documents: ["ID Card"],
      region: "Centre",
    },
    {
      id: 4,
      candidateId: "CAN-2024-004",
      name: "Fatima Alhadji",
      email: "fatima.alhadji@email.com",
      phone: "+237 698 777 333",
      exam: "Professional Certification",
      examCode: "PROF-CERT-2024",
      subjects: ["Technical Skills", "Professional Ethics"],
      registrationDate: "2024-03-05",
      status: "approved",
      paymentStatus: "paid",
      amount: 30000,
      venue: "Technical Institute Garoua",
      documents: ["ID Card", "Birth Certificate", "Photo", "Diploma"],
      region: "North",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "refunded":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle
      case "pending":
        return Clock
      case "rejected":
        return XCircle
      default:
        return AlertCircle
    }
  }

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter
    const matchesExam = examFilter === "all" || reg.examCode === examFilter

    return matchesSearch && matchesStatus && matchesExam
  })

  const stats = [
    {
      title: "Total Registrations",
      value: registrations.length.toString(),
      description: "All registrations",
      icon: Users,
      color: "blue",
    },
    {
      title: "Approved",
      value: registrations.filter((r) => r.status === "approved").length.toString(),
      description: "Approved registrations",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Pending Review",
      value: registrations.filter((r) => r.status === "pending").length.toString(),
      description: "Awaiting approval",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Payment Pending",
      value: registrations.filter((r) => r.paymentStatus === "pending").length.toString(),
      description: "Awaiting payment",
      icon: CreditCard,
      color: "orange",
    },
  ]

  const examOptions = [
    { value: "GCE-AL-2024", label: "GCE Advanced Level 2024" },
    { value: "BEPC-2024", label: "BEPC Examination 2024" },
    { value: "UEE-2024", label: "University Entrance Exam" },
    { value: "PROF-CERT-2024", label: "Professional Certification" },
  ]

  return (
    <DashboardLayout userRole="exam_body" userName="Prof. Michael Chen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Registration Management</h1>
            <span className="text-slate-600 dark:text-slate-400">Review and manage exam registrations</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</span>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <span className="text-xs text-slate-500 dark:text-slate-500">{stat.description}</span>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={examFilter} onValueChange={setExamFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Examinations</SelectItem>
                  {examOptions.map((exam) => (
                    <SelectItem key={exam.value} value={exam.value}>
                      {exam.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Registration Records</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              {filteredRegistrations.length} registrations found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Examination</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => {
                    const StatusIcon = getStatusIcon(registration.status)
                    return (
                      <TableRow key={registration.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                              <AvatarFallback>
                                {registration.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{registration.name}</div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                {registration.candidateId}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{registration.exam}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {registration.subjects.length} subjects
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-slate-900 dark:text-white">{registration.registrationDate}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(registration.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {registration.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className={getPaymentStatusColor(registration.paymentStatus)}>
                              {registration.paymentStatus}
                            </Badge>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {registration.amount.toLocaleString()} FCFA
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Registration Details</DialogTitle>
                                  <DialogDescription>
                                    Complete registration information for {registration.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                                          Personal Information
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span>{registration.name}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span>{registration.email}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span>{registration.phone}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span>{registration.region}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">Documents</h4>
                                        <div className="space-y-1">
                                          {registration.documents.map((doc, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                              <FileText className="w-4 h-4 text-green-500" />
                                              <span>{doc}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                                          Examination Details
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                          <div>
                                            <span className="text-slate-600 dark:text-slate-400">Exam:</span>
                                            <div className="font-medium">{registration.exam}</div>
                                          </div>
                                          <div>
                                            <span className="text-slate-600 dark:text-slate-400">Venue:</span>
                                            <div className="font-medium">{registration.venue}</div>
                                          </div>
                                          <div>
                                            <span className="text-slate-600 dark:text-slate-400">Subjects:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                              {registration.subjects.map((subject, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                  {subject}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                                          Payment Information
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                                            <span className="font-medium">
                                              {registration.amount.toLocaleString()} FCFA
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-600 dark:text-slate-400">Status:</span>
                                            <Badge
                                              variant="outline"
                                              className={getPaymentStatusColor(registration.paymentStatus)}
                                            >
                                              {registration.paymentStatus}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {registration.status === "pending" && (
                                    <div className="flex justify-end gap-2 pt-4 border-t">
                                      <Button variant="outline" className="text-red-600 hover:text-red-700">
                                        Reject
                                      </Button>
                                      <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {filteredRegistrations.length === 0 && (
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No registrations found</h3>
              <p className="text-slate-600 dark:text-slate-400">
                No registrations match your current filters. Try adjusting your search criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
