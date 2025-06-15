"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  BookOpen,
  Calendar,
  Users,
  Clock,
  Search,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import apiClient from "@/lib/api-client"
import { toast } from "sonner"

const examTypes = ["National Examination", "Regional Examination", "Entrance Examination", "Professional Examination"]
const examLevels = ["Primary", "Secondary", "Higher Education", "Professional"]

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state for creating exam
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    level: "",
    description: "",
    date: "",
    registration_deadline: "",
    fee: "",
    subjects: "",
    duration_hours: "",
    max_candidates: "",
  })

  useEffect(() => {
    fetchExams()
  }, [searchTerm, selectedType, selectedLevel, selectedStatus])

  const fetchExams = async () => {
    try {
      setLoading(true)
      const params: any = {}

      if (searchTerm) params.search = searchTerm
      if (selectedType !== "all") params.type = selectedType
      if (selectedLevel !== "all") params.level = selectedLevel
      if (selectedStatus !== "all") params.status = selectedStatus

      const response = await apiClient.getExams(params)
      setExams(response.exams || [])
    } catch (error: any) {
      console.error("Error fetching exams:", error)
      toast.error("Failed to load exams")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const examData = {
        ...formData,
        fee: formData.fee ? Number.parseFloat(formData.fee) : 0,
        duration_hours: formData.duration_hours ? Number.parseInt(formData.duration_hours) : 3,
        max_candidates: formData.max_candidates ? Number.parseInt(formData.max_candidates) : null,
        subjects: formData.subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }

      await apiClient.createExam(examData)
      toast.success("Exam created successfully")
      setIsCreateDialogOpen(false)
      setFormData({
        title: "",
        type: "",
        level: "",
        description: "",
        date: "",
        registration_deadline: "",
        fee: "",
        subjects: "",
        duration_hours: "",
        max_candidates: "",
      })
      fetchExams()
    } catch (error: any) {
      console.error("Error creating exam:", error)
      toast.error(error.message || "Failed to create exam")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      case "Active":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "Completed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Calendar className="w-3 h-3" />
      case "Active":
        return <Clock className="w-3 h-3" />
      case "Completed":
        return <CheckCircle className="w-3 h-3" />
      case "Cancelled":
        return <XCircle className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
  }

  const stats = [
    {
      title: "Total Exams",
      value: exams.length.toString(),
      change: "+3",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Active Exams",
      value: exams.filter((e) => e.status === "Active").length.toString(),
      change: "+2",
      icon: Clock,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Total Candidates",
      value: exams.reduce((acc, e) => acc + (e.registered_candidates || 0), 0).toString(),
      change: "+15%",
      icon: Users,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Completed Exams",
      value: exams.filter((e) => e.status === "Completed").length.toString(),
      change: "+1",
      icon: CheckCircle,
      color: "from-amber-500 to-orange-600",
    },
  ]

  return (
    <DashboardLayout userRole="ministry_admin" userName="Dr. Marie Ngozi">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Public Examinations
            </h1>
            <p className="text-muted-foreground mt-2">Manage national and regional examinations across Cameroon</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
                <DialogDescription>Add a new examination to the system</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateExam} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Exam Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {examTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level *</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {examLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fee">Registration Fee (FCFA)</Label>
                    <Input
                      id="fee"
                      type="number"
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Exam Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration_deadline">Registration Deadline</Label>
                    <Input
                      id="registration_deadline"
                      type="date"
                      value={formData.registration_deadline}
                      onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration_hours">Duration (hours)</Label>
                    <Input
                      id="duration_hours"
                      type="number"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_candidates">Max Candidates</Label>
                    <Input
                      id="max_candidates"
                      type="number"
                      value={formData.max_candidates}
                      onChange={(e) => setFormData({ ...formData, max_candidates: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                  <Input
                    id="subjects"
                    value={formData.subjects}
                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                    placeholder="Mathematics, Physics, Chemistry"
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
                      "Create Exam"
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
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {examTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {examLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exams List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {exams.map((exam) => (
              <Card
                key={exam.exam_id}
                className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {exam.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {exam.level}
                        </Badge>
                      </CardDescription>
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
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(exam.status)}>
                      {getStatusIcon(exam.status)}
                      <span className="ml-1">{exam.status}</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground">{exam.level} Level</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Exam Date</p>
                      <p className="font-semibold">{exam.date ? new Date(exam.date).toLocaleDateString() : "TBD"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-semibold">{exam.duration_hours || 3} hours</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Candidates</p>
                      <p className="font-semibold">{exam.registered_candidates || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fee</p>
                      <p className="font-semibold">{exam.fee ? `${exam.fee.toLocaleString()} FCFA` : "Free"}</p>
                    </div>
                  </div>

                  {exam.subjects && exam.subjects.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Subjects</p>
                      <div className="flex flex-wrap gap-1">
                        {exam.subjects.slice(0, 3).map((subject: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {exam.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{exam.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {exams.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-500">Create your first exam to get started</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
