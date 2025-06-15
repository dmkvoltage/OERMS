"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"
import { ArrowLeft, UserPlus, Users, Building, Shield } from "lucide-react"
import apiClient from "@/lib/api-client"
import Link from "next/link"

interface CreateUserForm {
  first_name: string
  last_name: string
  email: string
  password: string
  phone_number: string
  gender?: string
  institution_name?: string
  title?: string
  type?: string
}

const regions = [
  "Adamawa",
  "Centre",
  "East",
  "Far North",
  "Littoral",
  "North",
  "Northwest",
  "Southwest",
  "South",
  "West",
]

export default function CreateUserPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("student")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [institutions, setInstitutions] = useState<any[]>([])
  const [loadingInstitutions, setLoadingInstitutions] = useState(false)

  const [studentForm, setStudentForm] = useState<CreateUserForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    gender: "",
    institution_name: "",
  })

  const [institutionAdminForm, setInstitutionAdminForm] = useState<CreateUserForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    institution_name: "",
    title: "",
  })

  const [ministryAdminForm, setMinistryAdminForm] = useState<CreateUserForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    type: "",
  })

  const loadInstitutions = async () => {
    if (institutions.length > 0) return

    try {
      setLoadingInstitutions(true)
      const response = await apiClient.getInstitutions({ page: 1, size: 100 })
      setInstitutions(response.items || [])
    } catch (error: any) {
      console.error("Failed to load institutions:", error)
    } finally {
      setLoadingInstitutions(false)
    }
  }

  const handleCreateUser = async (userType: string, formData: CreateUserForm) => {
    try {
      setIsLoading(true)
      setError("")
      setSuccess("")

      // Validate required fields
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
        throw new Error("Please fill in all required fields")
      }

      let response
      switch (userType) {
        case "student":
          if (!formData.gender || !formData.institution_name) {
            throw new Error("Gender and institution are required for students")
          }
          response = await apiClient.createStudent({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            phone_number: formData.phone_number,
            gender: formData.gender,
            institution_name: formData.institution_name,
          })
          break

        case "institutional_admin":
          if (!formData.institution_name) {
            throw new Error("Institution is required for institutional admins")
          }
          response = await apiClient.createInstitutionAdmin({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            phone_number: formData.phone_number,
            institution_name: formData.institution_name,
            title: formData.title || "Administrator",
          })
          break

        case "ministry_admin":
          response = await apiClient.createMinistryAdmin({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            phone_number: formData.phone_number,
            type: formData.type || "Administrator",
          })
          break

        default:
          throw new Error("Invalid user type")
      }

      setSuccess(`${userType.replace("_", " ")} created successfully!`)

      // Reset form
      if (userType === "student") {
        setStudentForm({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone_number: "",
          gender: "",
          institution_name: "",
        })
      } else if (userType === "institutional_admin") {
        setInstitutionAdminForm({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone_number: "",
          institution_name: "",
          title: "",
        })
      } else {
        setMinistryAdminForm({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone_number: "",
          type: "",
        })
      }

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/ministry/users")
      }, 2000)
    } catch (error: any) {
      console.error("User creation error:", error)
      setError(error.message || "Failed to create user")
    } finally {
      setIsLoading(false)
    }
  }

  const renderUserForm = (userType: string, formData: CreateUserForm, setFormData: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          placeholder="Enter phone number"
        />
      </div>

      {userType === "student" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {(userType === "student" || userType === "institutional_admin") && (
        <div className="space-y-2">
          <Label htmlFor="institution">Institution *</Label>
          {loadingInstitutions ? (
            <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
              Loading institutions...
            </div>
          ) : (
            <Select
              value={formData.institution_name}
              onValueChange={(value) => setFormData({ ...formData, institution_name: value })}
              onOpenChange={(open) => {
                if (open) loadInstitutions()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select institution" />
              </SelectTrigger>
              <SelectContent>
                {institutions.length > 0 ? (
                  institutions.map((institution) => (
                    <SelectItem key={institution.institution_id} value={institution.name}>
                      {institution.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">No institutions found</div>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {userType === "institutional_admin" && (
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Principal, Registrar, Dean"
          />
        </div>
      )}

      {userType === "ministry_admin" && (
        <div className="space-y-2">
          <Label htmlFor="type">Admin Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select admin type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Senior Administrator">Senior Administrator</SelectItem>
              <SelectItem value="Regional Director">Regional Director</SelectItem>
              <SelectItem value="Data Analyst">Data Analyst</SelectItem>
              <SelectItem value="Exam Coordinator">Exam Coordinator</SelectItem>
              <SelectItem value="IT Administrator">IT Administrator</SelectItem>
              <SelectItem value="Finance Officer">Finance Officer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button onClick={() => handleCreateUser(userType, formData)} disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : `Create ${userType.replace("_", " ")}`}
      </Button>
    </div>
  )

  return (
    <DashboardLayout userRole="ministry" userName="Dr. Marie Ngozi">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/ministry/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create New User
            </h1>
            <p className="text-muted-foreground mt-2">Add new users to the system</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              User Creation
            </CardTitle>
            <CardDescription>Select the type of user you want to create and fill in their details</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="institutional_admin" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Institution Admin
                </TabsTrigger>
                <TabsTrigger value="ministry_admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Ministry Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100">Creating a Student</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Students can register for exams, view their results, and manage their profile.
                  </p>
                </div>
                {renderUserForm("student", studentForm, setStudentForm)}
              </TabsContent>

              <TabsContent value="institutional_admin" className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 dark:text-green-100">Creating an Institution Admin</h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Institution admins can manage students, registrations, and view institution-specific data.
                  </p>
                </div>
                {renderUserForm("institutional_admin", institutionAdminForm, setInstitutionAdminForm)}
              </TabsContent>

              <TabsContent value="ministry_admin" className="space-y-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900 dark:text-purple-100">Creating a Ministry Admin</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    Ministry admins have full system access and can manage institutions, exams, and all users.
                  </p>
                </div>
                {renderUserForm("ministry_admin", ministryAdminForm, setMinistryAdminForm)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
