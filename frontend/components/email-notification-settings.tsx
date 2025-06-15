"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Mail, MessageSquare, Calendar, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NotificationSettings {
  registrationUpdates: boolean
  examReminders: boolean
  resultNotifications: boolean
  systemAnnouncements: boolean
  weeklyDigest: boolean
}

export default function EmailNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    registrationUpdates: true,
    examReminders: true,
    resultNotifications: true,
    systemAnnouncements: false,
    weeklyDigest: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      // API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Settings saved",
        description: "Your email notification preferences have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const notificationTypes = [
    {
      key: "registrationUpdates" as keyof NotificationSettings,
      title: "Registration Updates",
      description: "Get notified when your exam registrations are approved or rejected",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      key: "examReminders" as keyof NotificationSettings,
      title: "Exam Reminders",
      description: "Receive reminders before your scheduled examinations",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      key: "resultNotifications" as keyof NotificationSettings,
      title: "Result Notifications",
      description: "Be the first to know when your exam results are published",
      icon: Mail,
      color: "bg-purple-100 text-purple-600",
    },
    {
      key: "systemAnnouncements" as keyof NotificationSettings,
      title: "System Announcements",
      description: "Important updates and announcements from the Ministry of Education",
      icon: MessageSquare,
      color: "bg-orange-100 text-orange-600",
    },
    {
      key: "weeklyDigest" as keyof NotificationSettings,
      title: "Weekly Digest",
      description: "A summary of your activities and upcoming events",
      icon: Bell,
      color: "bg-indigo-100 text-indigo-600",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notification Settings
          </CardTitle>
          <CardDescription>
            Manage how and when you receive email notifications from the examination system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map((type) => {
            const Icon = type.icon
            return (
              <div key={type.key} className="flex items-start justify-between space-x-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${type.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">{type.title}</h4>
                      {settings[type.key] && (
                        <Badge variant="secondary" className="text-xs">
                          Enabled
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[type.key]}
                  onCheckedChange={(checked) => handleSettingChange(type.key, checked)}
                />
              </div>
            )
          })}

          <div className="pt-4 border-t">
            <Button onClick={saveSettings} disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Email Delivery Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last email sent:</span>
              <span>2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery rate:</span>
              <Badge variant="outline" className="text-green-600">
                98.5%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email address:</span>
              <span className="font-mono text-xs">student@example.com</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
