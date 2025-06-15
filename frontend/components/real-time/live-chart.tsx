"use client"

import { useState, useEffect } from "react"
import { useSocketEvent } from "@/lib/socket"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface LiveChartProps {
  endpoint: string
  title: string
  description?: string
  initialData: any[]
  dataKey: string
  color?: string
}

export function LiveChart({ endpoint, title, description, initialData, dataKey, color = "#3b82f6" }: LiveChartProps) {
  const [data, setData] = useState(initialData)
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Listen for real-time updates via WebSocket
  useSocketEvent<any[]>(endpoint, (newData) => {
    setIsUpdating(true)
    setData(newData)
    setLastUpdated(new Date())

    setTimeout(() => {
      setIsUpdating(false)
    }, 1000)
  })

  // Simulate random updates for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      // Add a new data point with a random value
      const lastPoint = data[data.length - 1]
      const lastValue = lastPoint ? lastPoint[dataKey] : 50

      // Generate a new value that's within 10% of the last value
      const maxChange = lastValue * 0.1
      const change = Math.random() * maxChange * 2 - maxChange
      const newValue = Math.max(0, Math.min(100, lastValue + change))

      const newPoint = {
        ...lastPoint,
        [dataKey]: Number.parseFloat(newValue.toFixed(1)),
        name: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setIsUpdating(true)
      setData((prev) => {
        // Keep only the last 10 points
        const newData = [...prev.slice(-9), newPoint]
        return newData
      })
      setLastUpdated(new Date())

      setTimeout(() => {
        setIsUpdating(false)
      }, 1000)
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [data, dataKey])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex items-center gap-2">
          {isUpdating ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 gap-1 animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-xs">Updating</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
              Live
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={10} />
              <YAxis stroke="#94a3b8" fontSize={12} tickMargin={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                animationDuration={500}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-slate-500 mt-2 text-right">Last updated: {lastUpdated.toLocaleTimeString()}</div>
      </CardContent>
    </Card>
  )
}
