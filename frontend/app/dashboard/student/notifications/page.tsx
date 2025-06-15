"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardLayout  from "@/components/dashboard-layout"
import { Bell, CheckCircle, AlertCircle, Info, Calendar, Settings } from "lucide-react"

export default function StudentNotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "exam",
      title: "Exam Registration Reminder",
      message: "Registration for Advanced Mathematics exam closes in 3 days. Don't miss the deadline!",
      timestamp: "2 hours ago",
      read: false,
      priority: "high",
      icon: AlertCircle,
    },
    {
      id: 2,
      type: "result",
      title: "Results Published",
      message: "Your Physics Laboratory exam results are now available. You scored 78%.",
      timestamp: "1 day ago",
      read: false,
      priority: "medium",
      icon: CheckCircle,
    },
    {
      id: 3,
      type: "schedule",
      title: "Exam Schedule Update",
      message: "The venue for English Literature exam has been changed to Lecture Hall B.",
      timestamp: "2 days ago",
      read: true,
      priority: "medium",
      icon: Calendar,
    },
    {
      id: 4,
      type: "system",
      title: "System Maintenance",
      message: "The portal will be under maintenance on Sunday from 2:00 AM to 6:00 AM.",
      timestamp: "3 days ago",
      read: true,
      priority: "low",
      icon: Info,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "low":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "exam":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
      case "result":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
      case "schedule":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      case "system":
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DashboardLayout userRole="student" userName="John Doe">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Stay updated with important announcements and reminders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {unreadCount} unread
            </Badge>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button>Mark All Read</Button>
          </div>
        </div>

        {/* Notification Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                All
              </Button>
              <Button variant="ghost" size="sm">
                Exams
              </Button>
              <Button variant="ghost" size="sm">
                Results
              </Button>
              <Button variant="ghost" size="sm">
                Schedule
              </Button>
              <Button variant="ghost" size="sm">
                System
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => {
            const IconComponent = notification.icon
            return (
              <Card
                key={notification.id}
                className={`transition-all duration-200 ${
                  !notification.read
                    ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                    : "hover:shadow-md"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3
                            className={`font-semibold ${
                              !notification.read
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">{notification.timestamp}</span>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button variant="ghost" size="sm">
                              Mark as Read
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State (if no notifications) */}
        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No notifications yet</h3>
              <p className="text-slate-600 dark:text-slate-400">
                You'll see important updates and announcements here when they're available.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
