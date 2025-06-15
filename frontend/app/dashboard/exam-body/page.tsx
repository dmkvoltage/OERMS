"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import DashboardLayout  from "@/components/dashboard-layout"
import { LiveDataWrapper } from "@/components/real-time/live-data-wrapper"
import { LiveCounter } from "@/components/real-time/live-counter"
import { LiveChart } from "@/components/real-time/live-chart"
import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardList,
  Download,
  FileText,
  Users,
  AlertCircle,
  Clock,
  TrendingUp,
} from "lucide-react"

export default function ExamBodyDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for real-time updates
  const examStats = {
    totalExams: 24,
    activeExams: 8,
    upcomingExams: 12,
    completedExams: 4,
  }

  const registrationStats = {
    totalRegistrations: 156789,
    pendingApprovals: 2345,
    approvedRegistrations: 152567,
    rejectedRegistrations: 1877,
  }

  const resultStats = {
    totalResults: 142567,
    published: 138902,
    pending: 3665,
    passRate: 78.4,
  }

  const recentExams = [
    {
      id: 1,
      name: "GCE Advanced Level 2024",
      date: "2024-06-15",
      registrations: 45678,
      status: "active",
      progress: 65,
    },
    {
      id: 2,
      name: "BEPC Examination 2024",
      date: "2024-06-20",
      registrations: 78945,
      status: "upcoming",
      progress: 0,
    },
    {
      id: 3,
      name: "University Entrance Exam",
      date: "2024-05-30",
      registrations: 34567,
      status: "completed",
      progress: 100,
    },
    {
      id: 4,
      name: "Professional Certification",
      date: "2024-07-05",
      registrations: 12456,
      status: "upcoming",
      progress: 0,
    },
  ]

  const registrationChartData = [
    { name: "Jan", value: 12500 },
    { name: "Feb", value: 18700 },
    { name: "Mar", value: 15600 },
    { name: "Apr", value: 22400 },
    { name: "May", value: 19800 },
    { name: "Jun", value: 24500 },
    { name: "Jul", value: 28900 },
    { name: "Aug", value: 32100 },
    { name: "Sep", value: 29700 },
    { name: "Oct", value: 31200 },
  ]

  const passRateChartData = [
    { name: "Jan", value: 72.5 },
    { name: "Feb", value: 74.2 },
    { name: "Mar", value: 73.8 },
    { name: "Apr", value: 75.6 },
    { name: "May", value: 76.1 },
    { name: "Jun", value: 77.3 },
    { name: "Jul", value: 78.4 },
    { name: "Aug", value: 77.9 },
    { name: "Sep", value: 79.2 },
    { name: "Oct", value: 78.7 },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Clock className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "upcoming":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Calendar className="w-3 h-3 mr-1" />
            Upcoming
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
    }
  }

  return (
    <DashboardLayout userRole="exam_body" userName="Prof. Michael Chen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Exam Body Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Welcome back, Prof. Chen. Here's what's happening with your examinations.
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <LiveCounter
                  endpoint="examStats/totalExams"
                  initialCount={examStats.totalExams}
                  label="Total Examinations"
                  showBadge={false}
                />
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <LiveCounter
                  endpoint="registrationStats/totalRegistrations"
                  initialCount={registrationStats.totalRegistrations}
                  label="Total Registrations"
                  showBadge={false}
                />
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <LiveCounter
                  endpoint="resultStats/totalResults"
                  initialCount={resultStats.totalResults}
                  label="Total Results"
                  showBadge={false}
                />
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Pass Rate</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{resultStats.passRate}%</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">+2.1%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LiveChart
                endpoint="registrationChart"
                title="Registration Trends"
                description="Monthly registration statistics"
                initialData={registrationChartData}
                dataKey="value"
                color="#3b82f6"
              />

              <LiveChart
                endpoint="passRateChart"
                title="Pass Rate Trends"
                description="Monthly pass rate statistics"
                initialData={passRateChartData}
                dataKey="value"
                color="#10b981"
              />
            </div>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Recent Examinations</CardTitle>
                <CardDescription>Status of your most recent examinations</CardDescription>
              </CardHeader>
              <CardContent>
                <LiveDataWrapper endpoint="recentExams" initialData={recentExams} pollingInterval={20000}>
                  {(data, isLoading) => (
                    <div className="space-y-4">
                      {data.map((exam) => (
                        <div key={exam.id} className="p-4 border rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-slate-900 dark:text-white">{exam.name}</h3>
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                  <Calendar className="w-4 h-4" />
                                  {exam.date}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                  <Users className="w-4 h-4" />
                                  {exam.registrations.toLocaleString()} registrations
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </LiveDataWrapper>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations">
            <p>This is the registrations tab content.</p>
          </TabsContent>

          <TabsContent value="results">
            <p>This is the results tab content.</p>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
