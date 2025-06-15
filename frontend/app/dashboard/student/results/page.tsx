"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import DashboardLayout from "@/components/dashboard-layout"
import { Award, Download, TrendingUp, Calendar, BarChart3, Loader2 } from "lucide-react"
import apiClient from "@/lib/api-client"
import { toast } from "sonner"

export default function StudentResultsPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getStudentResults()
      setResults(response.results || [])
    } catch (error: any) {
      console.error("Error fetching results:", error)
      toast.error("Failed to load results")
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade?.startsWith("A")) return "text-green-600 dark:text-green-400"
    if (grade?.startsWith("B")) return "text-blue-600 dark:text-blue-400"
    if (grade?.startsWith("C")) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
      case "Pass":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      case "failed":
      case "Fail":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const averageScore =
    results.length > 0 ? results.reduce((acc, result) => acc + (result.score || 0), 0) / results.length : 0

  return (
    <DashboardLayout userRole="student" userName="John Doe">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Examination Results</h1>
            <p className="text-slate-600 dark:text-slate-400">View your academic performance and grades</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Download Transcript
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Score</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{averageScore.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Exams Completed</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{results.length}</p>
                </div>
                <Award className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pass Rate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {results.length > 0
                      ? (
                          (results.filter((r) => r.status === "Pass" || r.status === "passed").length /
                            results.length) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results available</h3>
            <p className="text-gray-500">Your exam results will appear here once they are published</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <Card key={result.result_id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {result.exam_title || "Unknown Exam"}
                        </h3>
                        <Badge variant="outline" className={getStatusColor(result.status || "pending")}>
                          {result.status || "pending"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span>Code: {result.exam_code || "N/A"}</span>
                        <span>Date: {result.exam_date ? new Date(result.exam_date).toLocaleDateString() : "N/A"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{result.score || 0}%</div>
                        <div className={`text-lg font-semibold ${getGradeColor(result.grade || "F")}`}>
                          {result.grade || "F"}
                        </div>
                      </div>

                      <div className="w-32">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Score</span>
                          <span>{result.score || 0}/100</span>
                        </div>
                        <Progress value={result.score || 0} className="h-2" />
                      </div>

                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Certificate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
