"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building,
  Users,
  GraduationCap,
  TrendingUp,
  Award,
  Download,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/dashboard-layout"

export default function InstitutionAnalytics() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("semester")

  const institutionStats = [
    {
      title: "Total Students",
      value: "2,456",
      change: "+156",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Faculty Members",
      value: "89",
      change: "+5",
      trend: "up",
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Departments",
      value: "12",
      change: "+1",
      trend: "up",
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pass Rate",
      value: "87.3%",
      change: "+4.2%",
      trend: "up",
      icon: Award,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const departmentPerformance = [
    { name: "Computer Engineering", students: 456, passRate: 92.1, avgScore: 84.3, faculty: 12 },
    { name: "Electrical Engineering", students: 389, passRate: 89.7, avgScore: 82.1, faculty: 10 },
    { name: "Mechanical Engineering", students: 423, passRate: 87.4, avgScore: 80.5, faculty: 11 },
    { name: "Civil Engineering", students: 378, passRate: 85.9, avgScore: 79.2, faculty: 9 },
    { name: "Chemical Engineering", students: 234, passRate: 84.6, avgScore: 78.8, faculty: 8 },
    { name: "Biomedical Engineering", students: 189, passRate: 88.3, avgScore: 81.7, faculty: 7 },
  ]

  const facultyAnalytics = [
    { name: "Dr. John Smith", department: "Computer Engineering", students: 156, avgRating: 4.8, courses: 3 },
    { name: "Prof. Mary Johnson", department: "Electrical Engineering", students: 134, avgRating: 4.7, courses: 2 },
    { name: "Dr. Robert Brown", department: "Mechanical Engineering", students: 145, avgRating: 4.6, courses: 3 },
    { name: "Prof. Sarah Davis", department: "Civil Engineering", students: 123, avgRating: 4.5, courses: 2 },
    { name: "Dr. Michael Wilson", department: "Chemical Engineering", students: 98, avgRating: 4.4, courses: 2 },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <DashboardLayout userRole="institution_admin" userName="Dr. Alice Cooper">
      <div className="space-y-6">
        {/* Header */}
        <motion.div {...fadeInUp} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Institution Analytics</h1>
            <p className="text-slate-600 mt-1">University of Buea - Faculty of Engineering and Technology</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="computer">Computer Engineering</SelectItem>
                <SelectItem value="electrical">Electrical Engineering</SelectItem>
                <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semester">Semester</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {institutionStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                      <span className="text-sm text-slate-500 ml-1">this {selectedPeriod}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Analytics Tabs */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="departments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="departments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance Overview</CardTitle>
                  <CardDescription>Comparative analysis across all departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentPerformance.map((dept, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{dept.name}</h4>
                            <p className="text-sm text-slate-600">
                              {dept.students} students • {dept.faculty} faculty
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Pass Rate</div>
                            <div className="font-semibold text-lg text-green-600">{dept.passRate}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Avg Score</div>
                            <div className="font-semibold text-lg text-blue-600">{dept.avgScore}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Department Rankings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {departmentPerformance
                        .sort((a, b) => b.passRate - a.passRate)
                        .slice(0, 5)
                        .map((dept, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge variant={index === 0 ? "default" : "outline"}>#{index + 1}</Badge>
                              <span className="font-medium text-sm">{dept.name}</span>
                            </div>
                            <span className="font-semibold text-green-600">{dept.passRate}%</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resource Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentPerformance.slice(0, 4).map((dept, index) => {
                        const studentFacultyRatio = Math.round(dept.students / dept.faculty)
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{dept.name}</span>
                              <span className="text-sm text-slate-600">{studentFacultyRatio}:1 ratio</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${Math.min(studentFacultyRatio * 2, 100)}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="faculty" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Faculty Performance Analysis</CardTitle>
                  <CardDescription>Individual faculty member performance and student feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {facultyAnalytics.map((faculty, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {faculty.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{faculty.name}</h4>
                            <p className="text-sm text-slate-600">{faculty.department}</p>
                            <Badge variant="outline" className="mt-1">
                              {faculty.courses} courses
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Students</div>
                            <div className="font-semibold text-lg">{faculty.students}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Rating</div>
                            <div className="font-semibold text-lg text-yellow-600">{faculty.avgRating}/5.0</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Faculty Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Professors</span>
                        <span className="font-semibold">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Associate Professors</span>
                        <span className="font-semibold">34</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Assistant Professors</span>
                        <span className="font-semibold">32</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Teaching Load</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">27.6</div>
                      <div className="text-sm text-slate-600">Avg Students per Faculty</div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Light Load (≤20)</span>
                          <span>23 faculty</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Normal Load (21-35)</span>
                          <span>45 faculty</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Heavy Load (>35)</span>
                          <span>21 faculty</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Avg Student Rating</span>
                          <span className="text-sm text-slate-600">4.6/5.0</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "92%" }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Course Completion</span>
                          <span className="text-sm text-slate-600">96.8%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "97%" }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Enrollment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">2,456</div>
                      <div className="text-sm text-slate-600">Total Students</div>
                      <div className="mt-4 text-sm text-green-600 font-medium">+6.8% from last year</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Retention Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">94.2%</div>
                      <div className="text-sm text-slate-600">Student Retention</div>
                      <div className="mt-4 text-sm text-green-600 font-medium">+2.1% improvement</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Graduation Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">89.7%</div>
                      <div className="text-sm text-slate-600">On-time Graduation</div>
                      <div className="mt-4 text-sm text-green-600 font-medium">+1.8% improvement</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Employment Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">92.4%</div>
                      <div className="text-sm text-slate-600">Post-graduation Employment</div>
                      <div className="mt-4 text-sm text-green-600 font-medium">+3.5% improvement</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Student Demographics</CardTitle>
                  <CardDescription>Breakdown of student population by various demographics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">By Level</h4>
                      <div className="space-y-3">
                        {[
                          { level: "Level 100", count: 687, percentage: 28 },
                          { level: "Level 200", count: 634, percentage: 26 },
                          { level: "Level 300", count: 589, percentage: 24 },
                          { level: "Level 400", count: 546, percentage: 22 },
                        ].map((level, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{level.level}</span>
                              <span className="text-sm text-slate-600">{level.count} students</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${level.percentage * 3}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">By Gender</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Male</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "68%" }} />
                            </div>
                            <span className="text-sm font-medium">68%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Female</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-pink-500 h-2 rounded-full" style={{ width: "32%" }} />
                            </div>
                            <span className="text-sm font-medium">32%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">By Region</h4>
                      <div className="space-y-2">
                        {[
                          { region: "Southwest", percentage: 35 },
                          { region: "Northwest", percentage: 22 },
                          { region: "Littoral", percentage: 18 },
                          { region: "Centre", percentage: 15 },
                          { region: "Other", percentage: 10 },
                        ].map((region, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{region.region}</span>
                            <span className="font-medium">{region.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Performance Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2 p-4 bg-slate-50 rounded-lg">
                      {[
                        { semester: "2022-1", score: 78.2 },
                        { semester: "2022-2", score: 80.1 },
                        { semester: "2023-1", score: 82.5 },
                        { semester: "2023-2", score: 84.3 },
                        { semester: "2024-1", score: 86.7 },
                        { semester: "2024-2", score: 87.3 },
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 flex-1">
                          <div className="text-xs font-medium text-slate-600">{item.score}%</div>
                          <div
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                            style={{ height: `${(item.score / 90) * 200}px` }}
                          />
                          <div className="text-xs text-slate-500 font-medium transform -rotate-45">{item.semester}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance by Department</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentPerformance.slice(0, 4).map((dept, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{dept.name}</span>
                            <span className="text-sm text-slate-600">{dept.avgScore}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                              style={{ width: `${dept.avgScore}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                  <CardDescription>Critical metrics for institutional success</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">87.3%</div>
                      <div className="text-sm text-slate-600">Overall Pass Rate</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">82.1%</div>
                      <div className="text-sm text-slate-600">Average Score</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <PieChart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">94.2%</div>
                      <div className="text-sm text-slate-600">Student Satisfaction</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-600">+5.8%</div>
                      <div className="text-sm text-slate-600">Year-over-Year Growth</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
