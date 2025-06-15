"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedGlassCard } from "@/components/ui/enhanced-glass-card"
import { SophisticatedBackground } from "@/components/ui/sophisticated-background"
import {
  Search,
  Calendar,
  Users,
  GraduationCap,
  ArrowLeft,
  Clock,
  DollarSign,
  FileText,
  Building,
  Award,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { concours } from "@/lib/data"

export default function PublicConcoursPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstitution, setSelectedInstitution] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const institutions = Array.from(new Set(concours.map((c) => c.hostInstitution)))
  const types = Array.from(new Set(concours.map((c) => c.type)))

  const filteredConcours = concours.filter((concour) => {
    const matchesSearch =
      concour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concour.hostInstitution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concour.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesInstitution = selectedInstitution === "all" || concour.hostInstitution === selectedInstitution
    const matchesType = selectedType === "all" || concour.type === selectedType

    return matchesSearch && matchesInstitution && matchesType
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SophisticatedBackground />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ExamPortal
                </span>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Cameroon</div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 rounded-xl">
                  Access Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Public Concours
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Explore entrance examinations for higher education institutions across Cameroon. Find your path to
              academic excellence.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <EnhancedGlassCard variant="primary" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search concours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/70 dark:bg-slate-800/70"
                  />
                </div>

                <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                  <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                    <SelectValue placeholder="All Institutions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Institutions</SelectItem>
                    {institutions.map((institution) => (
                      <SelectItem key={institution} value={institution}>
                        {institution}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white/70 dark:bg-slate-800/70">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </EnhancedGlassCard>
          </motion.div>

          {/* Results Count */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-slate-600 dark:text-slate-400">
              Found <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredConcours.length}</span>{" "}
              entrance examinations
            </p>
          </motion.div>

          {/* Concours Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filteredConcours.map((concour, index) => (
              <motion.div key={concour.examId} variants={fadeInUp}>
                <EnhancedGlassCard variant="default" hover className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                          {concour.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                          <Building className="w-4 h-4" />
                          <span>{concour.hostInstitution}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Award className="w-4 h-4" />
                          <span>{concour.department}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {concour.type}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{concour.description}</p>

                    {/* Key Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">Exam Date</p>
                          <p className="text-slate-600 dark:text-slate-400">{concour.date.toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">Deadline</p>
                          <p className="text-slate-600 dark:text-slate-400">
                            {concour.registrationDeadline.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">Available Seats</p>
                          <p className="text-slate-600 dark:text-slate-400">{concour.availableSeats}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">Fee</p>
                          <p className="text-slate-600 dark:text-slate-400">{concour.examFee.toLocaleString()} FCFA</p>
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Requirements
                      </h4>
                      <ul className="space-y-1">
                        {concour.applicationRequirements.slice(0, 2).map((req, reqIndex) => (
                          <li
                            key={reqIndex}
                            className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                        {concour.applicationRequirements.length > 2 && (
                          <li className="text-sm text-blue-600 dark:text-blue-400">
                            +{concour.applicationRequirements.length - 2} more requirements
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Link href={`/concours/${concour.examId}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                          View Details
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href="/auth">
                        <Button variant="outline">Register</Button>
                      </Link>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            concour.registrationDeadline > new Date() ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {concour.registrationDeadline > new Date() ? "Registration Open" : "Registration Closed"}
                        </span>
                      </div>
                      <Badge variant={concour.isPublic ? "default" : "secondary"}>
                        {concour.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </CardContent>
                </EnhancedGlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredConcours.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <EnhancedGlassCard variant="default" className="max-w-md mx-auto">
                <CardContent className="p-8">
                  <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">No concours found</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Try adjusting your search criteria or browse all available entrance examinations.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedInstitution("all")
                      setSelectedType("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </EnhancedGlassCard>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <EnhancedGlassCard variant="primary" className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Ready to Start Your Journey?</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Create an account to register for entrance examinations and track your application status.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    >
                      Create Account
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/results/public">
                    <Button size="lg" variant="outline">
                      View Public Results
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </EnhancedGlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
