"use client"

interface VoiceCommandEvent {
  id: string
  timestamp: Date
  userId: string
  userRole: string
  command: string
  recognizedText: string
  confidence: number
  success: boolean
  executionTime: number
  errorType?: string
  context: {
    currentFilters: any[]
    pageUrl: string
    sessionId: string
    deviceType: string
    browserType: string
  }
}

interface VoiceSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  totalCommands: number
  successfulCommands: number
  averageConfidence: number
  totalDuration: number
  commands: VoiceCommandEvent[]
}

interface VoiceAnalytics {
  totalCommands: number
  successRate: number
  averageConfidence: number
  mostUsedCommands: { command: string; count: number; successRate: number }[]
  errorPatterns: { error: string; count: number; percentage: number }[]
  userEngagement: {
    dailyActiveUsers: number
    averageSessionDuration: number
    commandsPerSession: number
  }
  performanceMetrics: {
    averageExecutionTime: number
    recognitionAccuracy: number
    userSatisfaction: number
  }
  trends: {
    usageGrowth: number
    accuracyImprovement: number
    errorReduction: number
  }
}

class VoiceAnalyticsService {
  private events: VoiceCommandEvent[] = []
  private sessions: VoiceSession[] = []
  private currentSession: VoiceSession | null = null
  private listeners: ((analytics: VoiceAnalytics) => void)[] = []

  constructor() {
    this.loadFromStorage()
  }

  // Event Tracking
  trackCommand(event: Omit<VoiceCommandEvent, "id" | "timestamp">) {
    const commandEvent: VoiceCommandEvent = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event,
    }

    this.events.push(commandEvent)
    this.updateCurrentSession(commandEvent)
    this.saveToStorage()
    this.notifyListeners()

