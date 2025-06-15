"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface SpeechOptions {
  rate?: number
  pitch?: number
  volume?: number
  voice?: SpeechSynthesisVoice
  lang?: string
}

export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true)

      // Load voices
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        setVoices(availableVoices)

        // Set default voice (prefer English voices)
        const englishVoice =
          availableVoices.find((voice) => voice.lang.startsWith("en") && voice.localService) ||
          availableVoices.find((voice) => voice.lang.startsWith("en"))

        if (englishVoice && !selectedVoice) {
          setSelectedVoice(englishVoice)
        }
      }

      // Load voices immediately
      loadVoices()

      // Also load when voices change (some browsers load them asynchronously)
      speechSynthesis.onvoiceschanged = loadVoices

      return () => {
        speechSynthesis.onvoiceschanged = null
      }
    } else {
      setIsSupported(false)
    }
  }, [selectedVoice])

  const speak = useCallback(
    (text: string, options: SpeechOptions = {}) => {
      if (!isSupported || !text.trim()) return

      // Stop any current speech
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Set options
      utterance.rate = options.rate ?? 1
      utterance.pitch = options.pitch ?? 1
      utterance.volume = options.volume ?? 1
      utterance.voice = options.voice ?? selectedVoice
      utterance.lang = options.lang ?? "en-US"

      // Event handlers
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      utteranceRef.current = utterance
      speechSynthesis.speak(utterance)
    },
    [isSupported, selectedVoice],
  )

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      speechSynthesis.pause()
    }
  }, [isSupported, isSpeaking])

  const resume = useCallback(() => {
    if (isSupported) {
      speechSynthesis.resume()
    }
  }, [isSupported])

  return {
    isSupported,
    isSpeaking,
    voices,
    selectedVoice,
    setSelectedVoice,
    speak,
    stop,
    pause,
    resume,
  }
}
