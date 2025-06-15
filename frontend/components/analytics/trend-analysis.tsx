"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TrendAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState("5years")

  const data = {
    "5years": [
      { year: "2020", passRate: 72.3, avgScore: 68.5, enrollment: 125943 },
      { year: "2021", passRate: 74.8, avgScore: 70.2, enrollment: 129876 },
      { year: "2022", passRate: 76.5, avgScore: 72.1, enrollment: 136234 },
      { year: "2023", passRate: 78.9, avgScore: 74.8, enrollment: 144567 },
      { year: "2024", passRate: 81.2, avgScore: 76.9, enrollment: 156789 },
    ],
    "3years": [
      { year: "2022", passRate: 76.5, avgScore: 72.1, enrollment: 136234 },
      { year: "2023", passRate: 78.9, avgScore: 74.8, enrollment: 144567 },
      { year: "2024", passRate: 81.2, avgScore: 76.9, enrollment: 156789 },
    ],
  }

  const currentData = data[selectedPeriod as keyof typeof data]
  const maxPassRate = Math.max(...currentData.map((d) => d.passRate))
  const maxAvgScore = Math.max(...currentData.map((d) => d.avgScore))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Historical Trends</h3>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5years">5 Years</SelectItem>
            <SelectItem value="3years">3 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass Rate Trend */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-700">Pass Rate Trend</h4>
          <div className="h-48 flex items-end justify-between gap-3 p-4 bg-slate-50 rounded-lg">
            {currentData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div className="text-xs font-medium text-slate-600">{item.passRate.toFixed(1)}%</div>
                <div
                  className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${(item.passRate / maxPassRate) * 160}px`,
                    minHeight: "20px",
                  }}
                />
                <div className="text-xs text-slate-500 font-medium">{item.year}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Average Score Trend */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-700">Average Score Trend</h4>
          <div className="h-48 flex items-end justify-between gap-3 p-4 bg-slate-50 rounded-lg">
            {currentData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div className="text-xs font-medium text-slate-600">{item.avgScore.toFixed(1)}%</div>
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${(item.avgScore / maxAvgScore) * 160}px`,
                    minHeight: "20px",
                  }}
                />
                <div className="text-xs text-slate-500 font-medium">{item.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment Growth */}
      <div className="space-y-3">
        <h4 className="font-medium text-slate-700">Enrollment Growth</h4>
        <div className="space-y-2">
          {currentData.map((item, index) => {
            const prevYear = index > 0 ? currentData[index - 1] : null
            const growth = prevYear ? ((item.enrollment - prevYear.enrollment) / prevYear.enrollment) * 100 : 0

            return (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">{item.year}</span>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">{item.enrollment.toLocaleString()}</span>
                  {index > 0 && <span className="text-sm text-green-600 font-medium">+{growth.toFixed(1)}%</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
