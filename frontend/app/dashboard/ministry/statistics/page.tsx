"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import {
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  Building2,
  FileText,
  Printer,
  Share2,
} from "lucide-react"

// Sample data for charts and statistics
const yearlyData = {
  years: ["2020", "2021", "2022", "2023", "2024"],
  enrollment: [4850000, 4920000, 5010000, 5090000, 5180000],
  passRates: [69.8, 71.2, 72.5, 73.7, 74.9],
  institutions: [3450, 3510, 3560, 3617, 3680],
}

const genderData = {
  primary: { male: 51.2, female: 48.8 },
  secondary: { male: 53.5, female: 46.5 },
  tertiary: { male: 57.8, female: 42.2 },
}

const regionData = [
  { name: "Centre", passRate: 78.4, enrollment: 980000 },
  { name: "Littoral", passRate: 76.2, enrollment: 850000 },
  { name: "West", passRate: 79.5, enrollment: 520000 },
  { name: "South West", passRate: 74.8, enrollment: 420000 },
  { name: "North West", passRate: 72.5, enrollment: 450000 },
  { name: "Far North", passRate: 68.3, enrollment: 680000 },
  { name: "Adamawa", passRate: 70.1, enrollment: 320000 },
  { name: "East", passRate: 71.9, enrollment: 280000 },
  { name: "North", passRate: 69.4, enrollment: 350000 },
  { name: "South", passRate: 75.6, enrollment: 240000 },
]

const examTypes = [
  { name: "Baccalauréat", candidates: 145000, passRate: 74.2 },
  { name: "GCE A Level", candidates: 32000, passRate: 76.8 },
  { name: "GCE O Level", candidates: 85000, passRate: 72.5 },
  { name: "BEPC", candidates: 210000, passRate: 71.3 },
  { name: "CEP", candidates: 320000, passRate: 82.1 },
  { name: "CAP", candidates: 45000, passRate: 68.7 },
]

const subjectPerformance = [
  { subject: "Mathematics", avgScore: 68.5, trend: "up", change: 2.3 },
  { subject: "Physics", avgScore: 65.2, trend: "up", change: 1.8 },
  { subject: "Chemistry", avgScore: 67.9, trend: "up", change: 3.1 },
  { subject: "Biology", avgScore: 72.4, trend: "up", change: 2.5 },
  { subject: "English", avgScore: 75.8, trend: "up", change: 1.2 },
  { subject: "French", avgScore: 74.3, trend: "down", change: 0.8 },
  { subject: "History", avgScore: 71.6, trend: "up", change: 1.5 },
  { subject: "Geography", avgScore: 70.2, trend: "down", change: 1.1 },
  { subject: "Computer Science", avgScore: 76.5, trend: "up", change: 4.2 },
  { subject: "Economics", avgScore: 69.8, trend: "up", change: 2.7 },
]

