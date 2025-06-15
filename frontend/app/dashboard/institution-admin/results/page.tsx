"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Progress } from "@/components/ui/progress"
import {
  Award,
  Search,
  Download,
  Upload,
  Eye,
  FileText,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  BarChart3,
  Loader2,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import apiClient from "@/lib/api-client"
import { toast } from "sonner"

export default function InstitutionResultsPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExam, setSelectedExam] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedResult, setSelectedResult] = useState<any>(null)

  useEffect(() => {
    fetchResults()
  }, [searchTerm, selectedExam, selectedStatus])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const params: any = {}

      if (searchTerm) params.search = searchTerm
      if (selectedExam !== "all") params.exam_id = selectedExam
      if (selectedStatus !== "all") params.status = selectedStatus

      const response = await apiClient.getResults(params)
      setResults(response.results || [])
    } catch (error: any) {
      console.error("Error fetching results:", error)
      toast.error("Failed to load results")
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      case "B+":
      case "B":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      case "C+":
      case "C":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "D":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
      case "F":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      case "under_review":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "pending":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4" />
      case "under_review":
        return <Clock className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "draft":
        return <FileText className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const stats = [
    {
      title: "Total Results",
      value: results.length.toString(),
      description: "All exam results",
      icon: Award,
      color: "blue",
    },
    {
      title: "Published",
      value: results.filter((r) => r.status === "published").length.toString(),
      description: "Available to students",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Under Review",
      value: results.filter((r) => r.status === "under_review").length.toString(),
      description: "Pending verification",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Average Score",
      value:
        results.length > 0 ? (results.reduce((acc, r) => acc + (r.score || 0), 0) / results.length).toFixed(1) : "0",
      description: "Institution average",
      icon: TrendingUp,
      color: "purple",
    },
  ]

  return (
    <DashboardLayout userRole="institution-admin" userName="Dr. Sarah Wilson">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Exam Results</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage and review student examination results</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import Results
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
            <Button size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
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
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="results">Individual Results</TabsTrigger>
            <TabsTrigger value="summary">Exam Summary</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Individual Results */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Student Results ({results.length})
                </CardTitle>
                <CardDescription>Individual student examination results and grades</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500">No results match the current filter</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Exam</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.result_id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {result.student_name || "Unknown Student"}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {result.student_id || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{result.exam_title || "Unknown Exam"}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {result.exam_code || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{result.score || 0}/100</span>
                              <div className="w-16">
                                <Progress value={result.score || 0} className="h-2" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getGradeColor(result.grade || "F")}>
                              {result.grade || "F"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(result.status || "draft")}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(result.status || "draft")}
                                {(result.status || "draft").charAt(0).toUpperCase() +
                                  (result.status || "draft").slice(1).replace("_", " ")}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedResult(result)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Result Details</DialogTitle>
                                    <DialogDescription>
                                      Detailed examination result for {result.student_name || "Unknown Student"}
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedResult && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                          <div>
                                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                                              Student Information
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                              <div className="flex justify-between">
                                                <span className="text-slate-500">Name:</span>
                                                <span>{selectedResult.student_name || "N/A"}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-slate-500">ID:</span>
                                                <span>{selectedResult.student_id || "N/A"}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="space-y-4">
                                          <div>
                                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                                              Exam Information
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                              <div className="flex justify-between">
                                                <span className="text-slate-500">Exam:</span>
                                                <span>{selectedResult.exam_title || "N/A"}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-slate-500">Code:</span>
                                                <span>{selectedResult.exam_code || "N/A"}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="border-t pt-4">
                                        <h4 className="font-medium text-slate-900 dark:text-white mb-4">
                                          Performance Summary
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                              {selectedResult.score || 0}
                                            </div>
                                            <div className="text-sm text-slate-500">Score</div>
                                          </div>
                                          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                              {selectedResult.grade || "F"}
                                            </div>
                                            <div className="text-sm text-slate-500">Grade</div>
                                          </div>
                                        </div>
                                        <div className="mt-4">
                                          <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-slate-500">Performance</span>
                                            <span className="text-sm font-medium">{selectedResult.score || 0}%</span>
                                          </div>
                                          <Progress value={selectedResult.score || 0} className="h-3" />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
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

          {/* Exam Summary */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Exam Performance Summary
                </CardTitle>
                <CardDescription>Statistical overview of exam performance by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Summary Coming Soon</h3>
                  <p className="text-gray-500">Exam summary will be available when results are loaded</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription>Academic performance analysis and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-500">Performance analytics will be available when results are loaded</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Grade Distribution
                  </CardTitle>
                  <CardDescription>Distribution of grades across all exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Distribution Coming Soon</h3>
                    <p className="text-gray-500">Grade distribution will be available when results are loaded</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
