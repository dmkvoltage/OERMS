"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, Award, BookOpen, Download, Target, Clock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/dashboard-layout"

export default function TeacherAnalytics() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const classStats = [
    {
      title: "Total Students",
      value: "156",
      change: "+12",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Average Score",
      value: "78.5%",
      change: "+3.2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pass Rate",
      value: "85.2%",
      change: "+5.1%",
      trend: "up",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Assignments",
      value: "24",
      change: "+6",
      trend: "up",
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const studentPerformance = [
    { name: "Alice Johnson", id: "FE22A001", avgScore: 92.5, trend: "up", lastExam: 95 },
    { name: "Bob Smith", id: "FE22A002", avgScore: 88.3, trend: "up", lastExam: 87 },
    { name: "Carol Davis", id: "FE22A003", avgScore: 85.7, trend: "stable", lastExam: 86 },
    { name: "David Wilson", id: "FE22A004", avgScore: 82.1, trend: "down", lastExam: 78 },
    { name: "Eva Brown", id: "FE22A005", avgScore: 79.8, trend: "up", lastExam: 84 },
    { name: "Frank Miller", id: "FE22A006", avgScore: 76.4, trend: "stable", lastExam: 76 },
    { name: "Grace Lee", id: "FE22A007", avgScore: 73.2, trend: "down", lastExam: 69 },
    { name: "Henry Taylor", id: "FE22A008", avgScore: 70.5, trend: "up", lastExam: 75 },
  ]

  const subjectAnalysis = [
    { subject: "Database Systems", avgScore: 82.3, passRate: 89.2, difficulty: "Medium" },
    { subject: "Software Engineering", avgScore: 78.7, passRate: 85.4, difficulty: "Hard" },
    { subject: "Data Structures", avgScore: 85.1, passRate: 92.1, difficulty: "Medium" },
    { subject: "Computer Networks", avgScore: 74.9, passRate: 78.6, difficulty: "Hard" },
    { subject: "Web Development", avgScore: 88.2, passRate: 94.7, difficulty: "Easy" },
  ]

  const recentExams = [
    {
      title: "Database Systems - Final Exam",
      date: "2024-12-15",
      participants: 45,
      avgScore: 82.3,
      status: "completed",
    },
    {
      title: "Software Engineering - Midterm",
      date: "2024-12-10",
      participants: 42,
      avgScore: 78.7,
      status: "completed",
    },
    {
      title: "Data Structures - Quiz 3",
      date: "2024-12-05",
      participants: 44,
      avgScore: 85.1,
      status: "completed",
    },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <DashboardLayout userRole="teacher" userName="Prof. John Smith">
      <div className="space-y-6">
        {/* Header */}
        <motion.div {...fadeInUp} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Class Analytics</h1>
            <p className="text-slate-600 mt-1">Monitor student performance and class progress</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="level300">Level 300</SelectItem>
                <SelectItem value="level400">Level 400</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="database">Database Systems</SelectItem>
                <SelectItem value="software">Software Engineering</SelectItem>
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
          {classStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                      <span className="text-sm text-slate-500 ml-1">this semester</span>
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
          <Tabs defaultValue="students" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Performance Overview</CardTitle>
                  <CardDescription>Individual student progress and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentPerformance.map((student, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{student.name}</h4>
                            <p className="text-sm text-slate-600">{student.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Average</div>
                            <div className="font-semibold text-lg">{student.avgScore}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Last Exam</div>
                            <div className="font-semibold text-lg">{student.lastExam}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Trend</div>
                            <Badge
                              variant={
                                student.trend === "up"
                                  ? "default"
                                  : student.trend === "down"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {student.trend === "up" ? "↗" : student.trend === "down" ? "↘" : "→"}
                            </Badge>
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
                    <CardTitle>Performance Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { range: "90-100%", count: 12, color: "bg-green-500" },
                        { range: "80-89%", count: 28, color: "bg-blue-500" },
                        { range: "70-79%", count: 35, color: "bg-yellow-500" },
                        { range: "60-69%", count: 18, color: "bg-orange-500" },
                        { range: "Below 60%", count: 7, color: "bg-red-500" },
                      ].map((range, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 ${range.color} rounded`} />
                            <span className="font-medium">{range.range}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{range.count}</span>
                            <span className="text-sm text-slate-600">students</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">94.2%</div>
                        <div className="text-sm text-slate-600">Average Attendance</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Excellent (95%+)</span>
                          <span className="text-sm font-medium">78 students</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Good (85-94%)</span>
                          <span className="text-sm font-medium">45 students</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Fair (75-84%)</span>
                          <span className="text-sm font-medium">23 students</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Poor (Below 75%)</span>
                          <span className="text-sm font-medium">10 students</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of performance across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjectAnalysis.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{subject.subject}</h4>
                            <Badge
                              variant={
                                subject.difficulty === "Easy"
                                  ? "default"
                                  : subject.difficulty === "Medium"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {subject.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Avg Score</div>
                            <div className="font-semibold text-lg">{subject.avgScore}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Pass Rate</div>
                            <div className="font-semibold text-lg text-green-600">{subject.passRate}%</div>
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
                    <CardTitle>Subject Difficulty Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Easy Subjects</span>
                          <span className="text-sm text-slate-600">1 subject</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "20%" }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Medium Subjects</span>
                          <span className="text-sm text-slate-600">2 subjects</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "40%" }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Hard Subjects</span>
                          <span className="text-sm text-slate-600">2 subjects</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "40%" }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Improvement Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-red-800">Needs Attention</span>
                        </div>
                        <p className="text-sm text-red-700">Computer Networks - 74.9% avg score</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800">Monitor Closely</span>
                        </div>
                        <p className="text-sm text-yellow-700">Software Engineering - 78.7% avg score</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-800">Performing Well</span>
                        </div>
                        <p className="text-sm text-green-700">Web Development - 88.2% avg score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="exams" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Examinations</CardTitle>
                  <CardDescription>Overview of recently conducted exams and their results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentExams.map((exam, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{exam.title}</h4>
                            <p className="text-sm text-slate-600">{exam.date}</p>
                            <Badge className="mt-1">{exam.status}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Participants</div>
                            <div className="font-semibold text-lg">{exam.participants}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-slate-600">Avg Score</div>
                            <div className="font-semibold text-lg text-blue-600">{exam.avgScore}%</div>
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
                    <CardTitle>Exam Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Exams Conducted</span>
                        <span className="text-2xl font-bold text-blue-600">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Average Participation</span>
                        <span className="text-2xl font-bold text-green-600">94.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Overall Pass Rate</span>
                        <span className="text-2xl font-bold text-purple-600">85.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Average Score</span>
                        <span className="text-2xl font-bold text-orange-600">78.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Exams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { title: "Database Systems - Final", date: "2025-01-15", registered: 45 },
                        { title: "Software Engineering - Project", date: "2025-01-20", registered: 42 },
                        { title: "Data Structures - Quiz 4", date: "2025-01-25", registered: 44 },
                      ].map((exam, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <h5 className="font-medium text-slate-800">{exam.title}</h5>
                            <p className="text-sm text-slate-600">{exam.date}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{exam.registered}</div>
                            <div className="text-sm text-slate-600">registered</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Progress Tracking</CardTitle>
                  <CardDescription>Monitor overall class improvement and learning outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Semester Progress</h4>
                      <div className="space-y-3">
                        {[
                          { week: "Week 1-4", score: 72.3, color: "bg-red-400" },
                          { week: "Week 5-8", score: 76.8, color: "bg-yellow-400" },
                          { week: "Week 9-12", score: 81.2, color: "bg-green-400" },
                          { week: "Week 13-16", score: 85.7, color: "bg-green-500" },
                        ].map((period, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{period.week}</span>
                              <span className="text-sm font-semibold">{period.score}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className={`${period.color} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${period.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Learning Objectives</h4>
                      <div className="space-y-3">
                        {[
                          { objective: "Database Design", completion: 95, students: 43 },
                          { objective: "SQL Queries", completion: 88, students: 40 },
                          { objective: "Normalization", completion: 82, students: 37 },
                          { objective: "Transactions", completion: 76, students: 34 },
                        ].map((obj, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{obj.objective}</span>
                              <span className="text-sm text-slate-600">{obj.students}/45 students</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${obj.completion}%` }}
                              />
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-600">{obj.completion}% mastery</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">87.3%</div>
                        <div className="text-sm text-slate-600">Assignment Submission Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">92.1%</div>
                        <div className="text-sm text-slate-600">Class Participation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">78.9%</div>
                        <div className="text-sm text-slate-600">Discussion Forum Activity</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Improvement Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-2 bg-red-50 border border-red-200 rounded">
                        <div className="text-sm font-medium text-red-800">Critical</div>
                        <div className="text-xs text-red-600">7 students below 60%</div>
                      </div>
                      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="text-sm font-medium text-yellow-800">Attention</div>
                        <div className="text-xs text-yellow-600">18 students 60-69%</div>
                      </div>
                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                        <div className="text-sm font-medium text-green-800">Excellent</div>
                        <div className="text-xs text-green-600">40 students above 80%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full justify-start" variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Schedule Remedial Classes
                      </Button>
                      <Button size="sm" className="w-full justify-start" variant="outline">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Create Practice Exams
                      </Button>
                      <Button size="sm" className="w-full justify-start" variant="outline">
                        <Award className="w-4 h-4 mr-2" />
                        Review Difficult Topics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
