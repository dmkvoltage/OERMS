"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Users,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  Menu,
  Building,
  BarChart3,
  UserCheck,
  GraduationCap,
  Award,
  MapPin,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: string
  userName: string
}

const getNavigationItems = (userRole: string) => {
  const baseItems = [
    { name: "Dashboard", href: `/dashboard/${userRole}`, icon: Home },
    { name: "Profile", href: `/dashboard/${userRole}/profile`, icon: UserCheck },
    { name: "Settings", href: `/dashboard/${userRole}/settings`, icon: Settings },
  ]

  switch (userRole) {
    case "ministry_admin":
    case "ministry":
      return [
        { name: "Dashboard", href: "/dashboard/ministry", icon: Home },
        { name: "Institutions", href: "/dashboard/ministry/institutions", icon: Building },
        { name: "Exams", href: "/dashboard/ministry/exams", icon: BookOpen },
        { name: "Users", href: "/dashboard/ministry/users", icon: Users },
        { name: "Results", href: "/dashboard/ministry/results", icon: FileText },
        { name: "Analytics", href: "/dashboard/ministry/analytics", icon: BarChart3 },
        { name: "Regions", href: "/dashboard/ministry/regions", icon: MapPin },
        { name: "Statistics", href: "/dashboard/ministry/statistics", icon: TrendingUp },
        { name: "Profile", href: "/dashboard/ministry/profile", icon: UserCheck },
        { name: "Settings", href: "/dashboard/ministry/settings", icon: Settings },
      ]

    case "institution_admin":
    case "institution-admin":
      return [
        { name: "Dashboard", href: "/dashboard/institution-admin", icon: Home },
        { name: "Students", href: "/dashboard/institution-admin/students", icon: Users },
        { name: "Registrations", href: "/dashboard/institution-admin/registrations", icon: BookOpen },
        { name: "Results", href: "/dashboard/institution-admin/results", icon: FileText },
        { name: "Reports", href: "/dashboard/institution-admin/reports", icon: BarChart3 },
        { name: "Templates", href: "/dashboard/institution-admin/templates", icon: FileText },
        { name: "Batch Documents", href: "/dashboard/institution-admin/documents/batch", icon: FileText },
        { name: "Settings", href: "/dashboard/institution-admin/settings", icon: Settings },
      ]

    case "exam_body":
    case "exam-body":
      return [
        { name: "Dashboard", href: "/dashboard/exam-body", icon: Home },
        { name: "Examinations", href: "/dashboard/exam-body/examinations", icon: BookOpen },
        { name: "Registrations", href: "/dashboard/exam-body/registrations", icon: Users },
        { name: "Results", href: "/dashboard/exam-body/results", icon: FileText },
        { name: "Analytics", href: "/dashboard/exam-body/analytics", icon: BarChart3 },
        { name: "Batch Documents", href: "/dashboard/exam-body/documents/batch", icon: FileText },
        { name: "Settings", href: "/dashboard/exam-body/settings", icon: Settings },
      ]

    case "student":
      return [
        { name: "Dashboard", href: "/dashboard/student", icon: Home },
        { name: "Exams", href: "/dashboard/student/exams", icon: BookOpen },
        { name: "Results", href: "/dashboard/student/results", icon: Award },
        { name: "Profile", href: "/dashboard/student/profile", icon: UserCheck },
        { name: "Settings", href: "/dashboard/student/settings", icon: Settings },
      ]

    default:
      return baseItems
  }
}

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case "ministry_admin":
    case "ministry":
      return "Ministry Admin"
    case "institution_admin":
    case "institution-admin":
      return "Institution Admin"
    case "exam_body":
    case "exam-body":
      return "Exam Body"
    case "student":
      return "Student"
    default:
      return "User"
  }
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "ministry_admin":
    case "ministry":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
    case "institution_admin":
    case "institution-admin":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    case "exam_body":
    case "exam-body":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    case "student":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
  }
}

export default function DashboardLayout({ children, userRole, userName }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigationItems = getNavigationItems(userRole)

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={cn("flex h-full w-64 flex-col bg-white dark:bg-gray-900 border-r", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">ExamPortal</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-gray-900">
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={userName} />
                    <AvatarFallback>
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <Badge className={cn("text-xs w-fit", getRoleBadgeColor(userRole))}>
                      {getRoleDisplayName(userRole)}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${userRole}/profile`}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${userRole}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
