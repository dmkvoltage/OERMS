"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, ExternalLink, User, Building, BookOpen, Award } from "lucide-react"
import Link from "next/link"

export default function RouteTestingPage() {
  const [testedRoutes, setTestedRoutes] = useState<Set<string>>(new Set())

  const dashboardRoutes = {
    student: {
      icon: User,
      color: "purple",
      routes: [
        { path: "/dashboard/student", name: "Student Dashboard", description: "Main student overview" },
        { path: "/dashboard/student/exams", name: "My Exams", description: "Exam registration and schedule" },
        { path: "/dashboard/student/results", name: "Results", description: "Exam results and grades" },
        { path: "/dashboard/student/notifications", name: "Notifications", description: "Student notifications" },
        { path: "/dashboard/student/profile", name: "Profile", description: "Student profile management" },
        { path: "/dashboard/student/settings", name: "Settings", description: "Account settings" },
      ],
    },
    "institution-admin": {
      icon: Building,
      color: "blue",
      routes: [
        { path: "/dashboard/institution-admin", name: "Institution Dashboard", description: "Institution overview" },
        { path: "/dashboard/institution-admin/students", name: "Students", description: "Student management" },
        {
          path: "/dashboard/institution-admin/registrations",
          name: "Registrations",
          description: "Exam registrations",
        },
        { path: "/dashboard/institution-admin/results", name: "Results", description: "Results management" },
        { path: "/dashboard/institution-admin/reports", name: "Reports", description: "Institutional reports" },
        { path: "/dashboard/institution-admin/profile", name: "Profile", description: "Admin profile" },
        { path: "/dashboard/institution-admin/settings", name: "Settings", description: "Institution settings" },
      ],
    },
    "exam-body": {
      icon: BookOpen,
      color: "green",
      routes: [
        { path: "/dashboard/exam-body", name: "Exam Body Dashboard", description: "Examination body overview" },
        { path: "/dashboard/exam-body/examinations", name: "Examinations", description: "Exam management" },
        { path: "/dashboard/exam-body/registrations", name: "Registrations", description: "Registration oversight" },
        { path: "/dashboard/exam-body/results", name: "Results", description: "Results publication" },
        { path: "/dashboard/exam-body/analytics", name: "Analytics", description: "Performance analytics" },
        { path: "/dashboard/exam-body/profile", name: "Profile", description: "Body profile" },
        { path: "/dashboard/exam-body/settings", name: "Settings", description: "System settings" },
      ],
    },
    "ministry-admin": {
      icon: Award,
      color: "red",
      routes: [
        { path: "/dashboard/ministry-admin", name: "Ministry Dashboard", description: "National overview" },
        { path: "/dashboard/ministry-admin/institutions", name: "Institutions", description: "Institution management" },
        { path: "/dashboard/ministry-admin/exams", name: "Public Exams", description: "National examinations" },
        { path: "/dashboard/ministry-admin/results", name: "Results", description: "National results" },
        { path: "/dashboard/ministry-admin/analytics", name: "Analytics", description: "National analytics" },
        { path: "/dashboard/ministry-admin/profile", name: "Profile", description: "Ministry profile" },
        { path: "/dashboard/ministry-admin/settings", name: "Settings", description: "System configuration" },
      ],
    },
  }

  const markRouteTested = (route: string) => {
    setTestedRoutes((prev) => new Set([...prev, route]))
  }

  const getColorClasses = (color: string) => {
    const colors = {
      purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      green: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      red: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const totalRoutes = Object.values(dashboardRoutes).reduce((acc, role) => acc + role.routes.length, 0)
  const testedCount = testedRoutes.size

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Dashboard Route Testing</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive testing interface for all dashboard routes in the ExamPortal system. Click on any route to
            test its functionality.
          </p>

          {/* Progress Overview */}
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {testedCount} / {totalRoutes}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Routes Tested</div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(testedCount / totalRoutes) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Routes by Role */}
        <Tabs defaultValue="student" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {Object.entries(dashboardRoutes).map(([role, config]) => {
              const IconComponent = config.icon
              return (
                <TabsTrigger key={role} value={role} className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {role
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.entries(dashboardRoutes).map(([role, config]) => {
            const IconComponent = config.icon
            const roleTestedCount = config.routes.filter((route) => testedRoutes.has(route.path)).length

            return (
              <TabsContent key={role} value={role}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getColorClasses(config.color)}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {role
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}{" "}
                            Routes
                          </CardTitle>
                          <CardDescription>Test all routes for the {role.replace("-", " ")} role</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className={getColorClasses(config.color)}>
                        {roleTestedCount} / {config.routes.length} tested
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {config.routes.map((route) => {
                        const isTested = testedRoutes.has(route.path)

                        return (
                          <Card
                            key={route.path}
                            className={`border-2 transition-all duration-200 ${
                              isTested
                                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1">
                                    <h4 className="font-medium text-slate-900 dark:text-white">{route.name}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{route.description}</p>
                                  </div>
                                  {isTested ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <Link href={route.path} className="flex-1">
                                    <Button
                                      variant={isTested ? "default" : "outline"}
                                      size="sm"
                                      className="w-full"
                                      onClick={() => markRouteTested(route.path)}
                                    >
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Test Route
                                    </Button>
                                  </Link>
                                </div>

                                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded">
                                  {route.path}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>

        {/* Testing Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
            <CardDescription>How to effectively test the dashboard routes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-white">What to Test:</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Page loads without errors</li>
                  <li>• Navigation works correctly</li>
                  <li>• Data displays properly</li>
                  <li>• Interactive elements function</li>
                  <li>• Responsive design works</li>
                  <li>• Role-based access control</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-white">Expected Features:</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Dashboard statistics and metrics</li>
                  <li>• Data tables and lists</li>
                  <li>• Action buttons and forms</li>
                  <li>• Charts and visualizations</li>
                  <li>• Search and filtering</li>
                  <li>• Export and reporting tools</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
