"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, Lightbulb, Zap, ThumbsUp, ThumbsDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: FilterSuggestion[]
  confidence?: number
}

interface FilterSuggestion {
  id: string
  title: string
  filters: any[]
  reasoning: string
  confidence: number
  expectedResults: number
}

interface PredictiveFilterAssistantProps {
  onFilterSuggestion: (filters: any[]) => void
  currentContext: any
  userHistory: any[]
}

export function PredictiveFilterAssistant({
  onFilterSuggestion,
  currentContext,
  userHistory,
}: PredictiveFilterAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      addAssistantMessage(
        "Hi! I'm your AI Filter Assistant. I can help you find the perfect filter combinations based on your goals. What would you like to analyze today?",
        [
          {
            id: "welcome-1",
            title: "Find High Performers",
            filters: [{ field: "score", operator: ">=", value: 85 }],
            reasoning: "Identify students with excellent academic performance",
            confidence: 0.95,
            expectedResults: 234,
          },
          {
            id: "welcome-2",
            title: "Recent Activity Analysis",
            filters: [{ field: "date", operator: ">=", value: "last7days" }],
            reasoning: "Focus on recent examination activities",
            confidence: 0.88,
            expectedResults: 156,
          },
        ],
      )
    }
  }, [])

  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const addAssistantMessage = (content: string, suggestions?: FilterSuggestion[], confidence?: number) => {
    const newMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      type: "assistant",
      content,
      timestamp: new Date(),
      suggestions,
      confidence,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const processUserInput = async (input: string) => {
    addUserMessage(input)
    setIsTyping(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate AI response based on input
    const response = generateAIResponse(input)
    addAssistantMessage(response.content, response.suggestions, response.confidence)
    setIsTyping(false)
  }

  const generateAIResponse = (
    input: string,
  ): { content: string; suggestions?: FilterSuggestion[]; confidence?: number } => {
    const lowerInput = input.toLowerCase()

    // Pattern matching for different types of queries
    if (lowerInput.includes("high") && (lowerInput.includes("perform") || lowerInput.includes("score"))) {
      return {
        content:
          "I can help you identify high-performing students. Based on historical data, here are some effective filter combinations:",
        suggestions: [
          {
            id: "high-perf-1",
            title: "Top 15% Performers",
            filters: [
              { field: "score", operator: ">=", value: 85 },
              { field: "attendance", operator: ">=", value: 90 },
            ],
            reasoning: "Students with both high scores and excellent attendance show consistent performance",
            confidence: 0.92,
            expectedResults: 187,
          },
          {
            id: "high-perf-2",
            title: "Department Leaders",
            filters: [
              { field: "score", operator: ">=", value: 80 },
              { field: "rank", operator: "<=", value: 10 },
            ],
            reasoning: "Top 10 students per department often represent excellence patterns",
            confidence: 0.89,
            expectedResults: 120,
          },
        ],
        confidence: 0.92,
      }
    }

    if (lowerInput.includes("fail") || lowerInput.includes("low") || lowerInput.includes("struggling")) {
      return {
        content:
          "I understand you want to identify students who need support. Here are proven filter combinations for intervention analysis:",
        suggestions: [
          {
            id: "support-1",
            title: "At-Risk Students",
            filters: [
              { field: "score", operator: "<", value: 60 },
              { field: "attendance", operator: "<", value: 75 },
            ],
            reasoning: "Low scores combined with poor attendance indicate students needing immediate intervention",
            confidence: 0.94,
            expectedResults: 89,
          },
          {
            id: "support-2",
            title: "Declining Performance",
            filters: [
              { field: "trend", operator: "=", value: "declining" },
              { field: "score_change", operator: "<", value: -10 },
            ],
            reasoning: "Students showing declining trends need early intervention",
            confidence: 0.87,
            expectedResults: 67,
          },
        ],
        confidence: 0.94,
      }
    }

    if (lowerInput.includes("department") || lowerInput.includes("compare")) {
      return {
        content:
          "Great! Departmental analysis can reveal important insights. Here are some comparative filter strategies:",
        suggestions: [
          {
            id: "dept-1",
            title: "Engineering Departments",
            filters: [
              {
                field: "department",
                operator: "in",
                value: ["Computer Engineering", "Electrical Engineering", "Mechanical Engineering"],
              },
              { field: "level", operator: "=", value: "300" },
            ],
            reasoning: "Level 300 students provide good comparison points across engineering disciplines",
            confidence: 0.86,
            expectedResults: 456,
          },
        ],
        confidence: 0.86,
      }
    }

    if (lowerInput.includes("recent") || lowerInput.includes("new") || lowerInput.includes("latest")) {
      return {
        content: "For recent activity analysis, I recommend these time-based filters that have proven effective:",
        suggestions: [
          {
            id: "recent-1",
            title: "Last 30 Days",
            filters: [
              { field: "date", operator: ">=", value: "last30days" },
              { field: "status", operator: "=", value: "completed" },
            ],
            reasoning: "30-day window provides good balance between recency and statistical significance",
            confidence: 0.91,
            expectedResults: 234,
          },
        ],
        confidence: 0.91,
      }
    }

    // Default response for unclear queries
    return {
      content:
        "I'd be happy to help you create effective filters! Could you tell me more about what specific insights you're looking for? For example, are you interested in performance analysis, attendance patterns, or departmental comparisons?",
      suggestions: [
        {
          id: "general-1",
          title: "Popular: Score & Attendance",
          filters: [
            { field: "score", operator: ">=", value: 70 },
            { field: "attendance", operator: ">=", value: 80 },
          ],
          reasoning: "Most commonly used combination for general student analysis",
          confidence: 0.78,
          expectedResults: 567,
        },
      ],
      confidence: 0.78,
    }
  }

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      processUserInput(inputValue.trim())
      setInputValue("")
    }
  }

  const applySuggestion = (suggestion: FilterSuggestion) => {
    onFilterSuggestion(suggestion.filters)
    addAssistantMessage(
      `Great choice! I've applied the "${suggestion.title}" filters. These should give you ${suggestion.expectedResults} relevant results.`,
    )
  }

  const provideFeedback = (messageId: string, isPositive: boolean) => {
    // Track feedback for ML improvement
    console.log(`Feedback for ${messageId}: ${isPositive ? "positive" : "negative"}`)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="relative">
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
            >
              <Bot className="w-6 h-6" />
            </Button>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-semibold">AI Filter Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                ×
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={message.type === "user" ? "bg-blue-100" : "bg-purple-100"}>
                          {message.type === "user" ? "U" : <Bot className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div
                          className={`p-3 rounded-lg ${
                            message.type === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.confidence && (
                            <div className="mt-2 text-xs opacity-75">
                              Confidence: {(message.confidence * 100).toFixed(0)}%
                            </div>
                          )}
                        </div>

                        {/* Suggestions */}
                        {message.suggestions && (
                          <div className="space-y-2">
                            {message.suggestions.map((suggestion) => (
                              <div key={suggestion.id} className="border border-slate-200 rounded-lg p-3 bg-white">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {(suggestion.confidence * 100).toFixed(0)}%
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-600 mb-2">{suggestion.reasoning}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-slate-500">~{suggestion.expectedResults} results</span>
                                  <Button size="sm" onClick={() => applySuggestion(suggestion)}>
                                    Apply
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Feedback buttons for assistant messages */}
                        {message.type === "assistant" && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => provideFeedback(message.id, true)}
                              className="h-6 w-6 p-0"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => provideFeedback(message.id, false)}
                              className="h-6 w-6 p-0"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-100">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-slate-100 p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about filters..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => processUserInput("Show me high performing students")}
                  className="text-xs"
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  High Performers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => processUserInput("Find students who need help")}
                  className="text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Need Support
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
