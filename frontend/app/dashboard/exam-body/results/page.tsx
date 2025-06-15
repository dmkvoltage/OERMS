"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import DashboardLayout  from "@/components/dashboard-layout"
import {
  Award,
  Search,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  BarChart3,
  Users,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"

export default function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [examFilter, setExamFilter] = useState("all")

  const results = [
    {
      id: 1,
      examName: "GCE Advanced Level 2024",
      examCode: "GCE-AL-2024",
      totalCandidates: 2456,
      processed: 2456,
      published: true,
      publishDate: "2024-03-25",
      passRate: 82.5,
      avgScore: 74.2,
      grades: {
        A: 245,
        B: 612,
        C: 789,
        D: 456,
        E: 234,
        F: 120,
      },
      status: "published",
    },
    {
      id: 2,
      examName: "BEPC Examination 2024",
      examCode: "BEPC-2024",
      totalCandidates: 3200,
      processed: 2800,
      published: false,
      publishDate: null,
      passRate: null,
      avgScore: null,
      grades: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
      },
      status: "processing",
    },
    {
      id: 3,
      examName: "University Entrance Exam",
      examCode: "UEE-2024",
      totalCandidates: 1800,
      processed: 1800,
      published: true,
      publishDate: "2024-03-10",
      passRate: 75.3,
      avgScore: 68.7,
      grades: {
        A: 180,
        B: 396,
        C: 540,
        D: 324,
        E: 216,
        F: 144,
      },
      status: "published",
    },
    {
      id: 4,
      examName: "Professional Certification",
      examCode: "PROF-CERT-2024",
      totalCandidates: 1200,
      processed: 1200,
      published: false,
      publishDate: null,
      passRate: 88.2,
      avgScore: 79.5,
      grades: {
        A: 240,
        B: 360,
        C: 360,
        D: 144,
        E: 72,
        F: 24,
      },
      status: "ready",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      case "ready":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      case "processing":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return CheckCircle
      case "ready":
        return AlertCircle
      case "processing":
        return Clock
      default:
        return Clock
    }
  }

  const filteredResults = results.filter((result) => {
    const matchesSearch =
      result.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.examCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || result.status === statusFilter
    const matchesExam = examFilter === "all" || result.examCode === examFilter

    return matchesSearch && matchesStatus && matchesExam
  })

  const stats = [
    {
      title: "Total Results",
      value: results.length.toString(),
      description: "Examination results",
      icon: Award,
      color: "blue",
    },
    {
      title: "Published",
      value: results.filter((r) => r.status === "published").length.toString(),
      description: "Results published",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Ready to Publish",
      value: results.filter((r) => r.status === "ready").length.toString(),
      description: "Awaiting publication",
      icon: AlertCircle,
      color: "yellow",
    },
    {
      title: "Processing",
      value: results.filter((r) => r.status === "processing").length.toString(),
      description: "Being processed",
      icon: Clock,
      color: "orange",
    },
  ]

  const totalCandidates = results.reduce((sum, r) => sum + r.totalCandidates, 0)
  const publishedResults = results.filter((r) => r.status === "published")
  const avgPassRate =
    publishedResults.length > 0
      ? publishedResults.reduce((sum, r) => sum + (r.passRate || 0), 0) / publishedResults.length
      : 0

  return (
    <DashboardLayout userRole="exam_body" userName="Prof. Michael Chen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Results Management</h1>
            <span className="text-slate-600 dark:text-slate-400">Process and publish examination results</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Results
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Candidates</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {totalCandidates.toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-500">All examinations</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Pass Rate</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{avgPassRate.toFixed(1)}%</div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+2.3%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          {stats.slice(2).map((stat, index) => (
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
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="ready">Ready to Publish</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Examination Results</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              {filteredResults.length} results found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResults.map((result) => {
                const StatusIcon = getStatusIcon(result.status)
                const processingProgress = (result.processed / result.totalCandidates) * 100

                return (
                  <div
                    key={result.id}
                    className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{result.examName}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{result.examCode}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(result.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {result.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Total Candidates</span>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                          {result.totalCandidates.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Processed</span>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                          {result.processed.toLocaleString()}
                        </div>
                      </div>
                      {result.passRate && (
                        <div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">Pass Rate</span>
                          <div className="text-xl font-bold text-slate-900 dark:text-white">
                            {result.passRate.toFixed(1)}%
                          </div>
                        </div>
                      )}
                      {result.avgScore && (
                        <div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">Average Score</span>
                          <div className="text-xl font-bold text-slate-900 dark:text-white">
                            {result.avgScore.toFixed(1)}%
                          </div>
                        </div>
                      )}
                    </div>

                    {result.status === "processing" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Processing Progress</span>
                          <span className="text-slate-900 dark:text-white">{processingProgress.toFixed(0)}%</span>
                        </div>
                        <Progress value={processingProgress} className="h-2" />
                      </div>
                    )}

                    {result.status === "published" && result.grades && (
                      <div className="space-y-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Grade Distribution</span>
                        <div className="grid grid-cols-6 gap-2">
                          {Object.entries(result.grades).map(([grade, count]) => (
                            <div key={grade} className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">{grade}</div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">{count}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Detailed Results - {result.examName}</DialogTitle>
                            <DialogDescription>Complete examination results and statistics</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                  {result.totalCandidates.toLocaleString()}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Total Candidates</div>
                              </div>
                              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                  {result.passRate ? `${result.passRate.toFixed(1)}%` : "N/A"}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Pass Rate</div>
                              </div>
                              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                  {result.avgScore ? `${result.avgScore.toFixed(1)}%` : "N/A"}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Average Score</div>
                              </div>
                              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                  {result.publishDate || "Not Published"}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Publish Date</div>
                              </div>
                            </div>

                            {result.grades && Object.values(result.grades).some((count) => count > 0) && (
                              <div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                  Grade Distribution
                                </h4>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                  {Object.entries(result.grades).map(([grade, count]) => (
                                    <div key={grade} className="text-center p-4 border rounded-lg">
                                      <div className="text-3xl font-bold text-slate-900 dark:text-white">{grade}</div>
                                      <div className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                        {count}
                                      </div>
                                      <div className="text-sm text-slate-500 dark:text-slate-500">
                                        {((count / result.totalCandidates) * 100).toFixed(1)}%
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>

                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>

                      {result.status === "ready" && (
                        <Button size="sm" className="ml-auto">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Publish Results
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {filteredResults.length === 0 && (
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardContent className="p-12 text-center">
              <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No results found</h3>
              <p className="text-slate-600 dark:text-slate-400">No examination results match your current filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
