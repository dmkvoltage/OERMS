"use client"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, Award, Settings, TrendingUp, Clock, FileText, BarChart3, Plus, Shield } from "lucide-react"
import { motion } from "framer-motion"

export default function InstitutionAdminDashboard() {
  const institutionStats = [
    {
      title: "Total Users",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Active Exams",
      value: "23",
      change: "+5%",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Pass Rate",
      value: "82.5%",
      change: "+3.2%",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Pending Reviews",
      value: "8",
      change: "-2",
      icon: Clock,
      color: "from-orange-500 to-red-600",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "user",
      title: "New Teacher Registration",
      description: "Prof. Marie Dubois registered",
      time: "2 hours ago",
      status: "pending",
      icon: Users,
    },
    {
      id: 2,
      type: "exam",
      title: "Exam Results Published",
      description: "Form 5 Mathematics results available",
      time: "5 hours ago",
      status: "completed",
      icon: Award,
    },
    {
      id: 3,
      type: "system",
      title: "System Update",
      description: "Platform updated to version 2.1.0",
      time: "1 day ago",
      status: "completed",
      icon: Settings,
    },
  ]

  const departmentStats = [
    { name: "Mathematics", teachers: 12, students: 245, passRate: 85.2 },
    { name: "Sciences", teachers: 8, students: 189, passRate: 78.9 },
    { name: "Languages", teachers: 15, students: 312, passRate: 82.1 },
    { name: "Social Studies", teachers: 6, students: 156, passRate: 79.3 },
  ]

  return (
    <DashboardLayout userRole="institution_admin" userName="Dr. Paul Nkomo">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Institution Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Lycée Général Leclerc - Administrative Overview</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {institutionStats.map((stat, index) => (
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
                    <span
                      className={`font-medium ${stat.change.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {stat.change}
                    </span>{" "}
                    from last month
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
                <CardDescription>Latest institutional activities</CardDescription>
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

          {/* Department Overview */}
          <div>
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Departments
                </CardTitle>
                <CardDescription>Department performance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <div key={dept.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{dept.name}</span>
                      <Badge variant="outline">{dept.passRate}%</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {dept.teachers} teachers • {dept.students} students
                    </div>
                    <Progress value={dept.passRate} className="h-2" />
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
                <span className="text-sm">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                <span className="text-sm">Schedule Exams</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">View Reports</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Settings className="w-6 h-6" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
