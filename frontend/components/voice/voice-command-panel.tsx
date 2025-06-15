"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, Volume2, VolumeX, Zap, Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useVoiceRecognition } from "@/hooks/use-voice-recognition"
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis"
import { voiceAnalyticsService } from "@/services/voice-analytics"

interface VoiceCommandPanelProps {
  onFilterCommand: (command: string, params: any) => void
  onAICommand: (command: string) => void
  isEnabled?: boolean
}

export function VoiceCommandPanel({ onFilterCommand, onAICommand, isEnabled = true }: VoiceCommandPanelProps) {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(isEnabled)
  const [isMuted, setIsMuted] = useState(false)
  const [speechRate, setSpeechRate] = useState([1])
  const [speechVolume, setSpeechVolume] = useState([0.8])
  const [lastCommand, setLastCommand] = useState<string>("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [isTraining, setIsTraining] = useState(false)

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    confidence,
    startListening,
    stopListening,
    registerCommand,
  } = useVoiceRecognition({
    continuous: true,
    interimResults: true,
    onResult: (text, isFinal) => {
      if (isFinal && text.trim()) {
        setLastCommand(text)
        processVoiceInput(text) // Track voice input
        setCommandHistory((prev) => [text, ...prev.slice(0, 9)]) // Keep last 10 commands
      }
    },
    onError: (err) => console.error("Voice recognition error:", err),
  })

  const { speak, isSpeaking, voices, selectedVoice, setSelectedVoice } = useSpeechSynthesis()

  useEffect(() => {
    if (!isVoiceEnabled) return

    // Register filter commands
    registerCommand({
      command: "filter_score",
      pattern:
        /(?:show|find|filter)\s+(?:students?\s+)?(?:with\s+)?(?:score|scores?)\s+(?:above|over|greater than|more than)\s+(\d+)/i,
      action: (matches) => {
        const score = Number.parseInt(matches[1])
        onFilterCommand("score", { operator: ">=", value: score })
        speakResponse(`Filtering students with scores above ${score} percent`)
      },
      description: "Filter by score threshold",
      examples: ["Show students with score above 85", "Find students with scores over 90"],
    })

    registerCommand({
      command: "filter_department",
      pattern:
        /(?:show|find|filter)\s+(?:students?\s+)?(?:from|in)\s+(computer|electrical|mechanical|civil)\s+engineering/i,
      action: (matches) => {
        const department = `${matches[1]} Engineering`
        onFilterCommand("department", { operator: "=", value: department })
        speakResponse(`Filtering students from ${department}`)
      },
      description: "Filter by department",
      examples: ["Show students from computer engineering", "Find students in electrical engineering"],
    })

    registerCommand({
      command: "filter_region",
      pattern: /(?:show|find|filter)\s+(?:students?\s+)?(?:from|in)\s+(southwest|northwest|centre|littoral|west|east)/i,
      action: (matches) => {
        const region = matches[1]
        onFilterCommand("region", { operator: "=", value: region })
        speakResponse(`Filtering students from ${region} region`)
      },
      description: "Filter by region",
      examples: ["Show students from southwest", "Find students in northwest"],
    })

    registerCommand({
      command: "filter_high_performers",
      pattern: /(?:show|find|display)\s+(?:high\s+performers?|top\s+students?|excellent\s+students?|best\s+students?)/i,
      action: () => {
        onFilterCommand("high_performers", { score: ">=85", attendance: ">=90" })
        speakResponse("Showing high-performing students with scores above 85% and attendance above 90%")
      },
      description: "Show high-performing students",
      examples: ["Show high performers", "Find top students", "Display excellent students"],
    })

    registerCommand({
      command: "filter_struggling",
      pattern: /(?:show|find|display)\s+(?:struggling|failing|low\s+performing|at\s+risk)\s+students?/i,
      action: () => {
        onFilterCommand("struggling", { score: "<60", attendance: "<75" })
        speakResponse("Showing struggling students who need support")
      },
      description: "Show struggling students",
      examples: ["Show struggling students", "Find failing students", "Display at risk students"],
    })

    registerCommand({
      command: "clear_filters",
      pattern: /(?:clear|remove|reset)\s+(?:all\s+)?filters?/i,
      action: () => {
        onFilterCommand("clear", {})
        speakResponse("All filters have been cleared")
      },
      description: "Clear all filters",
      examples: ["Clear filters", "Remove all filters", "Reset filters"],
    })

    registerCommand({
      command: "ai_assistant",
      pattern: /(?:hey|hi|hello)\s+(?:ai|assistant|bot)/i,
      action: () => {
        onAICommand("activate")
        speakResponse("AI assistant activated. How can I help you with your analysis?")
      },
      description: "Activate AI assistant",
      examples: ["Hey AI", "Hello assistant", "Hi bot"],
    })

    registerCommand({
      command: "ai_suggestions",
      pattern: /(?:give|show|provide)\s+(?:me\s+)?(?:suggestions?|recommendations?|advice)/i,
      action: () => {
        onAICommand("suggestions")
        speakResponse("Here are some intelligent filter suggestions based on your usage patterns")
      },
      description: "Get AI suggestions",
      examples: ["Give me suggestions", "Show recommendations", "Provide advice"],
    })

    registerCommand({
      command: "export_data",
      pattern: /(?:export|download|save)\s+(?:the\s+)?(?:data|results?)/i,
      action: () => {
        onFilterCommand("export", {})
        speakResponse("Exporting filtered data to CSV file")
      },
      description: "Export filtered data",
      examples: ["Export data", "Download results", "Save the data"],
    })

    registerCommand({
      command: "help",
      pattern: /(?:help|what\s+can\s+you\s+do|commands?|voice\s+commands?)/i,
      action: () => {
        speakResponse(
          "I can help you filter data, activate the AI assistant, and export results. Try saying 'show high performers' or 'find struggling students'",
        )
      },
      description: "Show help information",
      examples: ["Help", "What can you do", "Voice commands"],
    })
  }, [isVoiceEnabled, registerCommand, onFilterCommand, onAICommand])

  const speakResponse = (text: string) => {
    if (!isMuted && isVoiceEnabled) {
      speak(text, {
        rate: speechRate[0],
        volume: speechVolume[0],
        voice: selectedVoice || undefined,
      })
    }
  }

  const toggleVoiceListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startVoiceTraining = () => {
    setIsTraining(true)
    speakResponse("Voice training mode activated. Please say some commands to improve recognition accuracy.")
    setTimeout(() => setIsTraining(false), 30000) // 30 seconds training
  }

  const processVoiceInput = (input: string) => {
    const startTime = Date.now()

    try {
      // Process the command (existing logic)
      // ... existing command processing logic ...

      // Track successful command
      voiceAnalyticsService.trackCommand({
        userId: "current-user-id", // Replace with actual user ID
        userRole: "ministry_admin", // Replace with actual user role
        command: input,
        recognizedText: input,
        confidence: confidence,
        success: true,
        executionTime: Date.now() - startTime,
        context: {
          currentFilters: [], // Pass current filters
          pageUrl: window.location.href,
          sessionId: "current-session-id", // Replace with actual session ID
          deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? "mobile" : "desktop",
          browserType: navigator.userAgent.includes("Chrome")
            ? "chrome"
            : navigator.userAgent.includes("Firefox")
              ? "firefox"
              : navigator.userAgent.includes("Safari")
                ? "safari"
                : "other",
        },
      })
    } catch (error) {
      // Track failed command
      voiceAnalyticsService.trackCommand({
        userId: "current-user-id",
        userRole: "ministry_admin",
        command: input,
        recognizedText: input,
        confidence: confidence,
        success: false,
        executionTime: Date.now() - startTime,
        errorType: "processing_error",
        context: {
          currentFilters: [],
          pageUrl: window.location.href,
          sessionId: "current-session-id",
          deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? "mobile" : "desktop",
          browserType: navigator.userAgent.includes("Chrome") ? "chrome" : "other",
        },
      })
    }
  }

  useEffect(() => {
    if (isVoiceEnabled) {
      voiceAnalyticsService.startSession("current-user-id")
    } else {
      voiceAnalyticsService.endSession()
    }
  }, [isVoiceEnabled])

  if (!isSupported) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <MicOff className="w-5 h-5" />
            <span className="font-medium">Voice commands not supported in this browser</span>
          </div>
          <p className="text-sm text-red-500 mt-1">
            Please use Chrome, Edge, or Safari for voice command functionality.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-purple-600" />
          Voice Command Center
        </CardTitle>
        <CardDescription>Control filters and AI assistant with voice commands</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={isVoiceEnabled} onCheckedChange={setIsVoiceEnabled} id="voice-enabled" />
              <label htmlFor="voice-enabled" className="text-sm font-medium">
                Voice Commands
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isMuted ? "outline" : "ghost"}
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                disabled={!isVoiceEnabled}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isListening ? "destructive" : "default"}
              onClick={toggleVoiceListening}
              disabled={!isVoiceEnabled}
              className={isListening ? "animate-pulse" : ""}
            >
              {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>

            <Button variant="outline" size="sm" onClick={startVoiceTraining} disabled={!isVoiceEnabled || isTraining}>
              <Brain className="w-4 h-4 mr-1" />
              {isTraining ? "Training..." : "Train"}
            </Button>
          </div>
        </div>

        {/* Voice Status */}
        <AnimatePresence>
          {isVoiceEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Listening Status */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isListening ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                  />
                  <span className="text-sm font-medium">{isListening ? "Listening..." : "Ready to listen"}</span>
                  {isTraining && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                      Training Mode
                    </Badge>
                  )}
                </div>
                {confidence > 0 && <Badge variant="secondary">{Math.round(confidence * 100)}% confidence</Badge>}
              </div>

              {/* Live Transcript */}
              {(transcript || interimTranscript) && (
                <div className="p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Live Transcript:</div>
                  <div className="text-sm">
                    <span className="font-medium">{transcript}</span>
                    <span className="text-gray-400 italic">{interimTranscript}</span>
                  </div>
                </div>
              )}

              {/* Voice Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Voice</label>
                  <Select
                    value={selectedVoice?.name || ""}
                    onValueChange={(value) => {
                      const voice = voices.find((v) => v.name === value)
                      if (voice) setSelectedVoice(voice)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices
                        .filter((voice) => voice.lang.startsWith("en"))
                        .map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Speech Rate: {speechRate[0]}</label>
                  <Slider
                    value={speechRate}
                    onValueChange={setSpeechRate}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume: {Math.round(speechVolume[0] * 100)}%</label>
                  <Slider
                    value={speechVolume}
                    onValueChange={setSpeechVolume}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Command Examples */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  Voice Command Examples
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Show students with score above 85",
                    "Find students from computer engineering",
                    "Display high performers",
                    "Show struggling students",
                    "Clear all filters",
                    "Hey AI, give me suggestions",
                    "Export the data",
                    "Help with voice commands",
                  ].map((example, index) => (
                    <div
                      key={index}
                      className="p-2 bg-white rounded border text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        if (isListening) {
                          // Simulate voice command
                          setLastCommand(example)
                        }
                      }}
                    >
                      "{example}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Commands */}
              {commandHistory.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recent Commands</h4>
                  <div className="space-y-1">
                    {commandHistory.slice(0, 3).map((command, index) => (
                      <div key={index} className="text-xs p-2 bg-white rounded border">
                        "{command}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm text-red-600">
                    <strong>Voice Error:</strong> {error}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
