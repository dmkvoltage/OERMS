"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"
import { TrendingUp, Users, Award, Search, Filter, Download, Eye, BarChart3, Calendar, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const examResults = [
  {
    id: 1,
    examName: "Baccalauréat A4 (Arts) 2024",
    examCode: "BAC-A4-2024",
    totalCandidates: 45000,
    passedCandidates: 32400,
    passRate: 72,
    averageScore: 12.5,
    publishDate: "2024-07-15",
    status: "Published",
    topPerformers: [
      { name: "Marie Dubois", score: 19.2, region: "Centre" },
      { name: "Jean Kamga", score: 18.8, region: "West" },
      { name: "Sarah Mballa", score: 18.5, region: "Littoral" },
    ],
    regionalStats: [
      { region: "Centre", candidates: 8500, passed: 6800, passRate: 80 },
      { region: "Littoral", candidates: 7200, passed: 5400, passRate: 75 },
      { region: "West", candidates: 6800, passed: 4760, passRate: 70 },
      { region: "North West", candidates: 5500, passed: 3850, passRate: 70 },
    ],
  },
  {
    id: 2,
    examName: "GCE Advanced Level 2024",
    examCode: "GCE-AL-2024",
    totalCandidates: 32000,
    passedCandidates: 25600,
    passRate: 80,
    averageScore: 14.2,
    publishDate: "2024-07-20",
    status: "Published",
    topPerformers: [
      { name: "David Nkomo", score: 19.8, region: "South West" },
      { name: "Grace Tabi", score: 19.5, region: "North West" },
      { name: "Peter Fon", score: 19.1, region: "South West" },
    ],
    regionalStats: [
      { region: "North West", candidates: 18000, passed: 15120, passRate: 84 },
      { region: "South West", candidates: 14000, passed: 10500, passRate: 75 },
    ],
  },
  {
    id: 3,
    examName: "BEPC 2024",
    examCode: "BEPC-2024",
    totalCandidates: 85000,
    passedCandidates: 59500,
    passRate: 70,
    averageScore: 11.8,
    publishDate: "2024-08-01",
    status: "Processing",
    topPerformers: [],
    regionalStats: [],
  },
]

const stats = [
  {
    title: "Total Results Published",
    value: "12",
    change: "+3",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Average Pass Rate",
    value: "74%",
    change: "+2%",
    icon: TrendingUp,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Total Candidates",
    value: "162K",
    change: "+8%",
    icon: Users,
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Excellence Rate",
    value: "15%",
    change: "+1%",
    icon: Award,
    color: "from-amber-500 to-orange-600",
  },
]

export default function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredResults = examResults.filter((result) => {
    const matchesSearch =
      result.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.examCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || result.status.toLowerCase() === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout userRole="ministry_admin" userName="Dr. Marie Ngozi">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Examination Results
            </h1>
            <p className="text-muted-foreground mt-2">Monitor and analyze examination results across all regions</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">{stat.change} from last year</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results List */}
        <div className="space-y-6">
          {filteredResults.map((result) => (
            <Card key={result.id} className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{result.examName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{result.examCode}</Badge>
                      <Badge
                        className={
                          result.status === "Published"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }
                      >
                        {result.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Published: {new Date(result.publishDate).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{result.totalCandidates.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Candidates</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{result.passedCandidates.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Passed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{result.passRate}%</p>
                    <p className="text-sm text-muted-foreground">Pass Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">{result.averageScore}/20</p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>

                {/* Pass Rate Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pass Rate</span>
                    <span>{result.passRate}%</span>
                  </div>
                  <Progress value={result.passRate} className="h-2" />
                </div>

                {result.status === "Published" && (
                  <Tabs defaultValue="regional" className="space-y-4">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                      <TabsTrigger value="regional">Regional Stats</TabsTrigger>
                      <TabsTrigger value="top">Top Performers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="regional" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.regionalStats.map((region, idx) => (
                          <Card key={idx} className="border border-gray-200 dark:border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">{region.region}</h4>
                                <Badge variant="outline">{region.passRate}%</Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Candidates: {region.candidates.toLocaleString()}</span>
                                  <span>Passed: {region.passed.toLocaleString()}</span>
                                </div>
                                <Progress value={region.passRate} className="h-1" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="top" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {result.topPerformers.map((performer, idx) => (
                          <Card key={idx} className="border border-gray-200 dark:border-gray-700">
                            <CardContent className="p-4 text-center">
                              <div className="space-y-2">
                                <div
                                  className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-white font-bold ${
                                    idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-gray-400" : "bg-amber-600"
                                  }`}
                                >
                                  {idx + 1}
                                </div>
                                <h4 className="font-semibold">{performer.name}</h4>
                                <p className="text-2xl font-bold text-blue-600">{performer.score}/20</p>
                                <Badge variant="outline">{performer.region}</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
