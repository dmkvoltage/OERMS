"use client"

import { useState, useEffect } from "react"
import { useSocketEvent } from "@/lib/socket"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface LiveCounterProps {
  endpoint: string
  initialCount: number
  label: string
  className?: string
  showBadge?: boolean
}

export function LiveCounter({ endpoint, initialCount, label, className, showBadge = true }: LiveCounterProps) {
  const [count, setCount] = useState(initialCount)
  const [isUpdating, setIsUpdating] = useState(false)
  const [hasUpdated, setHasUpdated] = useState(false)

  // Listen for real-time updates via WebSocket
  useSocketEvent<{ count: number }>(endpoint, (data) => {
    setIsUpdating(true)
    setCount(data.count)
    setHasUpdated(true)

    setTimeout(() => {
      setIsUpdating(false)
    }, 1000)
  })

  // Simulate random updates for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2 // Random number between -2 and 2

      if (change !== 0) {
        setIsUpdating(true)
        setCount((prev) => Math.max(0, prev + change))
        setHasUpdated(true)

        setTimeout(() => {
          setIsUpdating(false)
        }, 1000)
      }
    }, 15000) // Every 15 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
        {isUpdating && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
        {hasUpdated && showBadge && !isUpdating && (
          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
            Live
          </Badge>
        )}
      </div>
      <div
        className={`text-2xl font-bold transition-all duration-300 ${isUpdating ? "text-blue-600" : "text-slate-900 dark:text-white"}`}
      >
        {count.toLocaleString()}
      </div>
    </div>
  )
}
