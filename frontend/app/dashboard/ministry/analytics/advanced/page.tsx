"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { Search } from "@/components/search"
import { useState } from "react"
import { VoiceAnalyticsDashboard } from "@/components/voice/voice-analytics-dashboard"
import { BarChart3 } from "lucide-react"

const products = [
  {
    id: "728ed52f",
    name: "Handbag",
    price: 190.0,
    quantity: 1,
    date: "2023-03-02T19:09:33.423Z",
  },
  {
    id: "4944c4b2",
    name: "Keyboard",
    price: 39.0,
    quantity: 2,
    date: "2023-01-24T03:43:48.639Z",
  },
  {
    id: "e395934c",
    name: "Watch",
    price: 99.0,
    quantity: 1,
    date: "2023-01-21T17:41:47.487Z",
  },
  {
    id: "d9242930",
    name: "Water Bottle",
    price: 24.0,
    quantity: 1,
    date: "2023-02-21T18:29:37.752Z",
  },
  {
    id: "1ee4949c",
    name: "Sneakers",
    price: 110.0,
    quantity: 1,
    date: "2023-02-03T01:14:42.333Z",
  },
]

export default function AnalyticsAdvancedPage() {
  const [showVoiceAnalytics, setShowVoiceAnalytics] = useState(false)

  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">Advanced Analytics</CardTitle>
        <div className="flex items-center space-x-2">
          <Search />
          <Button>Download</Button>
          <Button variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-2"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            View All
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowVoiceAnalytics(true)}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Voice Analytics
          </Button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Now</CardTitle>
            <CardDescription>Realtime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales products={products} />
          </CardContent>
        </Card>
      </div>
      <VoiceAnalyticsDashboard isOpen={showVoiceAnalytics} onClose={() => setShowVoiceAnalytics(false)} />
    </div>
  )
}
