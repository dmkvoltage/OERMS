"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"
import { User, Mail, Phone, MapPin, Shield, Edit, Save, Camera, Key, Bell, Activity } from "lucide-react"

const profileData = {
  personalInfo: {
    firstName: "Marie",
    lastName: "Ngozi",
    email: "marie.ngozi@minesup.gov.cm",
    phone: "+237 677 123 456",
    position: "Director of Examinations",
    department: "Ministry of Higher Education",
    location: "Yaoundé, Centre Region",
    joinDate: "2018-03-15",
    employeeId: "MINESUP-2018-001",
  },
  recentActivity: [
    {
      action: "Published Baccalauréat A4 Results",
      date: "2024-07-15",
      type: "results",
    },
    {
      action: "Approved GCE Advanced Level Schedule",
      date: "2024-07-10",
      type: "approval",
    },
    {
      action: "Updated Institution Registration Guidelines",
      date: "2024-07-05",
      type: "policy",
    },
    {
      action: "Reviewed Regional Performance Reports",
      date: "2024-07-01",
      type: "review",
    },
  ],
  permissions: [
    "Manage Public Examinations",
    "Approve Institution Registrations",
    "Publish Examination Results",
    "Access National Analytics",
    "Manage Regional Coordinators",
    "System Administration",
  ],
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profileData.personalInfo)

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "results":
        return <Activity className="w-4 h-4 text-green-600" />
      case "approval":
        return <Shield className="w-4 h-4 text-blue-600" />
      case "policy":
        return <Edit className="w-4 h-4 text-purple-600" />
      case "review":
        return <User className="w-4 h-4 text-amber-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <DashboardLayout userRole="ministry_admin" userName="Dr. Marie Ngozi">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-muted-foreground mt-2">Manage your personal information and account settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                      MN
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-semibold mt-4">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-muted-foreground">{formData.position}</p>
                <p className="text-sm text-muted-foreground">{formData.department}</p>
                <Badge className="mt-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  Ministry Admin
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Years of Service</span>
                  <span className="font-semibold">6 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exams Managed</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Institutions Overseen</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login</span>
                  <span className="font-semibold">Today</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details and contact information</CardDescription>
                      </div>
                      <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                        {isEditing ? "Save" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-2">
                        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Key className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Enable Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        Notification Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent actions and system interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileData.recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-6">
                <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>System Permissions</CardTitle>
                    <CardDescription>Your current access levels and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profileData.permissions.map((permission, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
                        >
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
