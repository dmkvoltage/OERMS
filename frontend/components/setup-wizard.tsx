"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Database, Users, Settings } from "lucide-react"

export function SetupWizard() {
  const [setupStep, setSetupStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const setupSteps = [
    {
      title: "Database Setup",
      description: "Initialize database tables and relationships",
      icon: Database,
    },
    {
      title: "Admin Users",
      description: "Create default administrator accounts",
      icon: Users,
    },
    {
      title: "Configuration",
      description: "Configure system settings and preferences",
      icon: Settings,
    },
  ]

  const runSetup = async () => {
    setLoading(true)
    setError(null)

    try {
      // Run setup API
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Setup failed")
      }

      const result = await response.json()
      setSuccess(true)
      console.log("Setup completed:", result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-700">Setup Complete!</CardTitle>
          <CardDescription>Your examination management system is ready to use.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Default Admin Accounts Created:</strong>
              <br />
              Ministry Admin: ministry@education.cm (password: admin123!)
              <br />
              Exam Board Admin: examboard@gce.cm (password: admin123!)
            </AlertDescription>
          </Alert>
          <Button onClick={() => (window.location.href = "/auth")} className="w-full">
            Go to Login
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">System Setup</CardTitle>
        <CardDescription>Initialize your examination management system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Setup Steps */}
        <div className="space-y-4">
          {setupSteps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = index < setupStep
            const isCurrent = index === setupStep

            return (
              <div
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-lg border ${
                  isCompleted
                    ? "bg-green-50 border-green-200"
                    : isCurrent
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={runSetup} disabled={loading} className="w-full">
          {loading ? "Setting up..." : "Start Setup"}
        </Button>

        <div className="text-sm text-gray-600 text-center">
          This will create the necessary database tables, default admin accounts, and configure your system.
        </div>
      </CardContent>
    </Card>
  )
}
