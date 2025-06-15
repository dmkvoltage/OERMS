"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import DashboardLayout  from "@/components/dashboard-layout"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Award,
  Download,
  Filter,
  MapPin,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

export default function ExamBodyAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [examFilter, setExamFilter] = useState("all")

  const performanceData = [
    { month: "Jan", registrations: 1200, passRate: 78, completionRate: 95 },
    { month: "Feb", registrations: 1800, passRate: 82, completionRate: 97 },
    { month: "Mar", registrations: 2200, passRate: 75, completionRate: 93 },
    { month: "Apr", registrations: 1600, passRate: 80, completionRate: 96 },
    { month: "May", registrations: 2800, passRate: 77, completionRate: 94 },
    { month: "Jun", registrations: 3200, passRate: 83, completionRate: 98 },
  ]

  const examTypeData = [
    { name: "National Exams", value: 45, count: 8456 },
    { name: "Entrance Exams", value: 30, count: 5632 },
    { name: "Professional Certs", value: 15, count: 2814 },
    { name: "International", value: 10, count: 1876 },
  ]

  const regionalData = [
    { region: "Centre", registrations: 2456, passRate: 85, venues: 45 },
    { region: "Littoral", registrations: 2134, passRate: 82, venues: 38 },
    { region: "West", registrations: 1876, passRate: 79, venues: 32 },
    { region: "Northwest", registrations: 1654, passRate: 77, venues: 28 },
    { region: "Southwest", registrations: 1432, passRate: 74, venues: 25 },
    { region: "North", registrations: 1298, passRate: 71, venues: 22 },
    { region: "Adamawa", registrations: 1156, passRate: 68, venues: 19 },
    { region: "East", registrations: 1034, passRate: 65, venues: 17 },
    { region: "Far North", registrations: 876, passRate: 62, venues: 15 },
    { region: "South", registrations: 654, passRate: 59, venues: 12 },
  ]

  const subjectPerformance = [
    { subject: "Mathematics", candidates: 8456, passRate: 72, avgScore: 68 },
    { subject: "English", candidates: 7834, passRate: 85, avgScore: 74 },
    { subject: "Physics", candidates: 5632, passRate: 68, avgScore: 65 },
    { subject: "Chemistry", candidates: 5234, passRate: 71, avgScore: 67 },
    { subject: "Biology", candidates: 4876, passRate: 79, avgScore: 72 },
    { subject: "French", candidates: 6543, passRate: 82, avgScore: 75 },
  ]

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

  const stats = [
    {
      title: "Total Candidates",
      value: "18,456",
      description: "This examination cycle",
      icon: Users,
      trend: "+12%",
      trendUp: true,
      color: "blue",
    },
    {
      title: "Average Pass Rate",
      value: "78.5%",
      description: "Across all examinations",
      icon: Award,
      trend: "+2.3%",
      trendUp: true,
      color: "green",
    },
    {
      title: "Completion Rate",
      value: "95.8%",
      description: "Exam completion",
      icon: CheckCircle,
      trend: "+1.2%",
      trendUp: true,
      color: "purple",
    },
    {
      title: "Active Venues",
      value: "253",
      description: "Examination centers",
      icon: MapPin,
      trend: "+8",
      trendUp: true,
      color: "orange",
    },
  ]

  const recentExams = [
    {
      name: "GCE Advanced Level",
      date: "2024-03-15",
      candidates: 2456,
      status: "completed",
      passRate: 82,
    },
    {
      name: "BEPC Examination",
      date: "2024-04-10",
      candidates: 3200,
      status: "ongoing",
      passRate: null,
    },
    {
      name: "University Entrance",
      date: "2024-03-01",
      candidates: 1800,
      status: "completed",
      passRate: 75,
    },
  ]

  return (
    <DashboardLayout userRole="exam_body" userName="Prof. Michael Chen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Examination Analytics</h1>
            <span className="text-slate-600 dark:text-slate-400">Comprehensive examination performance insights</span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</span>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="flex items-center gap-1">
                      {stat.trendUp ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`text-xs ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                        {stat.trend}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-500">{stat.description}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Performance Trends</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Registration and pass rate trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="passRate"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Exam Type Distribution */}
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Examination Types</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Distribution of examination types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={examTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {examTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {examTypeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div className="text-sm">
                      <div className="font-medium text-slate-900 dark:text-white">{item.name}</div>
                      <div className="text-slate-600 dark:text-slate-400">{item.count.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Performance */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Regional Performance</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Examination performance across all regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="registrations" fill="#3b82f6" />
                <Bar dataKey="passRate" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Performance */}
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                Subject Performance
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Performance analysis by subject
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjectPerformance.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{subject.subject}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {subject.candidates.toLocaleString()} candidates
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-slate-900 dark:text-white">{subject.passRate}%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Avg: {subject.avgScore}%</div>
                    </div>
                  </div>
                  <Progress value={subject.passRate} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Examinations */}
          <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                Recent Examinations
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Latest examination results and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentExams.map((exam, index) => (
                <div key={index} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-slate-900 dark:text-white">{exam.name}</div>
                    <Badge
                      variant="outline"
                      className={
                        exam.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      }
                    >
                      {exam.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Date:</span>
                      <div className="font-medium text-slate-900 dark:text-white">{exam.date}</div>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Candidates:</span>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {exam.candidates.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {exam.passRate && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Pass Rate</span>
                        <span className="text-slate-900 dark:text-white">{exam.passRate}%</span>
                      </div>
                      <Progress value={exam.passRate} className="h-2" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Common analytics and reporting tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                <span>Generate Report</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Download className="w-6 h-6" />
                <span>Export Data</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span>Schedule Report</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Filter className="w-6 h-6" />
                <span>Custom Filter</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
