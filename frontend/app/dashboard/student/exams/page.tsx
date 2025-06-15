"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/dashboard-layout"
import { BookOpen, Calendar, Clock, Search, Filter, Eye, Loader2 } from "lucide-react"
import apiClient from "@/lib/api-client"
import { toast } from "sonner"

export default function StudentExamsPage() {
  const [availableExams, setAvailableExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  useEffect(() => {
    fetchAvailableExams()
  }, [searchTerm, selectedStatus])

  const fetchAvailableExams = async () => {
    try {
      setLoading(true)
      const params: any = {}

      if (searchTerm) params.search = searchTerm
      if (selectedStatus !== "all") params.status = selectedStatus

      const response = await apiClient.getAvailableExams(params)
      setAvailableExams(response.exams || [])
    } catch (error: any) {
      console.error("Error fetching exams:", error)
      toast.error("Failed to load exams")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (examId: string) => {
    try {
      await apiClient.registerForExam(examId)
      toast.success("Successfully registered for exam")
      fetchAvailableExams()
    } catch (error: any) {
      console.error("Error registering for exam:", error)
      toast.error(error.message || "Failed to register for exam")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      case "registered":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      case "closed":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <DashboardLayout userRole="student" userName="John Doe">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Examinations</h1>
            <p className="text-slate-600 dark:text-slate-400">Register for exams and view your schedule</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search examinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exams Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Available Examinations
            </CardTitle>
            <CardDescription>Register for upcoming examinations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : availableExams.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exams available</h3>
                <p className="text-gray-500">Check back later for new examination opportunities</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Examination</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableExams.map((exam) => (
                    <TableRow key={exam.exam_id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{exam.title}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{exam.type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {exam.date ? new Date(exam.date).toLocaleDateString() : "TBD"}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Clock className="w-3 h-3" />
                          {exam.time || "TBD"}
                        </div>
                      </TableCell>
                      <TableCell>{exam.duration_hours ? `${exam.duration_hours} hours` : "TBD"}</TableCell>
                      <TableCell>{exam.fee ? `${exam.fee.toLocaleString()} FCFA` : "Free"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(exam.registration_status || "available")}>
                          {exam.registration_status || "available"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {(exam.registration_status || "available") === "available" && (
                            <Button size="sm" onClick={() => handleRegister(exam.exam_id)}>
                              Register
                            </Button>
                          )}
                          {exam.registration_status === "registered" && (
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
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
      </div>
    </DashboardLayout>
  )
}
