"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { InstitutionalAdminGuard } from "@/components/auth/role-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Users, FileText, BookOpen, Building } from "lucide-react"
import apiClient from "@/lib/api-client"
import Link from "next/link"

interface InstitutionDashboardData {
  institution_info: any
  total_students: number
  total_registrations: number
  recent_results: any[]
  statistics: any
}

export default function InstitutionAdminDashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<InstitutionDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.getInstitutionDashboard()
      setDashboardData(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <InstitutionalAdminGuard>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Institution Dashboard</h1>
            <p className="text-gray-600">{user?.institution_name || "Institution Management"}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/institution-admin/students">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Students
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
              <CardTitle className="text-sm font-medium">Exam Registrations</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.total_registrations || 0}</div>
              <p className="text-xs text-muted-foreground">Student registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Results</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.recent_results?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Available results</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Institution Status</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.institution_info?.is_verified ? "✓" : "⏳"}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.institution_info?.is_verified ? "Verified" : "Pending"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
              <CardDescription>Latest published results for your students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recent_results?.length ? (
                  dashboardData.recent_results.slice(0, 5).map((result) => (
                    <div key={result.result_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Student Result</h4>
                        <p className="text-sm text-gray-600">Grade: {result.grade || "N/A"}</p>
                        <p className="text-xs text-gray-500">Status: {result.status}</p>
                      </div>
                      <Link href="/dashboard/institution-admin/results">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No recent results</p>
                )}
                <Link href="/dashboard/institution-admin/results">
                  <Button variant="outline" className="w-full">
                    View All Results
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/dashboard/institution-admin/students">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Students
                  </Button>
                </Link>
                <Link href="/dashboard/institution-admin/registrations">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Registrations
                  </Button>
                </Link>
                <Link href="/dashboard/institution-admin/results">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </InstitutionalAdminGuard>
  )
}
