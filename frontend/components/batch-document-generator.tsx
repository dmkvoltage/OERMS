"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import {
  Download,
  FileText,
  Award,
  CreditCard,
  Loader2,
  Filter,
  Users,
  School,
  Calendar,
  Percent,
  FileArchive,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Institution {
  id: string
  name: string
}

interface Exam {
  id: string
  title: string
  exam_code: string
  date: string
}

interface Program {
  id: string
  name: string
}

interface BatchDocumentGeneratorProps {
  institutions: Institution[]
  exams: Exam[]
  programs: Program[]
  userRole: string
  institutionId?: string
}

export function BatchDocumentGenerator({
  institutions,
  exams,
  programs,
  userRole,
  institutionId,
}: BatchDocumentGeneratorProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("certificates")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [completedItems, setCompletedItems] = useState(0)
  const [failedItems, setFailedItems] = useState(0)

  // Form states
  const [selectedExamId, setSelectedExamId] = useState("")
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(institutionId || "")
  const [selectedProgramId, setSelectedProgramId] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [minScore, setMinScore] = useState("50")
  const [sendEmail, setSendEmail] = useState(false)

  const levels = ["Undergraduate", "Graduate", "Postgraduate", "Doctorate"]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

  const resetProgress = () => {
    setProgress(0)
    setTotalItems(0)
    setCompletedItems(0)
    setFailedItems(0)
  }

  const handleGenerateCertificates = async () => {
    if (!selectedExamId) {
      toast.error("Please select an exam")
      return
    }

    setIsGenerating(true)
    resetProgress()

    try {
      // Simulate progress start
      setProgress(5)

      const response = await fetch("/api/pdf/batch/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId: selectedExamId,
          institutionId: selectedInstitutionId || undefined,
          minScore: Number.parseInt(minScore),
          sendEmail,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate certificates")
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition")
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
      const filename = filenameMatch ? filenameMatch[1] : "certificates.zip"

      // Download the ZIP file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setProgress(100)
      toast.success("Certificates generated successfully", {
        description: `The certificates have been downloaded as ${filename}`,
      })
    } catch (error) {
      console.error("Certificate generation error:", error)
      toast.error("Failed to generate certificates", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateAdmissionCards = async () => {
    if (!selectedExamId) {
      toast.error("Please select an exam")
      return
    }

    setIsGenerating(true)
    resetProgress()

    try {
      // Simulate progress start
      setProgress(5)

      const response = await fetch("/api/pdf/batch/admission-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId: selectedExamId,
          institutionId: selectedInstitutionId || undefined,
          sendEmail,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate admission cards")
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition")
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
      const filename = filenameMatch ? filenameMatch[1] : "admission-cards.zip"

      // Download the ZIP file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setProgress(100)
      toast.success("Admission cards generated successfully", {
        description: `The admission cards have been downloaded as ${filename}`,
      })
    } catch (error) {
      console.error("Admission card generation error:", error)
      toast.error("Failed to generate admission cards", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateTranscripts = async () => {
    if (!selectedInstitutionId) {
      toast.error("Please select an institution")
      return
    }

    setIsGenerating(true)
    resetProgress()

    try {
      // Simulate progress start
      setProgress(5)

      const response = await fetch("/api/pdf/batch/transcripts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          institutionId: selectedInstitutionId,
          programId: selectedProgramId || undefined,
          level: selectedLevel || undefined,
          graduationYear: selectedYear || undefined,
          sendEmail,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate transcripts")
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition")
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
      const filename = filenameMatch ? filenameMatch[1] : "transcripts.zip"

      // Download the ZIP file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setProgress(100)
      toast.success("Transcripts generated successfully", {
        description: `The transcripts have been downloaded as ${filename}`,
      })
    } catch (error) {
      console.error("Transcript generation error:", error)
      toast.error("Failed to generate transcripts", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerate = () => {
    switch (activeTab) {
      case "certificates":
        handleGenerateCertificates()
        break
      case "admission-cards":
        handleGenerateAdmissionCards()
        break
      case "transcripts":
        handleGenerateTranscripts()
        break
    }
  }

  const renderProgressBar = () => {
    if (!isGenerating) return null

    return (
      <div className="space-y-2 mt-4">
        <div className="flex justify-between text-sm">
          <span>Generating documents...</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        {completedItems > 0 && (
          <div className="flex justify-between text-xs text-slate-500">
            <span>
              {completedItems} of {totalItems} completed
            </span>
            {failedItems > 0 && <span className="text-red-500">{failedItems} failed</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileArchive className="h-5 w-5" />
          Batch Document Generator
        </CardTitle>
        <CardDescription>Generate multiple documents at once for batch processing</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="admission-cards" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Admission Cards
            </TabsTrigger>
            <TabsTrigger value="transcripts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Transcripts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certificates" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exam-select" className="flex items-center gap-2">
                    <School className="h-4 w-4" />
                    Exam
                  </Label>
                  <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                    <SelectTrigger id="exam-select">
                      <SelectValue placeholder="Select an exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.title} ({exam.exam_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(userRole === "admin" || userRole === "ministry") && (
                  <div className="space-y-2">
                    <Label htmlFor="institution-select" className="flex items-center gap-2">
                      <School className="h-4 w-4" />
                      Institution (Optional)
                    </Label>
                    <Select value={selectedInstitutionId} onValueChange={setSelectedInstitutionId}>
                      <SelectTrigger id="institution-select">
                        <SelectValue placeholder="All institutions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All institutions</SelectItem>
                        {institutions.map((institution) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-score" className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Minimum Score
                </Label>
                <Input
                  id="min-score"
                  type="number"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-slate-500">
                  Only generate certificates for students with this score or higher
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-email-cert"
                  checked={sendEmail}
                  onCheckedChange={(checked) => setSendEmail(!!checked)}
                />
                <Label htmlFor="send-email-cert">Send certificates to students via email</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admission-cards" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exam-select-ac" className="flex items-center gap-2">
                    <School className="h-4 w-4" />
                    Exam
                  </Label>
                  <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                    <SelectTrigger id="exam-select-ac">
                      <SelectValue placeholder="Select an exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.title} ({exam.exam_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(userRole === "admin" || userRole === "ministry" || userRole === "exam_body") && (
                  <div className="space-y-2">
                    <Label htmlFor="institution-select-ac" className="flex items-center gap-2">
                      <School className="h-4 w-4" />
                      Institution (Optional)
                    </Label>
                    <Select value={selectedInstitutionId} onValueChange={setSelectedInstitutionId}>
                      <SelectTrigger id="institution-select-ac">
                        <SelectValue placeholder="All institutions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All institutions</SelectItem>
                        {institutions.map((institution) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-email-ac"
                  checked={sendEmail}
                  onCheckedChange={(checked) => setSendEmail(!!checked)}
                />
                <Label htmlFor="send-email-ac">Send admission cards to students via email</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transcripts" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(userRole === "admin" || userRole === "ministry") && (
                  <div className="space-y-2">
                    <Label htmlFor="institution-select-tr" className="flex items-center gap-2">
                      <School className="h-4 w-4" />
                      Institution
                    </Label>
                    <Select value={selectedInstitutionId} onValueChange={setSelectedInstitutionId}>
                      <SelectTrigger id="institution-select-tr">
                        <SelectValue placeholder="Select an institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map((institution) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="program-select" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Program (Optional)
                  </Label>
                  <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                    <SelectTrigger id="program-select">
                      <SelectValue placeholder="All programs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All programs</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level-select" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Level (Optional)
                  </Label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger id="level-select">
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year-select" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Graduation Year (Optional)
                  </Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger id="year-select">
                      <SelectValue placeholder="All years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All years</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="send-email-tr"
                  checked={sendEmail}
                  onCheckedChange={(checked) => setSendEmail(!!checked)}
                />
                <Label htmlFor="send-email-tr">Send transcripts to students via email</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {renderProgressBar()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()} disabled={isGenerating}>
          Cancel
        </Button>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate Documents
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
