"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Users, Building, BookOpen, FileText, TrendingUp, UserPlus, UserCog } from "lucide-react"
import apiClient from "@/lib/api-client"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"

interface MinistryDashboardData {
  total_students: number
  total_exams: number
  total_institutions: number
  total_results: number
  recent_exams: any[]
  recent_institutions: any[]
  analytics: any
}

export default function MinistryDashboard() {
  const [dashboardData, setDashboardData] = useState<MinistryDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await apiClient.getMinistryDashboard()
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
      <DashboardLayout userRole="ministry" userName="Dr. Marie Ngozi">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="ministry" userName="Dr. Marie Ngozi">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Ministry Dashboard</h1>
            <p className="text-gray-600">System overview and management</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/ministry/analytics">
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
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
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.total_students || 0}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Institutions</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.total_institutions || 0}</div>
              <p className="text-xs text-muted-foreground">Registered institutions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.total_exams || 0}</div>
              <p className="text-xs text-muted-foreground">Created exams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Results</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.total_results || 0}</div>
              <p className="text-xs text-muted-foreground">Results published</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exams</CardTitle>
              <CardDescription>Latest created exams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recent_exams && dashboardData.recent_exams.length > 0 ? (
                  dashboardData.recent_exams.slice(0, 5).map((exam: any) => (
                    <div key={exam.exam_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{exam.title}</h4>
                        <p className="text-sm text-gray-600">
                          {exam.type} - {exam.level}
                        </p>
                        <p className="text-xs text-gray-500">Status: {exam.status}</p>
                      </div>
                      <Link href={`/dashboard/ministry/exams`}>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No recent exams</p>
                )}
                <Link href="/dashboard/ministry/exams">
                  <Button variant="outline" className="w-full">
                    Manage All Exams
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Institutions</CardTitle>
              <CardDescription>Latest registered institutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recent_institutions && dashboardData.recent_institutions.length > 0 ? (
                  dashboardData.recent_institutions.slice(0, 5).map((institution: any) => (
                    <div
                      key={institution.institution_id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{institution.name}</h4>
                        <p className="text-sm text-gray-600">
                          {institution.type} - {institution.region}
                        </p>
                        <p className="text-xs text-gray-500">
                          {institution.is_verified ? "Verified" : "Pending verification"}
                        </p>
                      </div>
                      <Link href="/dashboard/ministry/institutions">
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No recent institutions</p>
                )}
                <Link href="/dashboard/ministry/institutions">
                  <Button variant="outline" className="w-full">
                    Manage All Institutions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/ministry/exams">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Manage Exams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Create, modify, and delete national exams</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/ministry/institutions">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Manage Institutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Register and verify educational institutions</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/ministry/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  System Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">View comprehensive system analytics</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Add User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Add new users to the system</p>
              <div className="mt-4 flex justify-end">
                <Link href="/dashboard/ministry/users/create">
                  <Button size="sm">Add User</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCog className="h-5 w-5 mr-2" />
                Manage Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Manage existing users and their roles</p>
              <div className="mt-4 flex justify-end">
                <Link href="/dashboard/ministry/users">
                  <Button size="sm">Manage Users</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