    // Auto-optimize based on patterns
    this.analyzeAndOptimize()
  }

  startSession(userId: string) {
    this.currentSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      startTime: new Date(),
      totalCommands: 0,
      successfulCommands: 0,
      averageConfidence: 0,
      totalDuration: 0,
      commands: [],
    }
  }

  endSession() {
    if (this.currentSession) {
      this.currentSession.endTime = new Date()
      this.currentSession.totalDuration =
        this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime()

      this.sessions.push(this.currentSession)
      this.currentSession = null
      this.saveToStorage()
    }
  }

  private updateCurrentSession(event: VoiceCommandEvent) {
    if (this.currentSession) {
      this.currentSession.commands.push(event)
      this.currentSession.totalCommands++

      if (event.success) {
        this.currentSession.successfulCommands++
      }

      // Update average confidence
      const totalConfidence = this.currentSession.commands.reduce((sum, cmd) => sum + cmd.confidence, 0)
      this.currentSession.averageConfidence = totalConfidence / this.currentSession.commands.length
    }
  }

  // Analytics Generation
  getAnalytics(): VoiceAnalytics {
    const now = new Date()
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const recentEvents = this.events.filter((event) => event.timestamp >= last30Days)

    return {
      totalCommands: this.events.length,
      successRate: this.calculateSuccessRate(recentEvents),
      averageConfidence: this.calculateAverageConfidence(recentEvents),
      mostUsedCommands: this.getMostUsedCommands(recentEvents),
      errorPatterns: this.getErrorPatterns(recentEvents),
      userEngagement: this.getUserEngagement(),
      performanceMetrics: this.getPerformanceMetrics(recentEvents),
      trends: this.getTrends(),
    }
  }

  private calculateSuccessRate(events: VoiceCommandEvent[]): number {
    if (events.length === 0) return 0
    const successfulEvents = events.filter((event) => event.success)
    return (successfulEvents.length / events.length) * 100
  }

  private calculateAverageConfidence(events: VoiceCommandEvent[]): number {
    if (events.length === 0) return 0
    const totalConfidence = events.reduce((sum, event) => sum + event.confidence, 0)
    return totalConfidence / events.length
  }

  private getMostUsedCommands(events: VoiceCommandEvent[]) {
    const commandCounts = new Map<string, { count: number; successful: number }>()

    events.forEach((event) => {
      const existing = commandCounts.get(event.command) || { count: 0, successful: 0 }
      existing.count++
      if (event.success) existing.successful++
      commandCounts.set(event.command, existing)
    })

    return Array.from(commandCounts.entries())
      .map(([command, stats]) => ({
        command,
        count: stats.count,
        successRate: (stats.successful / stats.count) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  private getErrorPatterns(events: VoiceCommandEvent[]) {
    const errorCounts = new Map<string, number>()
    const failedEvents = events.filter((event) => !event.success)

    failedEvents.forEach((event) => {
      const error = event.errorType || "Unknown Error"
      errorCounts.set(error, (errorCounts.get(error) || 0) + 1)
    })

    const totalErrors = failedEvents.length

    return Array.from(errorCounts.entries())
      .map(([error, count]) => ({
        error,
        count,
        percentage: totalErrors > 0 ? (count / totalErrors) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
  }

  private getUserEngagement() {
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentSessions = this.sessions.filter((session) => session.startTime >= last7Days)
    const uniqueUsers = new Set(recentSessions.map((session) => session.userId))

    const totalDuration = recentSessions.reduce((sum, session) => sum + session.totalDuration, 0)
    const totalCommands = recentSessions.reduce((sum, session) => sum + session.totalCommands, 0)

    return {
      dailyActiveUsers: uniqueUsers.size,
      averageSessionDuration: recentSessions.length > 0 ? totalDuration / recentSessions.length / 1000 : 0,
      commandsPerSession: recentSessions.length > 0 ? totalCommands / recentSessions.length : 0,
    }
  }

  private getPerformanceMetrics(events: VoiceCommandEvent[]) {
    const executionTimes = events.map((event) => event.executionTime)
    const averageExecutionTime =
      executionTimes.length > 0 ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length : 0

    const highConfidenceEvents = events.filter((event) => event.confidence > 0.8)
    const recognitionAccuracy = events.length > 0 ? (highConfidenceEvents.length / events.length) * 100 : 0

    // Simulate user satisfaction based on success rate and confidence
    const userSatisfaction = (this.calculateSuccessRate(events) + this.calculateAverageConfidence(events) * 100) / 2

    return {
      averageExecutionTime,
      recognitionAccuracy,
      userSatisfaction,
    }
  }

  private getTrends() {
    const now = new Date()
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const last60Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const recent30Days = this.events.filter((event) => event.timestamp >= last30Days)
    const previous30Days = this.events.filter((event) => event.timestamp >= last60Days && event.timestamp < last30Days)

    const recentUsage = recent30Days.length
    const previousUsage = previous30Days.length
    const usageGrowth = previousUsage > 0 ? ((recentUsage - previousUsage) / previousUsage) * 100 : 0

    const recentAccuracy = this.calculateAverageConfidence(recent30Days)
    const previousAccuracy = this.calculateAverageConfidence(previous30Days)
    const accuracyImprovement =
      previousAccuracy > 0 ? ((recentAccuracy - previousAccuracy) / previousAccuracy) * 100 : 0

    const recentErrors = recent30Days.filter((event) => !event.success).length
    const previousErrors = previous30Days.filter((event) => !event.success).length
    const errorReduction = previousErrors > 0 ? ((previousErrors - recentErrors) / previousErrors) * 100 : 0

    return {
      usageGrowth,
      accuracyImprovement,
      errorReduction,
    }
  }

  // Optimization Engine
  private analyzeAndOptimize() {
    const analytics = this.getAnalytics()

    // Identify patterns for optimization
    const lowSuccessCommands = analytics.mostUsedCommands.filter((cmd) => cmd.successRate < 70)
    const commonErrors = analytics.errorPatterns.slice(0, 3)

    // Generate optimization recommendations
    this.generateOptimizationRecommendations(lowSuccessCommands, commonErrors)
  }

  private generateOptimizationRecommendations(lowSuccessCommands: any[], commonErrors: any[]) {
    const recommendations = []

    lowSuccessCommands.forEach((cmd) => {
      recommendations.push({
        type: "command_optimization",
        command: cmd.command,
        issue: `Low success rate: ${cmd.successRate.toFixed(1)}%`,
        suggestion: "Consider adding alternative phrases or improving pattern matching",
        priority: "high",
      })
    })

    commonErrors.forEach((error) => {
      recommendations.push({
        type: "error_reduction",
        error: error.error,
        frequency: error.percentage,
        suggestion: this.getErrorSuggestion(error.error),
        priority: error.percentage > 20 ? "high" : "medium",
      })
    })

    // Store recommendations for dashboard
    this.storeOptimizationRecommendations(recommendations)
  }

  private getErrorSuggestion(errorType: string): string {
    const suggestions: Record<string, string> = {
      low_confidence: "Improve microphone quality or reduce background noise",
      no_match: "Add more command variations or improve pattern matching",
      timeout: "Increase listening timeout or provide clearer instructions",
      network_error: "Check internet connection stability",
      permission_denied: "Ensure microphone permissions are granted",
    }

    return suggestions[errorType] || "Review command patterns and user feedback"
  }

  private storeOptimizationRecommendations(recommendations: any[]) {
    localStorage.setItem("voice_optimization_recommendations", JSON.stringify(recommendations))
  }

  getOptimizationRecommendations() {
    const stored = localStorage.getItem("voice_optimization_recommendations")
    return stored ? JSON.parse(stored) : []
  }

  // Data Persistence
  private saveToStorage() {
    try {
      localStorage.setItem("voice_analytics_events", JSON.stringify(this.events.slice(-1000))) // Keep last 1000 events
      localStorage.setItem("voice_analytics_sessions", JSON.stringify(this.sessions.slice(-100))) // Keep last 100 sessions
    } catch (error) {
      console.warn("Failed to save voice analytics data:", error)
    }
  }

  private loadFromStorage() {
    try {
      const events = localStorage.getItem("voice_analytics_events")
      const sessions = localStorage.getItem("voice_analytics_sessions")

      if (events) {
        this.events = JSON.parse(events).map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        }))
      }

      if (sessions) {
        this.sessions = JSON.parse(sessions).map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
        }))
      }
    } catch (error) {
      console.warn("Failed to load voice analytics data:", error)
    }
  }

  // Listeners
  subscribe(listener: (analytics: VoiceAnalytics) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    const analytics = this.getAnalytics()
    this.listeners.forEach((listener) => listener(analytics))
  }

  // Export/Import
  exportData() {
    return {
      events: this.events,
      sessions: this.sessions,
      exportDate: new Date(),
    }
  }

  importData(data: any) {
    this.events = data.events.map((event: any) => ({
      ...event,
      timestamp: new Date(event.timestamp),
    }))
    this.sessions = data.sessions.map((session: any) => ({
      ...session,
      startTime: new Date(session.startTime),
      endTime: session.endTime ? new Date(session.endTime) : undefined,
    }))
    this.saveToStorage()
    this.notifyListeners()
  }
}

export const voiceAnalyticsService = new VoiceAnalyticsService()
