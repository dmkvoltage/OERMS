"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface VoiceRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  language?: string
  onResult?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
}

interface VoiceCommand {
  command: string
  pattern: RegExp
  action: (matches: string[]) => void
  description: string
  examples: string[]
}

export function useVoiceRecognition(options: VoiceRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(0)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const commandsRef = useRef<VoiceCommand[]>([])

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (typeof SpeechRecognition !== "undefined") {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()

      const recognition = recognitionRef.current
      recognition.continuous = options.continuous ?? true
      recognition.interimResults = options.interimResults ?? true
      recognition.lang = options.language ?? "en-US"

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
        options.onStart?.()
      }

      recognition.onend = () => {
        setIsListening(false)
        options.onEnd?.()
      }

      recognition.onerror = (event) => {
        setError(event.error)
        setIsListening(false)
        options.onError?.(event.error)
      }

      recognition.onresult = (event) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
            setConfidence(result[0].confidence)
          } else {
            interimTranscript += result[0].transcript
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript)
          options.onResult?.(finalTranscript, true)
          processVoiceCommand(finalTranscript)
        }

        if (interimTranscript) {
          setInterimTranscript(interimTranscript)
          options.onResult?.(interimTranscript, false)
        }
      }
    } else {
      setIsSupported(false)
      setError("Speech recognition is not supported in this browser")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [options])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("")
      setInterimTranscript("")
      setError(null)
      recognitionRef.current.start()
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const registerCommand = useCallback((command: VoiceCommand) => {
    commandsRef.current.push(command)
  }, [])

  const unregisterCommand = useCallback((commandName: string) => {
    commandsRef.current = commandsRef.current.filter((cmd) => cmd.command !== commandName)
  }, [])

  const processVoiceCommand = useCallback((transcript: string) => {
    const normalizedTranscript = transcript.toLowerCase().trim()

    for (const command of commandsRef.current) {
      const matches = normalizedTranscript.match(command.pattern)
      if (matches) {
        command.action(matches)
        break
      }
    }
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    confidence,
    startListening,
    stopListening,
    toggleListening,
    registerCommand,
    unregisterCommand,
  }
}
