"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime"
import { Users, BookOpen, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface DashboardStatsProps {
  userRole: string
  userId?: string
}

export function RealtimeDashboardStats({ userRole, userId }: DashboardStatsProps) {
  const { data: exams } = useSupabaseRealtime("exams")
  const { data: registrations } = useSupabaseRealtime("registrations")
  const { data: results } = useSupabaseRealtime("results")
  const { data: notifications } = useSupabaseRealtime(
    "notifications",
    userId ? { column: "user_id", value: userId } : undefined,
  )

  // Calculate real-time statistics
  const stats = {
    totalExams: exams.length,
    activeExams: exams.filter((exam) => exam.status === "active").length,
    upcomingExams: exams.filter((exam) => exam.status === "upcoming").length,
    totalRegistrations: registrations.length,
    pendingRegistrations: registrations.filter((reg) => reg.status === "pending").length,
    approvedRegistrations: registrations.filter((reg) => reg.status === "approved").length,
    publishedResults: results.filter((result) => result.is_published).length,
    unreadNotifications: notifications.filter((notif) => !notif.is_read).length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "upcoming":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const approvalRate = stats.totalRegistrations > 0 ? (stats.approvedRegistrations / stats.totalRegistrations) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Exams */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalExams}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <div className={`w-2 h-2 rounded-full ${getStatusColor("active")} mr-1`} />
              {stats.activeExams} Active
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <div className={`w-2 h-2 rounded-full ${getStatusColor("upcoming")} mr-1`} />
              {stats.upcomingExams} Upcoming
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Registrations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registrations</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={approvalRate} className="flex-1" />
            <span className="text-xs text-muted-foreground">{Math.round(approvalRate)}% approved</span>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              {stats.approvedRegistrations}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1 text-yellow-500" />
              {stats.pendingRegistrations}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Published Results</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.publishedResults}</div>
          <p className="text-xs text-muted-foreground mt-2">Results available for students</p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.unreadNotifications}</div>
          <p className="text-xs text-muted-foreground mt-2">Unread notifications</p>
          {stats.unreadNotifications > 0 && (
            <Badge variant="destructive" className="mt-2">
              Action Required
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
