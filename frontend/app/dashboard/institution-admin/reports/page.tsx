"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  CalendarIcon,
  Filter,
  Eye,
  Share,
  Printer,
} from "lucide-react"
import DashboardLayout  from "@/components/dashboard-layout"

export default function InstitutionReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current_semester")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedReportType, setSelectedReportType] = useState("academic")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // Mock report data
  const academicReports = {
    overview: {
      totalStudents: 2847,
      activeExams: 24,
      completedExams: 156,
      averageGPA: 3.2,
      passRate: 87.5,
      graduationRate: 92.3,
    },
    departmentPerformance: [
      {
        department: "Computer Science",
        students: 856,
        averageGPA: 3.4,
        passRate: 89.2,
        topPerformers: 45,
        improvement: 5.2,
      },
      {
        department: "Mathematics",
        students: 743,
        averageGPA: 3.6,
        passRate: 91.8,
        topPerformers: 52,
        improvement: 3.1,
      },
      {
        department: "Physics",
        students: 654,
        averageGPA: 3.1,
        passRate: 84.7,
        topPerformers: 38,
        improvement: -1.2,
      },
      {
        department: "Chemistry",
        students: 594,
        averageGPA: 3.3,
        passRate: 88.1,
        topPerformers: 41,
        improvement: 2.8,
      },
    ],
    examStatistics: [
      {
        examName: "Advanced Mathematics",
        totalRegistrations: 245,
        completed: 238,
        passRate: 82.4,
        averageScore: 76.8,
        difficulty: "High",
      },
      {
        examName: "Computer Programming",
        totalRegistrations: 189,
        completed: 185,
        passRate: 91.2,
        averageScore: 84.3,
        difficulty: "Medium",
      },
      {
        examName: "Quantum Physics",
        totalRegistrations: 156,
        completed: 152,
        passRate: 78.9,
        averageScore: 72.1,
        difficulty: "High",
      },
      {
        examName: "Organic Chemistry",
        totalRegistrations: 203,
        completed: 198,
        passRate: 85.7,
        averageScore: 79.2,
        difficulty: "Medium",
      },
    ],
  }

  const financialReports = {
    revenue: {
      totalRevenue: 142500000,
      examFees: 89750000,
      registrationFees: 52750000,
      growth: 12.5,
    },
    expenses: {
      totalExpenses: 98200000,
      operationalCosts: 65400000,
      staffCosts: 32800000,
      reduction: 8.3,
    },
    feeCollection: [
      { month: "January", collected: 12500000, pending: 2300000, rate: 84.5 },
      { month: "February", collected: 15200000, pending: 1800000, rate: 89.4 },
      { month: "March", collected: 18700000, pending: 2100000, rate: 89.9 },
      { month: "April", collected: 16800000, pending: 1500000, rate: 91.8 },
    ],
  }

  const operationalReports = {
    staffMetrics: {
      totalStaff: 145,
      activeStaff: 138,
      onLeave: 7,
      efficiency: 94.8,
    },
    systemUsage: {
      dailyActiveUsers: 1247,
      peakUsage: 2156,
      systemUptime: 99.7,
      supportTickets: 23,
    },
    facilities: [
      { name: "Examination Halls", capacity: 2400, utilization: 78.5, status: "Good" },
      { name: "Computer Labs", capacity: 480, utilization: 92.1, status: "Excellent" },
      { name: "Library", capacity: 800, utilization: 65.3, status: "Good" },
      { name: "Auditoriums", capacity: 1200, utilization: 45.2, status: "Fair" },
    ],
  }

  const quickReports = [
    {
      title: "Student Performance Summary",
      description: "Comprehensive academic performance analysis",
      type: "academic",
      lastGenerated: "2024-01-15",
      size: "2.4 MB",
    },
    {
      title: "Financial Statement",
      description: "Monthly financial overview and analysis",
      type: "financial",
      lastGenerated: "2024-01-14",
      size: "1.8 MB",
    },
    {
      title: "Exam Registration Report",
      description: "Registration statistics and trends",
      type: "operational",
      lastGenerated: "2024-01-13",
      size: "3.1 MB",
    },
    {
      title: "Department Comparison",
      description: "Cross-department performance metrics",
      type: "academic",
      lastGenerated: "2024-01-12",
      size: "2.7 MB",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "High":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Low":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      case "Good":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      case "Fair":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Poor":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <DashboardLayout userRole="institution-admin" userName="Dr. Sarah Wilson">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Comprehensive institutional reporting and data analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Report Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium">Report Period</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current_semester">Current Semester</SelectItem>
                    <SelectItem value="last_semester">Last Semester</SelectItem>
                    <SelectItem value="academic_year">Academic Year</SelectItem>
                    <SelectItem value="last_year">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="computer_science">Computer Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium">Report Type</Label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic Performance</SelectItem>
                    <SelectItem value="financial">Financial Analysis</SelectItem>
                    <SelectItem value="operational">Operational Metrics</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Tabs */}
        <Tabs defaultValue="academic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="operational">Operational</TabsTrigger>
            <TabsTrigger value="quick">Quick Reports</TabsTrigger>
          </TabsList>

          {/* Academic Reports */}
          <TabsContent value="academic" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {academicReports.overview.totalStudents.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500">Total Students</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {academicReports.overview.activeExams}
                    </div>
                    <div className="text-xs text-slate-500">Active Exams</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Award className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {academicReports.overview.completedExams}
                    </div>
                    <div className="text-xs text-slate-500">Completed</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {academicReports.overview.averageGPA}
                    </div>
                    <div className="text-xs text-slate-500">Average GPA</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto text-red-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {academicReports.overview.passRate}%
                    </div>
                    <div className="text-xs text-slate-500">Pass Rate</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Award className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {academicReports.overview.graduationRate}%
                    </div>
                    <div className="text-xs text-slate-500">Graduation Rate</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Department Performance Analysis
                </CardTitle>
                <CardDescription>Comparative performance metrics across all departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {academicReports.departmentPerformance.map((dept, index) => (
                    <div key={index} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">{dept.department}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{dept.students} students</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {dept.improvement > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span
                            className={`text-sm font-medium ${dept.improvement > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {dept.improvement > 0 ? "+" : ""}
                            {dept.improvement}%
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Average GPA</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">{dept.averageGPA}</div>
                          <Progress value={(dept.averageGPA / 4) * 100} className="h-2 mt-1" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Pass Rate</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">{dept.passRate}%</div>
                          <Progress value={dept.passRate} className="h-2 mt-1" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Top Performers</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {dept.topPerformers}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">students</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exam Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Exam Performance Statistics
                </CardTitle>
                <CardDescription>Detailed analysis of individual exam performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {academicReports.examStatistics.map((exam, index) => (
                    <div key={index} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">{exam.examName}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {exam.completed} of {exam.totalRegistrations} completed
                          </p>
                        </div>
                        <Badge variant="outline" className={getDifficultyColor(exam.difficulty)}>
                          {exam.difficulty} Difficulty
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Completion Rate</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {((exam.completed / exam.totalRegistrations) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Pass Rate</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">{exam.passRate}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Average Score</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {exam.averageScore}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Total Registered</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {exam.totalRegistrations}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Reports */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Revenue Overview
                  </CardTitle>
                  <CardDescription>Total revenue and growth metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {(financialReports.revenue.totalRevenue / 1000000).toFixed(1)}M FCFA
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">+{financialReports.revenue.growth}% growth</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Exam Fees</span>
                      <span className="font-medium">{(financialReports.revenue.examFees / 1000000).toFixed(1)}M</span>
                    </div>
                    <Progress
                      value={(financialReports.revenue.examFees / financialReports.revenue.totalRevenue) * 100}
                      className="h-2"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Registration Fees</span>
                      <span className="font-medium">
                        {(financialReports.revenue.registrationFees / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <Progress
                      value={(financialReports.revenue.registrationFees / financialReports.revenue.totalRevenue) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Expenses Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Expenses Overview
                  </CardTitle>
                  <CardDescription>Total expenses and cost optimization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {(financialReports.expenses.totalExpenses / 1000000).toFixed(1)}M FCFA
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Total Expenses</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <TrendingDown className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">-{financialReports.expenses.reduction}% reduction</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Operational Costs</span>
                      <span className="font-medium">
                        {(financialReports.expenses.operationalCosts / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <Progress
                      value={
                        (financialReports.expenses.operationalCosts / financialReports.expenses.totalExpenses) * 100
                      }
                      className="h-2"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Staff Costs</span>
                      <span className="font-medium">
                        {(financialReports.expenses.staffCosts / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <Progress
                      value={(financialReports.expenses.staffCosts / financialReports.expenses.totalExpenses) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fee Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Fee Collection Analysis
                </CardTitle>
                <CardDescription>Monthly fee collection rates and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialReports.feeCollection.map((month, index) => (
                    <div key={index} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-900 dark:text-white">{month.month}</h4>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                        >
                          {month.rate}% collected
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Collected</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {(month.collected / 1000000).toFixed(1)}M FCFA
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Pending</div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {(month.pending / 1000000).toFixed(1)}M FCFA
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">Collection Rate</div>
                          <Progress value={month.rate} className="h-2 mt-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operational Reports */}
          <TabsContent value="operational" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Staff Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Staff Metrics
                  </CardTitle>
                  <CardDescription>Staff performance and availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {operationalReports.staffMetrics.totalStaff}
                      </div>
                      <div className="text-xs text-slate-500">Total Staff</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {operationalReports.staffMetrics.activeStaff}
                      </div>
                      <div className="text-xs text-slate-500">Active</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Efficiency Rate</span>
                      <span className="font-medium">{operationalReports.staffMetrics.efficiency}%</span>
                    </div>
                    <Progress value={operationalReports.staffMetrics.efficiency} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* System Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    System Usage
                  </CardTitle>
                  <CardDescription>Platform usage and performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {operationalReports.systemUsage.dailyActiveUsers.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">Daily Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {operationalReports.systemUsage.systemUptime}%
                      </div>
                      <div className="text-xs text-slate-500">System Uptime</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Support Tickets</span>
                      <span className="font-medium">{operationalReports.systemUsage.supportTickets} open</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Facilities Utilization
                </CardTitle>
                <CardDescription>Infrastructure usage and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operationalReports.facilities.map((facility, index) => (
                    <div key={index} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">{facility.name}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Capacity: {facility.capacity}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(facility.status)}>
                          {facility.status}
                        </Badge>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Utilization Rate</span>
                          <span className="font-medium">{facility.utilization}%</span>
                        </div>
                        <Progress value={facility.utilization} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Reports */}
          <TabsContent value="quick" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Pre-generated Reports
                </CardTitle>
                <CardDescription>Ready-to-download reports and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickReports.map((report, index) => (
                    <Card key={index} className="border border-slate-200 dark:border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 dark:text-white">{report.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{report.description}</p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {report.type}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                          <span>Last generated: {report.lastGenerated}</span>
                          <span>Size: {report.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Report Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="w-5 h-5" />
                  Custom Report Generator
                </CardTitle>
                <CardDescription>Create custom reports with specific parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Report Type</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic Performance</SelectItem>
                          <SelectItem value="financial">Financial Analysis</SelectItem>
                          <SelectItem value="operational">Operational Metrics</SelectItem>
                          <SelectItem value="student">Student Analytics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Time Period</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Last Week</SelectItem>
                          <SelectItem value="month">Last Month</SelectItem>
                          <SelectItem value="semester">Current Semester</SelectItem>
                          <SelectItem value="year">Academic Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Format</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
