"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/dashboard-layout"
import {
  BookOpen,
  Search,
  Plus,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Eye,
  Download,
  BarChart3,
} from "lucide-react"
import { useState } from "react"

export default function ExaminationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const examinations = [
    {
      id: 1,
      name: "GCE Advanced Level 2024",
      code: "GCE-AL-2024",
      type: "National",
      level: "Advanced",
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
      registrationStart: "2024-01-01",
      registrationEnd: "2024-01-31",
      examStart: "2024-03-15",
      examEnd: "2024-03-30",
      status: "active",
      registrations: 2456,
      maxCapacity: 3000,
      venues: 45,
      progress: 82,
      fee: 25000,
    },
    {
      id: 2,
      name: "BEPC Examination 2024",
      code: "BEPC-2024",
      type: "National",
      level: "Ordinary",
      subjects: ["Mathematics", "English", "French", "Science", "History"],
      registrationStart: "2024-02-01",
      registrationEnd: "2024-02-28",
      examStart: "2024-04-10",
      examEnd: "2024-04-20",
      status: "upcoming",
      registrations: 3200,
      maxCapacity: 4000,
      venues: 62,
      progress: 0,
      fee: 15000,
    },
    {
      id: 3,
      name: "University Entrance Exam",
      code: "UEE-2024",
      type: "Entrance",
      level: "University",
      subjects: ["General Knowledge", "Mathematics", "English", "Logic"],
      registrationStart: "2024-01-15",
      registrationEnd: "2024-02-15",
      examStart: "2024-03-01",
      examEnd: "2024-03-05",
      status: "completed",
      registrations: 1800,
      maxCapacity: 2000,
      venues: 25,
      progress: 100,
      fee: 20000,
    },
    {
      id: 4,
      name: "Professional Certification",
      code: "PROF-CERT-2024",
      type: "Professional",
      level: "Professional",
      subjects: ["Technical Skills", "Professional Ethics", "Industry Knowledge"],
      registrationStart: "2024-03-01",
      registrationEnd: "2024-03-31",
      examStart: "2024-05-15",
      examEnd: "2024-05-20",
      status: "draft",
      registrations: 0,
      maxCapacity: 1500,
      venues: 18,
      progress: 0,
      fee: 30000,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      case "upcoming":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      case "completed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
      case "draft":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle
      case "upcoming":
        return Clock
      case "completed":
        return CheckCircle
      case "draft":
        return AlertCircle
      default:
        return Clock
    }
  }

  const filteredExaminations = examinations.filter((exam) => {
    const matchesSearch =
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || exam.status === statusFilter
    const matchesType = typeFilter === "all" || exam.type.toLowerCase() === typeFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesType
  })

  const stats = [
    {
      title: "Total Examinations",
      value: examinations.length.toString(),
      description: "All examinations",
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Active Exams",
      value: examinations.filter((e) => e.status === "active").length.toString(),
      description: "Currently running",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Total Registrations",
      value: examinations.reduce((sum, e) => sum + e.registrations, 0).toLocaleString(),
      description: "Across all exams",
      icon: Users,
      color: "purple",
    },
    {
      title: "Exam Venues",
      value: examinations.reduce((sum, e) => sum + e.venues, 0).toString(),
      description: "Total venues",
      icon: Calendar,
      color: "orange",
    },
  ]

  return (
    <DashboardLayout userRole="exam_body" userName="Prof. Michael Chen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Examinations Management</h1>
            <span className="text-slate-600 dark:text-slate-400">Create and manage national examinations</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Exam
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Examination</DialogTitle>
                  <DialogDescription>Set up a new examination with all required details</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="exam-name">Examination Name</Label>
                    <Input id="exam-name" placeholder="e.g., GCE Advanced Level 2024" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam-code">Exam Code</Label>
                    <Input id="exam-code" placeholder="e.g., GCE-AL-2024" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam-type">Exam Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="entrance">Entrance</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam-level">Education Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ordinary">Ordinary Level</SelectItem>
                        <SelectItem value="advanced">Advanced Level</SelectItem>
                        <SelectItem value="university">University</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="exam-description">Description</Label>
                    <Textarea id="exam-description" placeholder="Examination description and requirements" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Examination</Button>
                </div>
              </DialogContent>
            </Dialog>
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

        {/* Filters and Search */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="entrance">Entrance</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Examinations List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExaminations.map((exam) => {
            const StatusIcon = getStatusIcon(exam.status)
            return (
              <Card key={exam.id} className="border-0 shadow-sm bg-white dark:bg-slate-800">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                        {exam.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        {exam.code} • {exam.type} • {exam.level}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(exam.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {exam.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Registrations</span>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {exam.registrations.toLocaleString()} / {exam.maxCapacity.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Venues</span>
                      <div className="font-medium text-slate-900 dark:text-white">{exam.venues}</div>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Exam Period</span>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {exam.examStart} - {exam.examEnd}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Fee</span>
                      <div className="font-medium text-slate-900 dark:text-white">{exam.fee.toLocaleString()} FCFA</div>
                    </div>
                  </div>

                  {exam.status === "active" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="text-slate-900 dark:text-white">{exam.progress}%</span>
                      </div>
                      <Progress value={exam.progress} className="h-2" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Subjects</span>
                    <div className="flex flex-wrap gap-1">
                      {exam.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredExaminations.length === 0 && (
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No examinations found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No examinations match your current filters. Try adjusting your search criteria.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Examination
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
