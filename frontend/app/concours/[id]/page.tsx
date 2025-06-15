"use client"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  ExternalLink,
  Download,
  Info,
  Target,
  Award,
  Building,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { concours } from "@/lib/data"
import { EnhancedGlassCard } from "@/components/ui/enhanced-glass-card"
import { useParams } from "next/navigation"

export default function ConcoursDetailPage() {
  const params = useParams()
  const concoursId = params.id as string

  // Find the concours by ID
  const concour = concours.find((c) => c.examId === concoursId)

  if (!concour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <EnhancedGlassCard className="text-center p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Concours Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            The concours you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/public-concours">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Concours
            </Button>
          </Link>
        </EnhancedGlassCard>
      </div>
    )
  }

  const isRegistrationOpen = concour.registrationDeadline > new Date()
  const isUpcoming = concour.date > new Date()
  const daysUntilDeadline = Math.ceil(
    (concour.registrationDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )
  const daysUntilExam = Math.ceil((concour.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/public-concours">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Concours
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{concour.title}</h1>
                  <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{concour.hostInstitution}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>{concour.department}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={isRegistrationOpen ? "default" : "secondary"} className="text-sm">
                      {isRegistrationOpen ? "Registration Open" : "Registration Closed"}
                    </Badge>
                    {isUpcoming && (
                      <Badge variant="outline" className="text-sm">
                        Upcoming Exam
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-sm">
                      {concour.type}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{concour.description}</p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <EnhancedGlassCard>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{concour.availableSeats}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Available Seats</div>
                </div>
              </EnhancedGlassCard>

              <EnhancedGlassCard>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {concour.examFee.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">FCFA</div>
                </div>
              </EnhancedGlassCard>

              {isRegistrationOpen && (
                <EnhancedGlassCard>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{daysUntilDeadline}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Days Until Deadline</div>
                  </div>
                </EnhancedGlassCard>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="institution">Institution</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <EnhancedGlassCard>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Examination Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Exam Date</p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {concour.date.toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <Clock className="w-5 h-5 text-amber-500" />
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Registration Deadline</p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {concour.registrationDeadline.toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <Target className="w-5 h-5 text-purple-500" />
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Examination Fee</p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {concour.examFee.toLocaleString()} FCFA
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <Users className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Available Seats</p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {concour.availableSeats} positions
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </EnhancedGlassCard>

                  <EnhancedGlassCard>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        About This Concours
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{concour.description}</p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Important Information</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              This is a competitive entrance examination. Only candidates who meet all requirements and
                              submit complete applications before the deadline will be considered.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </EnhancedGlassCard>
                </div>

                {/* Action Panel */}
                <div className="space-y-6">
                  <EnhancedGlassCard>
                    <CardHeader>
                      <CardTitle className="text-center">Registration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isRegistrationOpen ? (
                        <>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Registration Open</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {daysUntilDeadline} days remaining
                            </p>
                          </div>
                          <Link href="/auth" className="block">
                            <Button className="w-full" size="lg">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Register Now
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Clock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Registration Closed</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Deadline has passed</p>
                          </div>
                          <Button className="w-full" size="lg" disabled>
                            Registration Closed
                          </Button>
                        </>
                      )}

                      <Separator />

                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download Brochure
                        </Button>
                        <Button variant="outline" className="w-full" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Application Form
                        </Button>
                      </div>
                    </CardContent>
                  </EnhancedGlassCard>

                  {isRegistrationOpen && daysUntilDeadline <= 7 && (
                    <EnhancedGlassCard variant="accent">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                              Deadline Approaching
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                              Only {daysUntilDeadline} days left to register. Don't miss this opportunity!
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </EnhancedGlassCard>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Requirements Tab */}
            <TabsContent value="requirements">
              <EnhancedGlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Application Requirements
                  </CardTitle>
                  <CardDescription>All requirements must be met for your application to be considered</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {concour.applicationRequirements.map((requirement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-slate-900 dark:text-white font-medium">{requirement}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">Important Notes</h4>
                        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                          <li>• All documents must be original or certified copies</li>
                          <li>• Incomplete applications will be automatically rejected</li>
                          <li>• Application fees are non-refundable</li>
                          <li>• Late submissions will not be accepted under any circumstances</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedGlassCard>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <EnhancedGlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Important Dates & Timeline
                  </CardTitle>
                  <CardDescription>Key dates and milestones for this concours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

                      <div className="relative flex items-start gap-4 pb-6">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">Registration Opens</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Applications can be submitted online
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Started 2 months ago</p>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-4 pb-6">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isRegistrationOpen ? "bg-amber-500" : "bg-red-500"
                          }`}
                        >
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">Registration Deadline</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Last day to submit applications</p>
                          <p
                            className={`text-xs mt-1 ${
                              isRegistrationOpen
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {concour.registrationDeadline.toLocaleDateString()}
                            {isRegistrationOpen && ` (${daysUntilDeadline} days left)`}
                          </p>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-4 pb-6">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isUpcoming ? "bg-slate-300 dark:bg-slate-600" : "bg-green-500"
                          }`}
                        >
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">Examination Date</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Written examination will be conducted
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isUpcoming ? "text-slate-600 dark:text-slate-400" : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            {concour.date.toLocaleDateString()}
                            {isUpcoming && daysUntilExam > 0 && ` (${daysUntilExam} days away)`}
                          </p>
                        </div>
                      </div>

                      <div className="relative flex items-start gap-4">
                        <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">Results Publication</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Results will be published online</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Approximately 4-6 weeks after examination
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedGlassCard>
            </TabsContent>

            {/* Institution Tab */}
            <TabsContent value="institution">
              <EnhancedGlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    About {concour.hostInstitution}
                  </CardTitle>
                  <CardDescription>Learn more about the institution offering this concours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Building className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          {concour.hostInstitution}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">{concour.department}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Cameroon</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            <span>Higher Education</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-3">Institution Information</h4>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {concour.hostInstitution} is a leading institution in Cameroon's higher education system,
                        committed to providing quality education and training in various fields. The{" "}
                        {concour.department}
                        is known for its excellence in academic programs and research initiatives.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h5 className="font-medium text-slate-900 dark:text-white mb-2">Contact Information</h5>
                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <p>Email: info@{concour.hostInstitution.toLowerCase().replace(/\s+/g, "")}.cm</p>
                          <p>Phone: +237 XXX XXX XXX</p>
                          <p>Website: www.{concour.hostInstitution.toLowerCase().replace(/\s+/g, "")}.cm</p>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <h5 className="font-medium text-slate-900 dark:text-white mb-2">Quick Facts</h5>
                        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                          <p>Type: Public University</p>
                          <p>Established: 1993</p>
                          <p>Students: 15,000+</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedGlassCard>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
