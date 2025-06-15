"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Download, FileText, Award, CreditCard, Loader2, CheckCircle, AlertCircle, Eye } from "lucide-react"

interface DocumentGeneratorProps {
  type: "certificate" | "admission-card" | "transcript"
  data: {
    id: string
    studentName: string
    examName?: string
    status?: string
    grade?: string
    score?: number
  }
  disabled?: boolean
}

export function PDFDocumentGenerator({ type, data, disabled = false }: DocumentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const getDocumentConfig = () => {
    switch (type) {
      case "certificate":
        return {
          title: "Certificate",
          description: "Official examination certificate",
          icon: Award,
          color: "text-green-600",
          bgColor: "bg-green-100",
          endpoint: "/api/pdf/certificate",
          payload: { resultId: data.id },
          filename: `certificate-${data.id}.pdf`,
          requirements: data.grade && data.score && data.score >= 50,
        }
      case "admission-card":
        return {
          title: "Admission Card",
          description: "Examination admission card",
          icon: CreditCard,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          endpoint: "/api/pdf/admission-card",
          payload: { registrationId: data.id },
          filename: `admission-card-${data.id}.pdf`,
          requirements: data.status === "approved",
        }
      case "transcript":
        return {
          title: "Transcript",
          description: "Official academic transcript",
          icon: FileText,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          endpoint: "/api/pdf/transcript",
          payload: { studentId: data.id },
          filename: `transcript-${data.id}.pdf`,
          requirements: true,
        }
    }
  }

  const config = getDocumentConfig()
  const Icon = config.icon

  const generatePDF = async () => {
    if (!config.requirements) {
      toast.error("Document cannot be generated", {
        description: getRequirementMessage(),
      })
      return
    }

    setIsGenerating(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch(config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config.payload),
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate document")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = config.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Document generated successfully", {
        description: `${config.title} has been downloaded`,
      })
    } catch (error) {
      console.error("PDF generation error:", error)
      toast.error("Failed to generate document", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const getRequirementMessage = () => {
    switch (type) {
      case "certificate":
        return "Certificate is only available for passing grades (50% and above)"
      case "admission-card":
        return "Admission card is only available for approved registrations"
      default:
        return "Requirements not met"
    }
  }

  const getStatusBadge = () => {
    if (!config.requirements) {
      return (
        <Badge variant="outline" className="text-red-600 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Not Available
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-green-600 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Available
      </Badge>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <div className="font-medium">{data.studentName}</div>
            {data.examName && <div>{data.examName}</div>}
            {data.grade && data.score && (
              <div>
                Grade: {data.grade} ({data.score}%)
              </div>
            )}
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating {config.title.toLowerCase()}...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={disabled}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{config.title} Preview</DialogTitle>
                  <DialogDescription>Preview of the {config.title.toLowerCase()} document</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">REPUBLIC OF CAMEROON</div>
                      <div className="text-sm text-slate-500">Peace - Work - Fatherland</div>
                      <div className="text-sm font-medium">MINISTRY OF SECONDARY EDUCATION</div>
                      <div className="text-lg font-bold mt-4">{config.title.toUpperCase()}</div>
                    </div>
                    <div className="mt-6 space-y-2 text-sm">
                      <div>
                        <strong>Student:</strong> {data.studentName}
                      </div>
                      {data.examName && (
                        <div>
                          <strong>Examination:</strong> {data.examName}
                        </div>
                      )}
                      {data.grade && (
                        <div>
                          <strong>Grade:</strong> {data.grade}
                        </div>
                      )}
                      {data.score && (
                        <div>
                          <strong>Score:</strong> {data.score}%
                        </div>
                      )}
                    </div>
                    <div className="mt-6 text-xs text-slate-500 text-center">
                      This is a preview. The actual document will contain official seals and signatures.
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={generatePDF} disabled={disabled || isGenerating || !config.requirements} size="sm">
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              {isGenerating ? "Generating..." : "Download"}
            </Button>
          </div>

          {!config.requirements && (
            <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {getRequirementMessage()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
