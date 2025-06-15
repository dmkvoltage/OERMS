"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Download, Share2, ArrowLeft, Award, Calendar, User, FileText } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PublicResultsPage() {
  const [searchData, setSearchData] = useState({
    examType: "",
    year: "",
    candidateId: "",
    surname: "",
  })

  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const examTypes = [
    { value: "gce_ol", label: "GCE Ordinary Level" },
    { value: "gce_al", label: "GCE Advanced Level" },
    { value: "bac", label: "Baccalauréat" },
    { value: "bepc", label: "BEPC" },
  ]

  const years = ["2024", "2023", "2022", "2021", "2020"]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setHasSearched(true)

    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          candidateId: "GCE2024001234",
          fullName: "JOHN DOE SMITH",
          examType: "GCE Advanced Level",
          year: "2024",
          center: "University of Buea",
          subjects: [
            { name: "Mathematics", grade: "A", score: 85 },
            { name: "Physics", grade: "B+", score: 78 },
            { name: "Chemistry", grade: "A-", score: 82 },
            { name: "Biology", grade: "A", score: 88 },
          ],
          overallGrade: "PASS",
          datePublished: "2024-12-15",
        },
      ]
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 2000)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-bold text-slate-800">Public Examination Results</h1>
            </div>
            <Badge className="bg-green-100 text-green-700">Results Portal</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <motion.div {...fadeInUp}>
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800 flex items-center justify-center gap-2">
                <Search className="w-6 h-6 text-blue-600" />
                Search Examination Results
              </CardTitle>
              <CardDescription>Enter your details to view your public examination results</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="examType">Examination Type</Label>
                    <Select
                      value={searchData.examType}
                      onValueChange={(value) => setSearchData({ ...searchData, examType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select examination type" />
                      </SelectTrigger>
                      <SelectContent>
                        {examTypes.map((exam) => (
                          <SelectItem key={exam.value} value={exam.value}>
                            {exam.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Examination Year</Label>
                    <Select
                      value={searchData.year}
                      onValueChange={(value) => setSearchData({ ...searchData, year: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidateId">Candidate ID</Label>
                    <Input
                      id="candidateId"
                      placeholder="Enter your candidate ID"
                      value={searchData.candidateId}
                      onChange={(e) => setSearchData({ ...searchData, candidateId: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surname">Surname</Label>
                    <Input
                      id="surname"
                      placeholder="Enter your surname"
                      value={searchData.surname}
                      onChange={(e) => setSearchData({ ...searchData, surname: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search Results
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((result) => (
                  <Card key={result.id} className="shadow-lg border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                            <Award className="w-5 h-5 text-green-600" />
                            Examination Results
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Official results from the Ministry of Education
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-700 text-lg px-3 py-1">{result.overallGrade}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Candidate Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-600" />
                            <span className="font-medium text-slate-600">Candidate Information</span>
                          </div>
                          <div className="pl-6 space-y-2">
                            <div>
                              <span className="text-sm font-medium text-slate-600">Full Name:</span>
                              <p className="text-sm font-semibold">{result.fullName}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-600">Candidate ID:</span>
                              <p className="text-sm font-mono">{result.candidateId}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-600">Examination Center:</span>
                              <p className="text-sm">{result.center}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-600" />
                            <span className="font-medium text-slate-600">Examination Details</span>
                          </div>
                          <div className="pl-6 space-y-2">
                            <div>
                              <span className="text-sm font-medium text-slate-600">Examination:</span>
                              <p className="text-sm font-semibold">{result.examType}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-600">Year:</span>
                              <p className="text-sm">{result.year}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-600">Date Published:</span>
                              <p className="text-sm flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {result.datePublished}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      {/* Subject Results */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          Subject Results
                        </h3>
                        <div className="grid gap-3">
                          {result.subjects.map((subject: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-800">{subject.name}</h4>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="text-sm text-slate-600">Score</div>
                                  <div className="font-semibold">{subject.score}%</div>
                                </div>
                                <Badge
                                  variant={
                                    subject.grade.startsWith("A")
                                      ? "default"
                                      : subject.grade.startsWith("B")
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="text-lg px-3 py-1"
                                >
                                  {subject.grade}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="my-6" />

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download Certificate
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Results
                        </Button>
                        <Button variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No Results Found</h3>
                  <p className="text-slate-600 mb-4">
                    We couldn't find any results matching your search criteria. Please check your details and try again.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setHasSearched(false)
                      setSearchResults([])
                      setSearchData({ examType: "", year: "", candidateId: "", surname: "" })
                    }}
                  >
                    Search Again
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Information Section */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-blue-700">
                <p>• Results are published after official verification by the Ministry of Education</p>
                <p>• Ensure you enter your details exactly as they appear on your examination slip</p>
                <p>• If you cannot find your results, contact your examination center</p>
                <p>• Official certificates can be collected from designated centers</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
