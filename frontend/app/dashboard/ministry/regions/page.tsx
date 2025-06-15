"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import DashboardLayout from "@/components/dashboard-layout"
import {
  MapPin,
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  Users,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  ChevronRight,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const regions = [
  {
    id: 1,
    name: "Centre",
    capital: "Yaoundé",
    population: 4200000,
    institutions: {
      universities: 5,
      secondary: 245,
      primary: 678,
    },
    students: 980000,
    passRate: 78.4,
    trend: "up",
    trendValue: 2.3,
    director: "Prof. Jean-Pierre Kamga",
    contact: "+237 655 234 567",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    name: "Littoral",
    capital: "Douala",
    population: 3800000,
    institutions: {
      universities: 4,
      secondary: 198,
      primary: 542,
    },
    students: 850000,
    passRate: 76.2,
    trend: "up",
    trendValue: 1.8,
    director: "Dr. Esther Mbella",
    contact: "+237 655 567 890",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: 3,
    name: "West",
    capital: "Bafoussam",
    population: 1900000,
    institutions: {
      universities: 2,
      secondary: 156,
      primary: 423,
    },
    students: 520000,
    passRate: 79.5,
    trend: "up",
    trendValue: 3.1,
    director: "Dr. Michel Fotso",
    contact: "+237 655 678 901",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 4,
    name: "South West",
    capital: "Buea",
    population: 1500000,
    institutions: {
      universities: 2,
      secondary: 128,
      primary: 356,
    },
    students: 420000,
    passRate: 74.8,
    trend: "down",
    trendValue: 1.2,
    director: "Dr. Emmanuel Tabi",
    contact: "+237 655 890 123",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: 5,
    name: "North West",
    capital: "Bamenda",
    population: 1800000,
    institutions: {
      universities: 1,
      secondary: 134,
      primary: 387,
    },
    students: 450000,
    passRate: 72.5,
    trend: "down",
    trendValue: 2.4,
    director: "Prof. Sarah Nkwenti",
    contact: "+237 655 901 234",
    color: "from-red-500 to-pink-600",
  },
  {
    id: 6,
    name: "Far North",
    capital: "Maroua",
    population: 3900000,
    institutions: {
      universities: 1,
      secondary: 125,
      primary: 412,
    },
    students: 680000,
    passRate: 68.3,
    trend: "up",
    trendValue: 4.2,
    director: "Dr. Ahmadou Moussa",
    contact: "+237 655 012 345",
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: 7,
    name: "Adamawa",
    capital: "Ngaoundéré",
    population: 1200000,
    institutions: {
      universities: 1,
      secondary: 76,
      primary: 245,
    },
    students: 320000,
    passRate: 70.1,
    trend: "up",
    trendValue: 3.5,
    director: "Dr. Ibrahim Bello",
    contact: "+237 655 123 456",
    color: "from-teal-500 to-cyan-600",
  },
  {
    id: 8,
    name: "East",
    capital: "Bertoua",
    population: 800000,
    institutions: {
      universities: 1,
      secondary: 98,
      primary: 276,
    },
    students: 280000,
    passRate: 71.9,
    trend: "up",
    trendValue: 2.8,
    director: "Dr. Jeanne Mbarga",
    contact: "+237 655 234 567",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: 9,
    name: "North",
    capital: "Garoua",
    population: 1300000,
    institutions: {
      universities: 1,
      secondary: 87,
      primary: 298,
    },
    students: 350000,
    passRate: 69.4,
    trend: "up",
    trendValue: 1.7,
    director: "Prof. Oumarou Sali",
    contact: "+237 655 345 678",
    color: "from-orange-500 to-red-600",
  },
  {
    id: 10,
    name: "South",
    capital: "Ebolowa",
    population: 750000,
    institutions: {
      universities: 1,
      secondary: 92,
      primary: 234,
    },
    students: 240000,
    passRate: 75.6,
    trend: "up",
    trendValue: 2.1,
    director: "Dr. Pierre Mvondo",
    contact: "+237 655 456 789",
    color: "from-indigo-500 to-purple-600",
  },
]

const stats = [
  {
    title: "Total Regions",
    value: "10",
    icon: MapPin,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Total Institutions",
    value: "3,617",
    icon: Building2,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Total Students",
    value: "5.09M",
    icon: Users,
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Avg. Pass Rate",
    value: "73.7%",
    icon: GraduationCap,
    color: "from-amber-500 to-orange-600",
  },
]

export default function MinistryRegionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")

  const filteredRegions = regions.filter(
    (region) =>
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.capital.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort regions by pass rate for ranking
  const rankedRegions = [...regions].sort((a, b) => b.passRate - a.passRate)

  return (
    <DashboardLayout userRole="ministry_admin" userName="Dr. Marie Ngozi">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Regional Management
            </h1>
            <p className="text-muted-foreground mt-2">Monitor and manage educational performance across all regions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Regional Analytics
            </Button>
          </div>
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
                  placeholder="Search regions..."
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
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setSelectedTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="institutions">Institutions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRegions.map((region) => (
                <Card
                  key={region.id}
                  className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          {region.name} Region
                        </CardTitle>
                        <CardDescription className="mt-1">Capital: {region.capital}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Performance Report</DropdownMenuItem>
                          <DropdownMenuItem>Institution List</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Population</p>
                        <p className="font-semibold">{region.population.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Students</p>
                        <p className="font-semibold">{region.students.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pass Rate</span>
                        <div className="flex items-center">
                          <span className="font-semibold">{region.passRate}%</span>
                          <div className="ml-2">
                            {region.trend === "up" ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>
                      <Progress value={region.passRate} className="h-2" />
                      <div className="text-xs text-right text-muted-foreground">
                        {region.trend === "up" ? "+" : "-"}
                        {region.trendValue}% from last year
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Institutions</p>
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="font-medium">{region.institutions.universities}</span>
                          <span className="text-muted-foreground ml-1">Universities</span>
                        </div>
                        <div>
                          <span className="font-medium">{region.institutions.secondary}</span>
                          <span className="text-muted-foreground ml-1">Secondary</span>
                        </div>
                        <div>
                          <span className="font-medium">{region.institutions.primary}</span>
                          <span className="text-muted-foreground ml-1">Primary</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Regional Director</p>
                          <p className="text-sm font-medium">{region.director}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance Ranking</CardTitle>
                <CardDescription>Comparative analysis of examination performance across all regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rankedRegions.map((region, index) => (
                    <div key={region.id} className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium">{region.name}</h3>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {region.capital}
                          </Badge>
                        </div>
                        <div className="w-full mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Pass Rate</span>
                            <div className="flex items-center">
                              <span className="font-semibold">{region.passRate}%</span>
                              <div className="ml-2">
                                {region.trend === "up" ? (
                                  <TrendingUp className="w-3 h-3 text-green-600" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 text-red-600" />
                                )}
                              </div>
                            </div>
                          </div>
                          <Progress value={region.passRate} className="h-2" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{region.students.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Students</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Year-over-year performance changes by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regions
                      .sort((a, b) => Math.abs(b.trendValue) - Math.abs(a.trendValue))
                      .slice(0, 5)
                      .map((region) => (
                        <div key={region.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-full rounded-full mr-3 ${
                                region.trend === "up" ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                            <span>{region.name}</span>
                          </div>
                          <div
                            className={`flex items-center ${region.trend === "up" ? "text-green-600" : "text-red-600"}`}
                          >
                            {region.trend === "up" ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            <span className="font-semibold">
                              {region.trend === "up" ? "+" : "-"}
                              {region.trendValue}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Disparities</CardTitle>
                  <CardDescription>Gap analysis between highest and lowest performing regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Highest Performing</div>
                        <div className="font-medium">{rankedRegions[0].name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{rankedRegions[0].passRate}%</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Lowest Performing</div>
                        <div className="font-medium">{rankedRegions[rankedRegions.length - 1].name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-600">
                          {rankedRegions[rankedRegions.length - 1].passRate}%
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">Performance Gap</div>
                        <div className="text-lg font-bold">
                          {(rankedRegions[0].passRate - rankedRegions[rankedRegions.length - 1].passRate).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="institutions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Institutional Distribution</CardTitle>
                <CardDescription>Overview of educational institutions across all regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="text-left p-3 font-medium">Region</th>
                        <th className="text-center p-3 font-medium">Universities</th>
                        <th className="text-center p-3 font-medium">Secondary Schools</th>
                        <th className="text-center p-3 font-medium">Primary Schools</th>
                        <th className="text-center p-3 font-medium">Total</th>
                        <th className="text-right p-3 font-medium">Student-Institution Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegions.map((region) => {
                        const totalInstitutions =
                          region.institutions.universities + region.institutions.secondary + region.institutions.primary
                        const ratio = Math.round(region.students / totalInstitutions)

                        return (
                          <tr key={region.id} className="border-t">
                            <td className="p-3 font-medium">{region.name}</td>
                            <td className="p-3 text-center">{region.institutions.universities}</td>
                            <td className="p-3 text-center">{region.institutions.secondary}</td>
                            <td className="p-3 text-center">{region.institutions.primary}</td>
                            <td className="p-3 text-center font-medium">{totalInstitutions}</td>
                            <td className="p-3 text-right">
                              <Badge variant="outline">{ratio.toLocaleString()} : 1</Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Institution Types</CardTitle>
                  <CardDescription>Distribution of institution types across regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Universities</span>
                        <span className="font-medium">
                          {regions.reduce((sum, region) => sum + region.institutions.universities, 0)}
                        </span>
                      </div>
                      <Progress value={5} className="h-2 bg-blue-100" indicatorClassName="bg-blue-600" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Secondary Schools</span>
                        <span className="font-medium">
                          {regions.reduce((sum, region) => sum + region.institutions.secondary, 0)}
                        </span>
                      </div>
                      <Progress value={35} className="h-2 bg-purple-100" indicatorClassName="bg-purple-600" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Primary Schools</span>
                        <span className="font-medium">
                          {regions.reduce((sum, region) => sum + region.institutions.primary, 0)}
                        </span>
                      </div>
                      <Progress value={60} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Directors</CardTitle>
                  <CardDescription>Contact information for regional education directors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {filteredRegions.map((region) => (
                      <div
                        key={region.id}
                        className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-md"
                      >
                        <div>
                          <div className="font-medium">{region.director}</div>
                          <div className="text-sm text-muted-foreground">{region.name} Region</div>
                        </div>
                        <div className="text-sm">{region.contact}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
