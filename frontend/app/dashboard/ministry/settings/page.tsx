"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/dashboard-layout"
import { Settings, Bell, Shield, Database, Globe, FileText, Save, RefreshCw } from "lucide-react"

const systemSettings = {
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    examAlerts: true,
    resultAlerts: true,
    systemMaintenance: true,
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",
    ipWhitelist: true,
  },
  system: {
    maintenanceMode: false,
    backupFrequency: "daily",
    logRetention: "365",
    apiRateLimit: "1000",
    maxFileSize: "10",
  },
  regional: {
    defaultLanguage: "en",
    timezone: "Africa/Douala",
    currency: "XAF",
    dateFormat: "DD/MM/YYYY",
  },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(systemSettings)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSave = () => {
    // Save settings logic here
    setHasChanges(false)
  }

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  return (
    <DashboardLayout userRole="ministry_admin" userName="Dr. Marie Ngozi">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-muted-foreground mt-2">Configure system-wide settings and preferences</p>
          </div>
          {hasChanges && (
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateSetting("notifications", "emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                    </div>
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => updateSetting("notifications", "smsNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => updateSetting("notifications", "pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Exam Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifications about exam schedules and updates</p>
                    </div>
                    <Switch
                      checked={settings.notifications.examAlerts}
                      onCheckedChange={(checked) => updateSetting("notifications", "examAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Result Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notifications when results are published</p>
                    </div>
                    <Switch
                      checked={settings.notifications.resultAlerts}
                      onCheckedChange={(checked) => updateSetting("notifications", "resultAlerts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Maintenance</Label>
                      <p className="text-sm text-muted-foreground">Alerts about system maintenance and downtime</p>
                    </div>
                    <Switch
                      checked={settings.notifications.systemMaintenance}
                      onCheckedChange={(checked) => updateSetting("notifications", "systemMaintenance", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security policies and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Select
                      value={settings.security.sessionTimeout}
                      onValueChange={(value) => updateSetting("security", "sessionTimeout", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Password Expiry (days)</Label>
                    <Select
                      value={settings.security.passwordExpiry}
                      onValueChange={(value) => updateSetting("security", "passwordExpiry", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Login Attempts</Label>
                    <Select
                      value={settings.security.loginAttempts}
                      onValueChange={(value) => updateSetting("security", "loginAttempts", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => updateSetting("security", "twoFactorAuth", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>IP Whitelist</Label>
                      <p className="text-sm text-muted-foreground">Restrict access to approved IP addresses</p>
                    </div>
                    <Switch
                      checked={settings.security.ipWhitelist}
                      onCheckedChange={(checked) => updateSetting("security", "ipWhitelist", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>Configure system performance and maintenance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select
                      value={settings.system.backupFrequency}
                      onValueChange={(value) => updateSetting("system", "backupFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Log Retention (days)</Label>
                    <Input
                      value={settings.system.logRetention}
                      onChange={(e) => updateSetting("system", "logRetention", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>API Rate Limit (requests/hour)</Label>
                    <Input
                      value={settings.system.apiRateLimit}
                      onChange={(e) => updateSetting("system", "apiRateLimit", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max File Size (MB)</Label>
                    <Input
                      value={settings.system.maxFileSize}
                      onChange={(e) => updateSetting("system", "maxFileSize", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable maintenance mode to restrict access</p>
                  </div>
                  <Switch
                    checked={settings.system.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting("system", "maintenanceMode", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Regional Settings
                </CardTitle>
                <CardDescription>Configure regional preferences and localization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Default Language</Label>
                    <Select
                      value={settings.regional.defaultLanguage}
                      onValueChange={(value) => updateSetting("regional", "defaultLanguage", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="both">Bilingual (EN/FR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={settings.regional.timezone}
                      onValueChange={(value) => updateSetting("regional", "timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Douala">Africa/Douala (WAT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={settings.regional.currency}
                      onValueChange={(value) => updateSetting("regional", "currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XAF">Central African CFA Franc (XAF)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select
                      value={settings.regional.dateFormat}
                      onValueChange={(value) => updateSetting("regional", "dateFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Backup & Recovery
                </CardTitle>
                <CardDescription>Manage system backups and recovery options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4 text-center">
                      <Database className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold">Database Backup</h4>
                      <p className="text-sm text-muted-foreground mt-1">Last: Today 03:00</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Backup Now
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-semibold">File Backup</h4>
                      <p className="text-sm text-muted-foreground mt-1">Last: Yesterday 23:00</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Backup Now
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4 text-center">
                      <Settings className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <h4 className="font-semibold">Config Backup</h4>
                      <p className="text-sm text-muted-foreground mt-1">Last: 2 days ago</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Backup Now
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Backup Storage Location</Label>
                    <Textarea
                      placeholder="Enter backup storage path or cloud storage configuration..."
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">Test Backup</Button>
                    <Button variant="outline">Restore from Backup</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
