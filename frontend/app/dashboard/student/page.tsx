"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, BookOpen, FileText, User } from "lucide-react"
import apiClient from "@/lib/api-client"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"

interface DashboardData {
  student_info: any
  available_exams: any[]
  registered_exams: any[]
  recent_results: any[]
  statistics: any
}

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await apiClient.getStudentDashboard()
      setDashboardData(data)
    } catch (error: any) {
      console.error("Dashboard loading error:", error)
      setError(error.message || "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout userRole="student" userName="John Doe">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="student" userName="John Doe">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {dashboardData?.student_info?.first_name || "Student"}!</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/student/profile">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.statistics?.available_exams_count || 0}</div>
              <p className="text-xs text-muted-foreground">Ready for registration</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Exams</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.statistics?.total_registrations || 0}</div>
              <p className="text-xs text-muted-foreground">Your registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Results</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.statistics?.total_results || 0}</div>
              <p className="text-xs text-muted-foreground">Published results</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.statistics?.average_score || "N/A"}</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Exams</CardTitle>
              <CardDescription>Exams you can register for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.available_exams && dashboardData.available_exams.length > 0 ? (
                  dashboardData.available_exams.slice(0, 5).map((exam: any) => (
                    <div key={exam.exam_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{exam.title}</h4>
                        <p className="text-sm text-gray-600">
                          {exam.type} - {exam.level}
                        </p>
                        {exam.date && (
                          <p className="text-xs text-gray-500">Date: {new Date(exam.date).toLocaleDateString()}</p>
                        )}
                      </div>
                      <Link href={`/dashboard/student/exams`}>
                        <Button size="sm">View</Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No available exams</p>
                )}
                {dashboardData?.available_exams && dashboardData.available_exams.length > 5 && (
                  <Link href="/dashboard/student/exams">
                    <Button variant="outline" className="w-full">
                      View All Exams
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
              <CardDescription>Your latest exam results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recent_results && dashboardData.recent_results.length > 0 ? (
                  dashboardData.recent_results.slice(0, 5).map((result: any) => (
                    <div key={result.result_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{result.exam_title}</h4>
                        <p className="text-sm text-gray-600">Grade: {result.grade || "N/A"}</p>
                        <Badge variant={result.status === "Pass" ? "default" : "destructive"}>{result.status}</Badge>
                      </div>
                      <Link href="/dashboard/student/results">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No results available</p>
                )}
                {dashboardData?.recent_results && dashboardData.recent_results.length > 5 && (
                  <Link href="/dashboard/student/results">
                    <Button variant="outline" className="w-full">
                      View All Results
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
