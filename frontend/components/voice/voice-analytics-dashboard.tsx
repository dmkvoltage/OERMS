"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Mic,
  Target,
  Users,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Download,
  RefreshCw,
  Brain,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import { voiceAnalyticsService } from "@/services/voice-analytics"

interface VoiceAnalyticsDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceAnalyticsDashboard({ isOpen, onClose }: VoiceAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      loadAnalytics()
      loadRecommendations()

      // Subscribe to real-time updates
      const unsubscribe = voiceAnalyticsService.subscribe((newAnalytics) => {
        setAnalytics(newAnalytics)
      })

      return unsubscribe
    }
  }, [isOpen])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const data = voiceAnalyticsService.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to load voice analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecommendations = () => {
    const recs = voiceAnalyticsService.getOptimizationRecommendations()
    setRecommendations(recs)
  }

  const exportAnalytics = () => {
    const data = voiceAnalyticsService.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `voice-analytics-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isOpen || !analytics) return null

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Voice Analytics Dashboard</h2>
              <p className="text-purple-100 text-sm">Track usage patterns and optimize recognition accuracy</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={loadAnalytics} className="text-white hover:bg-white/20">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={exportAnalytics} className="text-white hover:bg-white/20">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              ×
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-slate-600">Loading voice analytics...</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
                <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                <TabsTrigger value="optimization">Optimization</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics */}
                <motion.div {...fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Commands</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {analytics.totalCommands.toLocaleString()}
                          </p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                            <span className="text-sm text-green-600 font-medium">
                              +{analytics.trends.usageGrowth.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mic className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Success Rate</p>
                          <p className="text-2xl font-bold text-slate-800">{analytics.successRate.toFixed(1)}%</p>
                          <div className="flex items-center mt-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                            <span className="text-sm text-green-600 font-medium">Excellent</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Recognition Accuracy</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {analytics.performanceMetrics.recognitionAccuracy.toFixed(1)}%
                          </p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                            <span className="text-sm text-green-600 font-medium">
                              +{analytics.trends.accuracyImprovement.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Brain className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Active Users</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {analytics.userEngagement.dailyActiveUsers}
                          </p>
                          <div className="flex items-center mt-2">
                            <Users className="w-4 h-4 text-blue-600 mr-1" />
                            <span className="text-sm text-blue-600 font-medium">Daily</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Performance Overview */}
                <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Most Used Commands</CardTitle>
                      <CardDescription>Top voice commands by usage frequency</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.mostUsedCommands.slice(0, 5).map((command: any, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{command.command}</span>
                                <span className="text-xs text-slate-500">{command.count} uses</span>
                              </div>
                              <Progress value={command.successRate} className="h-2" />
                            </div>
                            <Badge variant={command.successRate >= 80 ? "default" : "destructive"} className="ml-3">
                              {command.successRate.toFixed(0)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Error Patterns</CardTitle>
                      <CardDescription>Common voice recognition issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.errorPatterns.slice(0, 5).map((error: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium">{error.error}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-red-600">{error.count}</div>
                              <div className="text-xs text-red-500">{error.percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="usage" className="space-y-6">
                <motion.div {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Session Metrics</CardTitle>
                      <CardDescription>User engagement statistics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Average Session Duration</span>
                        <span className="font-semibold">
                          {Math.round(analytics.userEngagement.averageSessionDuration)}s
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Commands per Session</span>
                        <span className="font-semibold">{analytics.userEngagement.commandsPerSession.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Average Execution Time</span>
                        <span className="font-semibold">
                          {analytics.performanceMetrics.averageExecutionTime.toFixed(0)}ms
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Satisfaction</CardTitle>
                      <CardDescription>Overall user experience score</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {analytics.performanceMetrics.userSatisfaction.toFixed(1)}%
                        </div>
                        <Progress value={analytics.performanceMetrics.userSatisfaction} className="mb-4" />
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          Excellent Experience
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Command Distribution</CardTitle>
                      <CardDescription>Usage by command type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { type: "Filter Commands", percentage: 45, color: "bg-blue-500" },
                          { type: "AI Assistant", percentage: 30, color: "bg-purple-500" },
                          { type: "Export/Actions", percentage: 15, color: "bg-green-500" },
                          { type: "Navigation", percentage: 10, color: "bg-orange-500" },
                        ].map((item, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{item.type}</span>
                              <span className="font-medium">{item.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className={`${item.color} h-2 rounded-full`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="accuracy" className="space-y-6">
                <motion.div {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recognition Confidence Distribution</CardTitle>
                      <CardDescription>Voice recognition confidence levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { range: "90-100%", count: 245, color: "bg-green-500" },
                          { range: "80-89%", count: 189, color: "bg-blue-500" },
                          { range: "70-79%", count: 98, color: "bg-yellow-500" },
                          { range: "60-69%", count: 45, color: "bg-orange-500" },
                          { range: "Below 60%", count: 23, color: "bg-red-500" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-20 text-sm font-medium">{item.range}</div>
                            <div className="flex-1 bg-slate-200 rounded-full h-3">
                              <div
                                className={`${item.color} h-3 rounded-full`}
                                style={{ width: `${(item.count / 600) * 100}%` }}
                              />
                            </div>
                            <div className="w-12 text-sm text-slate-600">{item.count}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Accuracy by Command Type</CardTitle>
                      <CardDescription>Recognition accuracy breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { command: "Filter by Score", accuracy: 94.2, attempts: 156 },
                          { command: "Show High Performers", accuracy: 91.8, attempts: 134 },
                          { command: "Filter by Department", accuracy: 89.5, attempts: 98 },
                          { command: "AI Suggestions", accuracy: 87.3, attempts: 87 },
                          { command: "Export Data", accuracy: 95.1, attempts: 76 },
                        ].map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{item.command}</span>
                              <span className="text-xs text-slate-500">{item.attempts} attempts</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={item.accuracy} className="flex-1" />
                              <span className="text-sm font-semibold w-12">{item.accuracy.toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="optimization" className="space-y-6">
                <motion.div {...fadeInUp} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        AI Optimization Recommendations
                      </CardTitle>
                      <CardDescription>Automated suggestions to improve voice recognition performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recommendations.length > 0 ? (
                          recommendations.map((rec, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border-l-4 ${
                                rec.priority === "high"
                                  ? "border-red-500 bg-red-50"
                                  : rec.priority === "medium"
                                    ? "border-yellow-500 bg-yellow-50"
                                    : "border-blue-500 bg-blue-50"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                      variant={rec.priority === "high" ? "destructive" : "outline"}
                                      className="text-xs"
                                    >
                                      {rec.priority.toUpperCase()}
                                    </Badge>
                                    <span className="text-sm font-medium">
                                      {rec.type === "command_optimization" ? "Command Optimization" : "Error Reduction"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-700 mb-1">
                                    {rec.command && `Command: "${rec.command}"`}
                                    {rec.error && `Error: ${rec.error}`}
                                  </p>
                                  <p className="text-sm text-slate-600">{rec.suggestion}</p>
                                </div>
                                <Button size="sm" variant="outline">
                                  Apply Fix
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                            <p className="font-medium">All systems optimized!</p>
                            <p className="text-sm">No optimization recommendations at this time.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Improvements</CardTitle>
                        <CardDescription>Recent optimization results</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div>
                              <div className="font-medium text-green-800">Recognition Accuracy</div>
                              <div className="text-sm text-green-600">Improved pattern matching</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-800">+5.2%</div>
                              <div className="text-xs text-green-600">This week</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                              <div className="font-medium text-blue-800">Response Time</div>
                              <div className="text-sm text-blue-600">Optimized processing</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-800">-150ms</div>
                              <div className="text-xs text-blue-600">Average</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div>
                              <div className="font-medium text-purple-800">Error Rate</div>
                              <div className="text-sm text-purple-600">Reduced false positives</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-purple-800">-23%</div>
                              <div className="text-xs text-purple-600">This month</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Training Recommendations</CardTitle>
                        <CardDescription>Suggested improvements for voice training</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            {
                              title: "Add Alternative Phrases",
                              description: "Include more variations for common commands",
                              impact: "High",
                            },
                            {
                              title: "Improve Noise Filtering",
                              description: "Better background noise cancellation",
                              impact: "Medium",
                            },
                            {
                              title: "Expand Vocabulary",
                              description: "Add domain-specific terminology",
                              impact: "Medium",
                            },
                            {
                              title: "Optimize Timeout Settings",
                              description: "Adjust listening duration for better UX",
                              impact: "Low",
                            },
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{item.title}</div>
                                <div className="text-xs text-slate-600">{item.description}</div>
                              </div>
                              <Badge
                                variant={
                                  item.impact === "High"
                                    ? "destructive"
                                    : item.impact === "Medium"
                                      ? "default"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {item.impact}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <motion.div {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Usage Growth</CardTitle>
                      <CardDescription>Voice command adoption trend</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {analytics.trends.usageGrowth > 0 ? "+" : ""}
                          {analytics.trends.usageGrowth.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-600 mb-4">vs previous period</div>
                        <div className="flex items-center justify-center gap-1">
                          {analytics.trends.usageGrowth > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              analytics.trends.usageGrowth > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {analytics.trends.usageGrowth > 0 ? "Growing" : "Declining"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Accuracy Improvement</CardTitle>
                      <CardDescription>Recognition accuracy trend</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {analytics.trends.accuracyImprovement > 0 ? "+" : ""}
                          {analytics.trends.accuracyImprovement.toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-600 mb-4">accuracy improvement</div>
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Improving</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Error Reduction</CardTitle>
                      <CardDescription>Error rate improvement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {analytics.trends.errorReduction > 0 ? "-" : "+"}
                          {Math.abs(analytics.trends.errorReduction).toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-600 mb-4">error reduction</div>
                        <div className="flex items-center justify-center gap-1">
                          {analytics.trends.errorReduction > 0 ? (
                            <TrendingDown className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              analytics.trends.errorReduction > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {analytics.trends.errorReduction > 0 ? "Improving" : "Needs Attention"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Historical Chart Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Historical Performance</CardTitle>
                    <CardDescription>Voice command performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                      <div className="text-center text-slate-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-medium">Historical Chart</p>
                        <p className="text-sm">Performance trends visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