export default function MinistryStatisticsPage() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedExamType, setSelectedExamType] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")

  return (
    <DashboardLayout userRole="ministry_admin" userName="Dr. Marie Ngozi">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              National Statistics
            </h1>
            <p className="text-muted-foreground mt-2">Comprehensive educational statistics and performance metrics</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {yearlyData.years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-5" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold mt-2">5.18M</p>
                  <div className="flex items-center mt-2 text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+1.8% from last year</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-5" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">National Pass Rate</p>
                  <p className="text-3xl font-bold mt-2">74.9%</p>
                  <div className="flex items-center mt-2 text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+1.2% from last year</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-5" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Institutions</p>
                  <p className="text-3xl font-bold mt-2">3,680</p>
                  <div className="flex items-center mt-2 text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+63 from last year</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-600">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Statistics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Yearly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>National Education Trends (2020-2024)</CardTitle>
                <CardDescription>Key metrics over the past 5 years</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <LineChart className="w-12 h-12 mr-2" />
                  <span>Yearly trend chart would render here</span>
                </div>
              </CardContent>
            </Card>

            {/* Regional Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance Comparison</CardTitle>
                <CardDescription>Pass rates across all 10 regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionData
                    .sort((a, b) => b.passRate - a.passRate)
                    .map((region, index) => (
                      <div key={region.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium mr-2">
                              {index + 1}
                            </div>
                            <span className="font-medium">{region.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">{region.enrollment.toLocaleString()} students</Badge>
                            <span className="font-semibold">{region.passRate}%</span>
                          </div>
                        </div>
                        <Progress value={region.passRate} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Subject Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Average scores by subject area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjectPerformance
                      .sort((a, b) => b.avgScore - a.avgScore)
                      .slice(0, 5)
                      .map((subject) => (
                        <div key={subject.subject} className="flex items-center justify-between">
                          <span className="font-medium">{subject.subject}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold">{subject.avgScore}%</span>
                            <div
                              className={`flex items-center ${subject.trend === "up" ? "text-green-600" : "text-red-600"}`}
                            >
                              {subject.trend === "up" ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              <span className="text-sm ml-1">{subject.change}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Institutional Distribution</CardTitle>
                  <CardDescription>Breakdown by institution type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Primary Schools</span>
                        <span className="font-medium">3,251 (88.3%)</span>
                      </div>
                      <Progress value={88.3} className="h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Secondary Schools</span>
                        <span className="font-medium">411 (11.2%)</span>
                      </div>
                      <Progress value={11.2} className="h-2 bg-purple-100" indicatorClassName="bg-purple-600" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Universities</span>
                        <span className="font-medium">18 (0.5%)</span>
                      </div>
                      <Progress value={0.5} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exams" className="space-y-6">
            {/* Exam Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Examination Statistics by Type</CardTitle>
                <CardDescription>Performance metrics for different examination types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="text-left p-3 font-medium">Examination</th>
                        <th className="text-center p-3 font-medium">Candidates</th>
                        <th className="text-center p-3 font-medium">Pass Rate</th>
                        <th className="text-center p-3 font-medium">Grade Distribution</th>
                        <th className="text-right p-3 font-medium">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examTypes.map((exam) => (
                        <tr key={exam.name} className="border-t">
                          <td className="p-3 font-medium">{exam.name}</td>
                          <td className="p-3 text-center">{exam.candidates.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {exam.passRate}%
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${exam.passRate}%` }} />
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end text-green-600">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              <span className="text-sm">+2.1%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Overall grade distribution across all examinations</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center">
                  <div className="text-muted-foreground flex items-center">
                    <PieChart className="w-12 h-12 mr-2" />
                    <span>Grade distribution chart would render here</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Examination Calendar</CardTitle>
                  <CardDescription>Upcoming examination schedules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-medium">Baccalauréat</div>
                        <div className="text-sm text-muted-foreground">June 15-25, 2024</div>
                      </div>
                      <Badge>Upcoming</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium">GCE A Level</div>
                        <div className="text-sm text-muted-foreground">May 20-30, 2024</div>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <div>
                        <div className="font-medium">BEPC</div>
                        <div className="text-sm text-muted-foreground">June 5-10, 2024</div>
                      </div>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6">
            {/* Gender Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Primary Education</CardTitle>
                  <CardDescription>Gender distribution in primary schools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Male Students</span>
                        <span className="font-medium">{genderData.primary.male}%</span>
                      </div>
                      <Progress
                        value={genderData.primary.male}
                        className="h-2 bg-blue-100"
                        indicatorClassName="bg-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Female Students</span>
                        <span className="font-medium">{genderData.primary.female}%</span>
                      </div>
                      <Progress
                        value={genderData.primary.female}
                        className="h-2 bg-pink-100"
                        indicatorClassName="bg-pink-600"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Secondary Education</CardTitle>
                  <CardDescription>Gender distribution in secondary schools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Male Students</span>
                        <span className="font-medium">{genderData.secondary.male}%</span>
                      </div>
                      <Progress
                        value={genderData.secondary.male}
                        className="h-2 bg-blue-100"
                        indicatorClassName="bg-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Female Students</span>
                        <span className="font-medium">{genderData.secondary.female}%</span>
                      </div>
                      <Progress
                        value={genderData.secondary.female}
                        className="h-2 bg-pink-100"
                        indicatorClassName="bg-pink-600"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tertiary Education</CardTitle>
                  <CardDescription>Gender distribution in universities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Male Students</span>
                        <span className="font-medium">{genderData.tertiary.male}%</span>
                      </div>
                      <Progress
                        value={genderData.tertiary.male}
                        className="h-2 bg-blue-100"
                        indicatorClassName="bg-blue-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Female Students</span>
                        <span className="font-medium">{genderData.tertiary.female}%</span>
                      </div>
                      <Progress
                        value={genderData.tertiary.female}
                        className="h-2 bg-pink-100"
                        indicatorClassName="bg-pink-600"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution by Education Level</CardTitle>
                <CardDescription>Student age demographics across different education levels</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-muted-foreground flex items-center">
                  <BarChart3 className="w-12 h-12 mr-2" />
                  <span>Age distribution chart would render here</span>
                </div>
              </CardContent>
            </Card>

            {/* Urban vs Rural */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Urban vs Rural Distribution</CardTitle>
                  <CardDescription>Student distribution by location type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Urban Areas</span>
                        <span className="font-medium">62.3%</span>
                      </div>
                      <Progress value={62.3} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rural Areas</span>
                        <span className="font-medium">37.7%</span>
                      </div>
                      <Progress value={37.7} className="h-2 bg-amber-100" indicatorClassName="bg-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Language of Instruction</CardTitle>
                  <CardDescription>Distribution by primary language of instruction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>French</span>
                        <span className="font-medium">78.5%</span>
                      </div>
                      <Progress value={78.5} className="h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>English</span>
                        <span className="font-medium">21.5%</span>
                      </div>
                      <Progress value={21.5} className="h-2 bg-red-100" indicatorClassName="bg-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Historical Trends */}
            <Card>
              <CardHeader>
                <CardTitle>5-Year Historical Trends</CardTitle>
                <CardDescription>Key performance indicators over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <LineChart className="w-12 h-12 mr-2" />
                  <span>Multi-line trend chart would render here</span>
                </div>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Projections</CardTitle>
                  <CardDescription>Projected student enrollment for next 3 years</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>2025 (Projected)</span>
                      <div className="flex items-center">
                        <span className="font-semibold">5.35M</span>
                        <TrendingUp className="w-4 h-4 ml-2 text-green-600" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>2026 (Projected)</span>
                      <div className="flex items-center">
                        <span className="font-semibold">5.52M</span>
                        <TrendingUp className="w-4 h-4 ml-2 text-green-600" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>2027 (Projected)</span>
                      <div className="flex items-center">
                        <span className="font-semibold">5.71M</span>
                        <TrendingUp className="w-4 h-4 ml-2 text-green-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Forecasts</CardTitle>
                  <CardDescription>Expected pass rate improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>2025 Target</span>
                      <div className="flex items-center">
                        <span className="font-semibold">76.5%</span>
                        <Badge variant="outline" className="ml-2">
                          +1.6%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>2026 Target</span>
                      <div className="flex items-center">
                        <span className="font-semibold">78.2%</span>
                        <Badge variant="outline" className="ml-2">
                          +1.7%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>2027 Target</span>
                      <div className="flex items-center">
                        <span className="font-semibold">80.0%</span>
                        <Badge variant="outline" className="ml-2">
                          +1.8%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Improvement Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Areas for Improvement</CardTitle>
                <CardDescription>Identified challenges and improvement opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-600">Challenges</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm">Rural-Urban Performance Gap</span>
                        <Badge variant="destructive">High Priority</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                        <span className="text-sm">Gender Disparity in STEM</span>
                        <Badge variant="secondary">Medium Priority</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                        <span className="text-sm">Teacher-Student Ratio</span>
                        <Badge variant="secondary">Medium Priority</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-600">Opportunities</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">Digital Learning Integration</span>
                        <Badge className="bg-green-600">High Impact</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">Teacher Training Programs</span>
                        <Badge variant="outline">Medium Impact</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">Infrastructure Development</span>
                        <Badge variant="outline">Medium Impact</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export & Sharing Options</CardTitle>
            <CardDescription>Generate reports and share statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                PDF Report
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Excel Export
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print Summary
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
