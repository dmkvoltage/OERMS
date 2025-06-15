"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PerformanceChart() {
  const [selectedMetric, setSelectedMetric] = useState("passRate")

  const data = {
    passRate: [
      { month: "Jan", value: 76.2 },
      { month: "Feb", value: 78.1 },
      { month: "Mar", value: 79.5 },
      { month: "Apr", value: 77.8 },
      { month: "May", value: 80.3 },
      { month: "Jun", value: 82.1 },
      { month: "Jul", value: 81.7 },
      { month: "Aug", value: 83.2 },
      { month: "Sep", value: 84.5 },
      { month: "Oct", value: 85.1 },
      { month: "Nov", value: 86.3 },
      { month: "Dec", value: 87.2 },
    ],
    avgScore: [
      { month: "Jan", value: 72.5 },
      { month: "Feb", value: 74.2 },
      { month: "Mar", value: 75.8 },
      { month: "Apr", value: 73.9 },
      { month: "May", value: 76.4 },
      { month: "Jun", value: 78.1 },
      { month: "Jul", value: 77.6 },
      { month: "Aug", value: 79.3 },
      { month: "Sep", value: 80.7 },
      { month: "Oct", value: 81.2 },
      { month: "Nov", value: 82.5 },
      { month: "Dec", value: 83.8 },
    ],
  }

  const currentData = data[selectedMetric as keyof typeof data]
  const maxValue = Math.max(...currentData.map((d) => d.value))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Performance Trends</h3>
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="passRate">Pass Rate</SelectItem>
            <SelectItem value="avgScore">Average Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-64 flex items-end justify-between gap-2 p-4 bg-slate-50 rounded-lg">
        {currentData.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="text-xs font-medium text-slate-600">{item.value.toFixed(1)}%</div>
            <div
              className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-500 hover:from-blue-700 hover:to-blue-500"
              style={{
                height: `${(item.value / maxValue) * 200}px`,
                minHeight: "20px",
              }}
            />
            <div className="text-xs text-slate-500 font-medium">{item.month}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
