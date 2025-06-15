"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, GraduationCap, Award, MapPin, Download, Calendar, Building } from "lucide-react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/dashboard-layout"
import { PerformanceChart } from "@/components/analytics/performance-chart"
import { RegionalMap } from "@/components/analytics/regional-map"
import { GradeDistribution } from "@/components/analytics/grade-distribution"
import { TrendAnalysis } from "@/components/analytics/trend-analysis"
import { ExamParticipation } from "@/components/analytics/exam-participation"

export default function MinistryAnalytics() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedExamType, setSelectedExamType] = useState("all")

  const overviewStats = [
    {
      title: "Total Institutions",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Registered Students",
      value: "156,789",
      change: "+8.5%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Exams Conducted",
      value: "2,456",
      change: "+15%",
      trend: "up",
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pass Rate",
      value: "78.4%",
      change: "+3.2%",
      trend: "up",
      icon: Award,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const regionalPerformance = [
    { region: "Centre", institutions: 245, students: 45678, passRate: 82.1 },
    { region: "Littoral", institutions: 198, students: 38945, passRate: 79.8 },
    { region: "West", institutions: 156, students: 28934, passRate: 76.5 },
    { region: "Northwest", institutions: 134, students: 25678, passRate: 74.2 },
    { region: "Southwest", institutions: 128, students: 23456, passRate: 73.8 },
    { region: "East", institutions: 98, students: 18765, passRate: 71.4 },
    { region: "North", institutions: 87, students: 16543, passRate: 69.8 },
    { region: "Adamawa", institutions: 76, students: 14234, passRate: 68.9 },
    { region: "Far North", institutions: 125, students: 21098, passRate: 67.3 },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <DashboardLayout userRole="ministry_admin" userName="Dr. Marie Kamdjou">
      <div className="space-y-6">
        {/* Header */}
        <motion.div {...fadeInUp} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">National Analytics Dashboard</h1>
            <p className="text-slate-600 mt-1">Comprehensive examination system performance insights</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="centre">Centre</SelectItem>
                <SelectItem value="littoral">Littoral</SelectItem>
                <SelectItem value="west">West</SelectItem>
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
          {overviewStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                      <span className="text-sm text-slate-500 ml-1">vs last year</span>
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
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="regional">Regional</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="participation">Participation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Distribution</CardTitle>
                    <CardDescription>Overall grade distribution across all examinations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GradeDistribution />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Exam Participation Rates</CardTitle>
                    <CardDescription>Student participation across different exam types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExamParticipation />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Institutions</CardTitle>
                  <CardDescription>Institutions with highest pass rates in {selectedYear}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "University of Buea", passRate: 94.2, students: 2456, rank: 1 },
                      { name: "University of Yaoundé I", passRate: 92.8, students: 3245, rank: 2 },
                      { name: "University of Dschang", passRate: 91.5, students: 1987, rank: 3 },
                      { name: "University of Douala", passRate: 89.7, students: 2876, rank: 4 },
                      { name: "University of Ngaoundéré", passRate: 87.3, students: 1654, rank: 5 },
                    ].map((institution, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {institution.rank}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800">{institution.name}</h4>
                            <p className="text-sm text-slate-600">{institution.students} students</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{institution.passRate}%</div>
                          <div className="text-sm text-slate-600">Pass Rate</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>National Performance Metrics</CardTitle>
                  <CardDescription>Comprehensive performance analysis across all examinations</CardDescription>
                </CardHeader>
                <CardContent>
                  <PerformanceChart />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Performance</CardTitle>
                    <CardDescription>Average scores by subject area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { subject: "Mathematics", score: 78.5, change: "+2.3%" },
                        { subject: "English", score: 82.1, change: "+1.8%" },
                        { subject: "French", score: 79.7, change: "+0.9%" },
                        { subject: "Physics", score: 74.2, change: "+3.1%" },
                        { subject: "Chemistry", score: 76.8, change: "+1.5%" },
                        { subject: "Biology", score: 80.3, change: "+2.7%" },
                      ].map((subject, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium text-slate-700">{subject.subject}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-slate-800">{subject.score}%</span>
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              {subject.change}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Exam Type Performance</CardTitle>
                    <CardDescription>Performance breakdown by examination type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { type: "GCE Advanced Level", passRate: 84.2, participants: 45678 },
                        { type: "GCE Ordinary Level", passRate: 79.8, participants: 67890 },
                        { type: "Baccalauréat", passRate: 76.5, participants: 34567 },
                        { type: "BEPC", passRate: 82.1, participants: 56789 },
                      ].map((exam, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-slate-700">{exam.type}</span>
                            <span className="text-sm text-slate-600">
                              {exam.participants.toLocaleString()} students
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                              style={{ width: `${exam.passRate}%` }}
                            />
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-slate-800">{exam.passRate}% Pass Rate</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="regional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance Map</CardTitle>
                  <CardDescription>Geographic distribution of examination performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <RegionalMap />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Comparison</CardTitle>
                  <CardDescription>Detailed performance metrics by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Region</th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">Institutions</th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">Students</th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">Pass Rate</th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">Ranking</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regionalPerformance
                          .sort((a, b) => b.passRate - a.passRate)
                          .map((region, index) => (
                            <tr key={index} className="border-b hover:bg-slate-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-slate-500" />
                                  <span className="font-medium">{region.region}</span>
                                </div>
                              </td>
                              <td className="text-right py-3 px-4">{region.institutions}</td>
                              <td className="text-right py-3 px-4">{region.students.toLocaleString()}</td>
                              <td className="text-right py-3 px-4">
                                <span
                                  className={`font-semibold ${
                                    region.passRate >= 80
                                      ? "text-green-600"
                                      : region.passRate >= 70
                                        ? "text-orange-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {region.passRate}%
                                </span>
                              </td>
                              <td className="text-right py-3 px-4">
                                <Badge variant="outline">#{index + 1}</Badge>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Historical performance analysis over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrendAnalysis />
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Enrollment Trends</CardTitle>
                    <CardDescription>Student enrollment patterns over the years</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { year: "2024", enrollment: 156789, growth: "+8.5%" },
                        { year: "2023", enrollment: 144567, growth: "+6.2%" },
                        { year: "2022", enrollment: 136234, growth: "+4.8%" },
                        { year: "2021", enrollment: 129876, growth: "+3.1%" },
                        { year: "2020", enrollment: 125943, growth: "+1.9%" },
                      ].map((data, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">{data.year}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{data.enrollment.toLocaleString()}</div>
                            <div className="text-sm text-green-600">{data.growth}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Technology Adoption</CardTitle>
                    <CardDescription>Digital examination platform usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Online Exams</span>
                          <span className="text-sm text-slate-600">85%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Digital Results</span>
                          <span className="text-sm text-slate-600">92%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Mobile Access</span>
                          <span className="text-sm text-slate-600">78%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "78%" }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="participation" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Registration Rates</CardTitle>
                    <CardDescription>Student registration statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">94.7%</div>
                      <div className="text-sm text-slate-600">Overall Registration Rate</div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>On-time</span>
                          <span className="font-medium">87.3%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Late</span>
                          <span className="font-medium">7.4%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Rates</CardTitle>
                    <CardDescription>Exam attendance statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">96.2%</div>
                      <div className="text-sm text-slate-600">Overall Attendance Rate</div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Present</span>
                          <span className="font-medium">96.2%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Absent</span>
                          <span className="font-medium">3.8%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Completion Rates</CardTitle>
                    <CardDescription>Exam completion statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">98.5%</div>
                      <div className="text-sm text-slate-600">Overall Completion Rate</div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completed</span>
                          <span className="font-medium">98.5%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Incomplete</span>
                          <span className="font-medium">1.5%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Participation by Demographics</CardTitle>
                  <CardDescription>Detailed participation breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">By Gender</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Female</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-pink-500 h-2 rounded-full" style={{ width: "52%" }} />
                            </div>
                            <span className="text-sm font-medium">52%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Male</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "48%" }} />
                            </div>
                            <span className="text-sm font-medium">48%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">By Institution Type</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Public</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: "68%" }} />
                            </div>
                            <span className="text-sm font-medium">68%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Private</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: "32%" }} />
                            </div>
                            <span className="text-sm font-medium">32%</span>
                          </div>
                        </div>
                      </div>
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
