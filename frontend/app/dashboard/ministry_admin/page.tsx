"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  MapPin,
  FileText,
  AlertCircle,
  Clock,
  BarChart3,
} from "lucide-react"
import { motion } from "framer-motion"

export default function MinistryAdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024")

  const stats = [
    {
      title: "Total Institutions",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Active Exams",
      value: "156",
      change: "+8%",
      icon: BookOpen,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Total Students",
      value: "1.2M",
      change: "+15%",
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Pass Rate",
      value: "78.5%",
      change: "+3.2%",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "exam",
      title: "BEPC 2024 Results Published",
      description: "Results for 45,000 candidates released",
      time: "2 hours ago",
      status: "completed",
      icon: Award,
    },
    {
      id: 2,
      type: "institution",
      title: "New Institution Registered",
      description: "Lycée Technique de Bafoussam approved",
      time: "5 hours ago",
      status: "pending",
      icon: Users,
    },
    {
      id: 3,
      type: "system",
      title: "System Maintenance Scheduled",
      description: "Planned maintenance on Sunday 2AM-4AM",
      time: "1 day ago",
      status: "scheduled",
      icon: AlertCircle,
    },
  ]

  const regionalData = [
    { region: "Centre", institutions: 485, students: "245K", passRate: 82.1 },
    { region: "Littoral", institutions: 392, students: "198K", passRate: 79.8 },
    { region: "Ouest", institutions: 456, students: "187K", passRate: 76.5 },
    { region: "Nord-Ouest", institutions: 298, students: "156K", passRate: 74.2 },
    { region: "Sud-Ouest", institutions: 267, students: "142K", passRate: 73.8 },
  ]

  return (
    <DashboardLayout userRole="ministry_admin" userName="Dr. Marie Ngozi">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ministry Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">National education system overview and management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-emerald-600 font-medium">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Latest system activities and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activity.status === "completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : activity.status === "pending"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.title}</h4>
                        <Badge
                          variant={
                            activity.status === "completed"
                              ? "default"
                              : activity.status === "pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Regional Overview */}
          <div>
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Regional Overview
                </CardTitle>
                <CardDescription>Top performing regions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {regionalData.map((region, index) => (
                  <div key={region.region} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{region.region}</span>
                      <Badge variant="outline">{region.passRate}%</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {region.institutions} institutions • {region.students} students
                    </div>
                    <Progress value={region.passRate} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Users className="w-6 h-6" />
                <span className="text-sm">Manage Institutions</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                <span className="text-sm">Schedule Exams</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Award className="w-6 h-6" />
                <span className="text-sm">View Results</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
