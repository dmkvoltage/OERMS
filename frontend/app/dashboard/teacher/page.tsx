"use client"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, Award, Calendar, TrendingUp, FileText, BarChart3, Plus, Eye } from "lucide-react"
import { motion } from "framer-motion"

export default function TeacherDashboard() {
  const myClasses = [
    {
      id: 1,
      name: "Mathematics - Form 5A",
      students: 32,
      subject: "Mathematics",
      level: "Form 5",
      nextExam: "2024-03-15",
      averageScore: 78.5,
    },
    {
      id: 2,
      name: "Physics - Form 4B",
      students: 28,
      subject: "Physics",
      level: "Form 4",
      nextExam: "2024-03-18",
      averageScore: 72.3,
    },
    {
      id: 3,
      name: "Mathematics - Form 3C",
      students: 35,
      subject: "Mathematics",
      level: "Form 3",
      nextExam: "2024-03-20",
      averageScore: 81.2,
    },
  ]

  const recentExams = [
    {
      id: 1,
      title: "Mid-term Mathematics Test",
      class: "Form 5A",
      date: "2024-02-28",
      participants: 30,
      graded: 28,
      status: "grading",
    },
    {
      id: 2,
      title: "Physics Practical Exam",
      class: "Form 4B",
      date: "2024-02-25",
      participants: 26,
      graded: 26,
      status: "completed",
    },
  ]

  const stats = [
    {
      title: "Total Students",
      value: "95",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Active Classes",
      value: "3",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Exams This Month",
      value: "8",
      icon: Calendar,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Average Performance",
      value: "77.3%",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
    },
  ]

  return (
    <DashboardLayout userRole="teacher" userName="Prof. Emmanuel Mbarga">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Teacher Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage your classes, exams, and student performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Exam
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Classes */}
          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                My Classes
              </CardTitle>
              <CardDescription>Overview of your assigned classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{classItem.name}</h4>
                      <p className="text-sm text-muted-foreground">{classItem.students} students</p>
                    </div>
                    <Badge variant="outline">{classItem.averageScore}% avg</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Class Performance</span>
                      <span>{classItem.averageScore}%</span>
                    </div>
                    <Progress value={classItem.averageScore} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-muted-foreground">Next exam: {classItem.nextExam}</span>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Exams */}
          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Exams
              </CardTitle>
              <CardDescription>Latest examination activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-lg bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{exam.title}</h4>
                      <p className="text-sm text-muted-foreground">{exam.class}</p>
                    </div>
                    <Badge variant={exam.status === "completed" ? "default" : "secondary"}>{exam.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Grading Progress</span>
                      <span>
                        {exam.graded}/{exam.participants}
                      </span>
                    </div>
                    <Progress value={(exam.graded / exam.participants) * 100} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-muted-foreground">{exam.date}</span>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-1" />
                      Grade
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used teacher functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Plus className="w-6 h-6" />
                <span className="text-sm">Create Exam</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Users className="w-6 h-6" />
                <span className="text-sm">Manage Students</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <FileText className="w-6 h-6" />
                <span className="text-sm">Grade Papers</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
