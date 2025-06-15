"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Mic, Volume2, VolumeX, Bot, Brain } from "lucide-react"
import { motion } from "framer-motion"
import { useVoiceRecognition } from "@/hooks/use-voice-recognition"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"

interface VoiceMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  isVoice?: boolean
  confidence?: number
}

interface VoiceEnabledAIAssistantProps {
  onFilterSuggestion: (filters: any[]) => void
  currentContext: any
  userHistory: any[]
  isOpen: boolean
  onToggle: () => void
}

export function VoiceEnabledAIAssistant({
  onFilterSuggestion,
  currentContext,
  userHistory,
  isOpen,
  onToggle,
}: VoiceEnabledAIAssistantProps) {
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [voiceActivated, setVoiceActivated] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    confidence,
    startListening,
    stopListening,
    registerCommand,
  } = useVoiceRecognition({
    continuous: false,
    interimResults: true,
    onResult: (text, isFinal) => {
      if (isFinal && text.trim() && isVoiceMode) {
        processVoiceInput(text.trim())
      }
    },
    onEnd: () => {
      if (isVoiceMode && voiceActivated) {
        // Auto-restart listening in voice mode
        setTimeout(() => startListening(), 1000)
      }
    },
  })

  const { speak, isSpeaking, stop: stopSpeaking } = useSpeechSynthesis()

  useEffect(() => {
    if (!isVoiceMode) return

    // Register wake word commands
    registerCommand({
      command: "wake_ai",
      pattern: /(?:hey|hi|hello)\s+(?:ai|assistant|bot|jarvis)/i,
      action: () => {
        setVoiceActivated(true)
        addAssistantMessage("Yes, I'm listening. How can I help you with your data analysis?", true)
      },
      description: "Wake up the AI assistant",
      examples: ["Hey AI", "Hello assistant", "Hi bot"],
    })

    registerCommand({
      command: "sleep_ai",
      pattern: /(?:sleep|stop|quiet|goodbye|bye)/i,
      action: () => {
        setVoiceActivated(false)
        addAssistantMessage("Going to sleep. Say 'Hey AI' to wake me up.", true)
      },
      description: "Put AI assistant to sleep",
      examples: ["Sleep", "Stop", "Goodbye"],
    })
  }, [isVoiceMode, registerCommand])

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      addAssistantMessage(
        "Hi! I'm your voice-enabled AI assistant. Turn on voice mode to talk to me hands-free!",
        false,
      )
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addUserMessage = (content: string, isVoice = false, confidence?: number) => {
    const newMessage: VoiceMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content,
      timestamp: new Date(),
      isVoice,
      confidence,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const addAssistantMessage = (content: string, shouldSpeak = false) => {
    const newMessage: VoiceMessage = {
      id: `assistant-${Date.now()}`,
      type: "assistant",
      content,
      timestamp: new Date(),
      isVoice: shouldSpeak,
    }
    setMessages((prev) => [...prev, newMessage])

    if (shouldSpeak && !isMuted && isVoiceMode) {
      speak(content, { rate: 0.9, volume: 0.8 })
    }
  }

  const processVoiceInput = async (input: string) => {
    if (!voiceActivated && !input.toLowerCase().includes("hey ai")) {
      return // Ignore input if not activated
    }

    addUserMessage(input, true, confidence)
    setIsProcessing(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = generateVoiceResponse(input)
    addAssistantMessage(response.content, true)

    if (response.filters) {
      onFilterSuggestion(response.filters)
    }

    setIsProcessing(false)
  }

  const generateVoiceResponse = (input: string): { content: string; filters?: any[] } => {
    const lowerInput = input.toLowerCase()

    // Voice-specific responses with more natural language
    if (lowerInput.includes("high") && (lowerInput.includes("perform") || lowerInput.includes("score"))) {
      return {
        content:
          "I found some excellent students for you. I'm applying filters for high performers with scores above 85% and good attendance.",
        filters: [
          { field: "score", operator: ">=", value: 85, display: "Score ≥ 85%" },
          { field: "attendance", operator: ">=", value: 90, display: "Attendance ≥ 90%" },
        ],
      }
    }

    if (lowerInput.includes("struggling") || lowerInput.includes("help") || lowerInput.includes("support")) {
      return {
        content:
          "I understand you want to help struggling students. Let me show you students who might need extra support.",
        filters: [
          { field: "score", operator: "<", value: 60, display: "Score < 60%" },
          { field: "attendance", operator: "<", value: 75, display: "Attendance < 75%" },
        ],
      }
    }

    if (lowerInput.includes("department") || lowerInput.includes("engineering")) {
      const departments = ["computer", "electrical", "mechanical", "civil"]
      const foundDept = departments.find((dept) => lowerInput.includes(dept))

      if (foundDept) {
        return {
          content: `Great choice! I'm filtering students from ${foundDept} engineering department.`,
          filters: [
            {
              field: "department",
              operator: "=",
              value: `${foundDept} Engineering`,
              display: `${foundDept} Engineering`,
            },
          ],
        }
      }
    }

    if (lowerInput.includes("clear") || lowerInput.includes("reset") || lowerInput.includes("remove")) {
      return {
        content: "All filters have been cleared. You now see all students in the system.",
        filters: [],
      }
    }

    if (lowerInput.includes("export") || lowerInput.includes("download") || lowerInput.includes("save")) {
      return {
        content: "I'm preparing your data export. The CSV file will download shortly with all filtered results.",
      }
    }

    if (lowerInput.includes("suggestion") || lowerInput.includes("recommend") || lowerInput.includes("advice")) {
      return {
        content:
          "Based on your usage patterns, I recommend analyzing high performers in computer engineering. This combination often reveals interesting insights.",
        filters: [
          { field: "department", operator: "=", value: "Computer Engineering", display: "Computer Engineering" },
          { field: "score", operator: ">=", value: 80, display: "Score ≥ 80%" },
        ],
      }
    }

    if (lowerInput.includes("recent") || lowerInput.includes("latest") || lowerInput.includes("new")) {
      return {
        content: "I'm showing you the most recent examination data from the last 30 days.",
        filters: [{ field: "date", operator: ">=", value: "last30days", display: "Last 30 days" }],
      }
    }

    // Default response for unclear voice commands
    return {
      content:
        "I'm here to help! You can ask me to show high performers, find struggling students, filter by department, or get suggestions. What would you like to analyze?",
    }
  }

  const toggleVoiceMode = () => {
    if (isVoiceMode) {
      setIsVoiceMode(false)
      setVoiceActivated(false)
      stopListening()
      stopSpeaking()
    } else {
      setIsVoiceMode(true)
      addAssistantMessage("Voice mode activated! Say 'Hey AI' to start talking to me.", true)
      startListening()
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      stopSpeaking()
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">Voice AI Assistant</h3>
          {isVoiceMode && (
            <Badge variant="secondary" className="bg-white/20 text-white">
              Voice Mode
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle} className="text-white hover:bg-white/20">
          ×
        </Button>
      </div>

      {/* Voice Controls */}
      <div className="p-3 border-b bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch checked={isVoiceMode} onCheckedChange={toggleVoiceMode} disabled={!isSupported} id="voice-mode" />
              <label htmlFor="voice-mode" className="text-sm font-medium">
                Voice Mode
              </label>
            </div>

            {isVoiceMode && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={toggleMute} className="h-8 w-8 p-0">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>

                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${isListening ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                  />
                  <span className="text-xs text-slate-600">{voiceActivated ? "Active" : "Sleeping"}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Voice Status */}
        {isVoiceMode && (
          <div className="mt-2 text-xs text-slate-600">
            {!voiceActivated ? (
              <span>💤 Say "Hey AI" to wake me up</span>
            ) : isListening ? (
              <span className="text-green-600">🎤 Listening...</span>
            ) : (
              <span>👂 Ready to listen</span>
            )}
          </div>
        )}

        {/* Live Transcript */}
        {isVoiceMode && (transcript || interimTranscript) && (
          <div className="mt-2 p-2 bg-white rounded border text-xs">
            <span className="font-medium">{transcript}</span>
            <span className="text-gray-400 italic">{interimTranscript}</span>
          </div>
        )}
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
                <div className="space-y-1">
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {message.isVoice && (
                        <Badge variant="outline" className="text-xs">
                          <Mic className="w-3 h-3 mr-1" />
                          Voice
                        </Badge>
                      )}
                      {message.confidence && (
                        <Badge variant="outline" className="text-xs">
                          {Math.round(message.confidence * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-purple-100">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-slate-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
                    <span className="text-sm">Processing your voice command...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Voice Commands Help */}
      {isVoiceMode && (
        <div className="p-3 border-t bg-slate-50">
          <div className="text-xs text-slate-600">
            <div className="font-medium mb-1">Try saying:</div>
            <div className="space-y-1">
              <div>"Show high performers"</div>
              <div>"Find struggling students"</div>
              <div>"Filter computer engineering"</div>
              <div>"Give me suggestions"</div>
            </div>
          </div>
        </div>
      )}

      {/* Not Supported Warning */}
      {!isSupported && (
        <div className="p-3 border-t bg-red-50 border-red-200">
          <div className="text-xs text-red-600">
            Voice commands not supported in this browser. Please use Chrome, Edge, or Safari.
          </div>
        </div>
      )}
    </motion.div>
  )
}
