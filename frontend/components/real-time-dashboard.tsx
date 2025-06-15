"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, TrendingUp, Activity } from "lucide-react"
import { useDashboardAnalytics } from "@/hooks/use-api"
import { cn } from "@/lib/utils"

interface RealTimeDashboardProps {
  role: string
  className?: string
}

interface LiveMetric {
  id: string
  label: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
  icon: React.ComponentType<any>
}

export function RealTimeDashboard({ role, className }: RealTimeDashboardProps) {
  const { analytics, loading, error } = useDashboardAnalytics(role)
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (analytics) {
        const baseMetrics: LiveMetric[] = [
          {
            id: "active_users",
            label: "Active Users",
            value: Math.floor(Math.random() * 1000) + 500,
            change: Math.floor(Math.random() * 20) - 10,
            trend: Math.random() > 0.5 ? "up" : "down",
            icon: Users,
          },
          {
            id: "registrations",
            label: "New Registrations",
            value: Math.floor(Math.random() * 50) + 10,
            change: Math.floor(Math.random() * 10) - 5,
            trend: Math.random() > 0.3 ? "up" : "down",
            icon: BookOpen,
          },
          {
            id: "completion_rate",
            label: "Completion Rate",
            value: Math.floor(Math.random() * 30) + 70,
            change: Math.floor(Math.random() * 5) - 2,
            trend: Math.random() > 0.4 ? "up" : "stable",
            icon: TrendingUp,
          },
          {
            id: "system_load",
            label: "System Load",
            value: Math.floor(Math.random() * 40) + 20,
            change: Math.floor(Math.random() * 10) - 5,
            trend: Math.random() > 0.6 ? "down" : "up",
            icon: Activity,
          },
        ]

        setLiveMetrics(baseMetrics)
        setLastUpdate(new Date())
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [analytics])

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to load real-time data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Live Dashboard</CardTitle>
            <CardDescription>Real-time system metrics and activity</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {lastUpdate.toLocaleTimeString()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {liveMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{metric.label}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <Badge
                      variant={
                        metric.trend === "up" ? "default" : metric.trend === "down" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "text-xs font-medium",
                    metric.trend === "up" && "text-green-600",
                    metric.trend === "down" && "text-red-600",
                    metric.trend === "stable" && "text-gray-600",
                  )}
                >
                  {metric.trend === "up" && "↗ Increasing"}
                  {metric.trend === "down" && "↘ Decreasing"}
                  {metric.trend === "stable" && "→ Stable"}
                </div>
                {metric.id === "completion_rate" && <Progress value={metric.value} className="w-20 mt-1" />}
                {metric.id === "system_load" && (
                  <Progress
                    value={metric.value}
                    className={cn(
                      "w-20 mt-1",
                      metric.value > 80 && "text-red-500",
                      metric.value > 60 && metric.value <= 80 && "text-yellow-500",
                    )}
                  />
                )}
              </div>
            </div>
          )
        })}

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 text-xs rounded-md border hover:bg-muted transition-colors">View Details</button>
            <button className="p-2 text-xs rounded-md border hover:bg-muted transition-colors">Export Data</button>
          </div>
        </div>
      </CardContent>

      {/* Live indicator overlay */}
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse"></div>
    </Card>
  )
}
