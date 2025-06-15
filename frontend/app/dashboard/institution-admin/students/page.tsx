"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Users,
  Search,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Mail,
  GraduationCap,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function InstitutionStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showAddStudent, setShowAddStudent] = useState(false)

  // Mock student data
  const students = [
    {
      id: "STU001",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@email.com",
      phone: "+237 678 123 456",
      department: "Computer Science",
      level: "Level 3",
      program: "Bachelor of Science",
      status: "active",
      gpa: 3.8,
      enrollmentDate: "2022-09-15",
      address: "123 University Ave, Buea",
      dateOfBirth: "2001-05-12",
      nationality: "Cameroonian",
      guardianName: "Robert Johnson",
      guardianPhone: "+237 678 987 654",
      registeredExams: 8,
      completedExams: 6,
      pendingExams: 2,
    },
    {
      id: "STU002",
      firstName: "Bob",
      lastName: "Smith",
      email: "bob.smith@email.com",
      phone: "+237 678 234 567",
      department: "Mathematics",
      level: "Level 2",
      program: "Bachelor of Science",
      status: "active",
      gpa: 3.6,
      enrollmentDate: "2023-09-15",
      address: "456 Campus Road, Buea",
      dateOfBirth: "2002-08-20",
      nationality: "Cameroonian",
      guardianName: "Mary Smith",
      guardianPhone: "+237 678 876 543",
      registeredExams: 6,
      completedExams: 4,
      pendingExams: 2,
    },
    {
      id: "STU003",
      firstName: "Carol",
      lastName: "Davis",
      email: "carol.davis@email.com",
      phone: "+237 678 345 678",
      department: "Physics",
      level: "Level 4",
      program: "Bachelor of Science",
      status: "graduated",
      gpa: 3.9,
      enrollmentDate: "2021-09-15",
      address: "789 Student Street, Buea",
      dateOfBirth: "2000-12-03",
      nationality: "Cameroonian",
      guardianName: "James Davis",
      guardianPhone: "+237 678 765 432",
      registeredExams: 12,
      completedExams: 12,
      pendingExams: 0,
    },
    {
      id: "STU004",
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@email.com",
      phone: "+237 678 456 789",
      department: "Chemistry",
      level: "Level 1",
      program: "Bachelor of Science",
      status: "suspended",
      gpa: 2.1,
      enrollmentDate: "2024-09-15",
      address: "321 Dorm Block A, Buea",
      dateOfBirth: "2003-03-15",
      nationality: "Cameroonian",
      guardianName: "Linda Wilson",
      guardianPhone: "+237 678 654 321",
      registeredExams: 2,
      completedExams: 1,
      pendingExams: 1,
    },
  ]

  const departments = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Engineering"]
  const levels = ["Level 1", "Level 2", "Level 3", "Level 4"]
  const statuses = ["active", "suspended", "graduated", "withdrawn"]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = selectedDepartment === "all" || student.department === selectedDepartment
    const matchesLevel = selectedLevel === "all" || student.level === selectedLevel
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesLevel && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      case "suspended":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
      case "graduated":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      case "withdrawn":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "suspended":
        return <AlertCircle className="w-4 h-4" />
      case "graduated":
        return <GraduationCap className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const stats = [
    {
      title: "Total Students",
      value: students.length.toString(),
      description: "Enrolled students",
      icon: Users,
      color: "blue",
    },
    {
      title: "Active Students",
      value: students.filter((s) => s.status === "active").length.toString(),
      description: "Currently enrolled",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Graduates",
      value: students.filter((s) => s.status === "graduated").length.toString(),
      description: "Completed programs",
      icon: GraduationCap,
      color: "purple",
    },
    {
      title: "Average GPA",
      value: (students.reduce((acc, s) => acc + s.gpa, 0) / students.length).toFixed(2),
      description: "Institution average",
      icon: FileText,
      color: "orange",
    },
  ]

  return (
    <DashboardLayout userRole="institution-admin" userName="Dr. Sarah Wilson">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student Management</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage and monitor student records and performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import Students
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Enter the student's information to create a new record.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddStudent(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowAddStudent(false)}>Add Student</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{stat.description}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search students by name, ID, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Students ({filteredStudents.length})
            </CardTitle>
            <CardDescription>Manage student records and academic information</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback>
                            {student.firstName[0]}
                            {student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{student.id}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{student.gpa}</span>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            student.gpa >= 3.5 ? "bg-green-500" : student.gpa >= 3.0 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(student.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(student.status)}
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Student Details</DialogTitle>
                              <DialogDescription>
                                Complete information for {student.firstName} {student.lastName}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedStudent && (
                              <Tabs defaultValue="personal" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                  <TabsTrigger value="academic">Academic</TabsTrigger>
                                  <TabsTrigger value="contact">Contact</TabsTrigger>
                                </TabsList>
                                <TabsContent value="personal" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Full Name</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedStudent.firstName} {selectedStudent.lastName}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Student ID</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                                        {selectedStudent.id}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Date of Birth</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedStudent.dateOfBirth}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Nationality</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedStudent.nationality}
                                      </p>
                                    </div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="academic" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Department</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedStudent.department}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Level</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedStudent.level}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">GPA</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedStudent.gpa}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Enrollment Date</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedStudent.enrollmentDate}
                                      </p>
                                    </div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="contact" className="space-y-4">
                                  <div className="grid grid-cols-1 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Email</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedStudent.email}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Phone</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedStudent.phone}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Address</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedStudent.address}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Guardian</Label>
                                      <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedStudent.guardianName} - {selectedStudent.guardianPhone}
                                      </p>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
