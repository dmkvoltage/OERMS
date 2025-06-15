"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSocketEvent } from "@/lib/socket"
import { Loader2 } from "lucide-react"

interface LiveDataWrapperProps<T> {
  endpoint: string
  initialData: T
  children: (data: T, isLoading: boolean) => React.ReactNode
  pollingInterval?: number // Fallback polling in ms
}

export function LiveDataWrapper<T>({
  endpoint,
  initialData,
  children,
  pollingInterval = 30000, // Default 30 seconds
}: LiveDataWrapperProps<T>) {
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Listen for real-time updates via WebSocket
  useSocketEvent<T>(endpoint, (newData) => {
    setData(newData)
    setLastUpdated(new Date())
  })

  // Fallback polling mechanism if WebSocket fails
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be a fetch to your API
        // For demo purposes, we'll just simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Simulate data update with random changes
        if (Array.isArray(data)) {
          // If data is an array, modify a random item
          const newData = [...data]
          if (newData.length > 0) {
            const randomIndex = Math.floor(Math.random() * newData.length)
            newData[randomIndex] = { ...newData[randomIndex], updatedAt: new Date() }
            setData(newData as unknown as T)
          }
        } else if (typeof data === "object" && data !== null) {
          // If data is an object, add a timestamp
          setData({ ...data, lastPolled: new Date() } as unknown as T)
        }

        setLastUpdated(new Date())
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const interval = setInterval(fetchData, pollingInterval)

    return () => clearInterval(interval)
  }, [data, endpoint, pollingInterval])

  return (
    <div className="relative">
      {children(data, isLoading)}

      {isLoading && (
        <div className="absolute top-2 right-2">
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        </div>
      )}

      <div className="text-xs text-slate-500 mt-2 text-right">Last updated: {lastUpdated.toLocaleTimeString()}</div>
    </div>
  )
}
