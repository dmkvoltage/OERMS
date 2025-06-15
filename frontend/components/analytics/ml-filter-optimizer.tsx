"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Target, TrendingUp, Zap, BarChart3, Settings, Play, Pause } from "lucide-react"
import { motion } from "framer-motion"

interface OptimizationResult {
  id: string
  originalFilters: any[]
  optimizedFilters: any[]
  improvement: {
    relevance: number
    speed: number
    accuracy: number
  }
  reasoning: string
  confidence: number
  estimatedResults: number
}

interface MLModel {
  name: string
  type: "neural_network" | "decision_tree" | "random_forest" | "gradient_boosting"
  accuracy: number
  trainingData: number
  lastTrained: Date
  status: "training" | "ready" | "optimizing"
}

interface MLFilterOptimizerProps {
  currentFilters: any[]
  onOptimizedFilters: (filters: any[]) => void
  userData: any
  historicalData: any[]
}

export function MLFilterOptimizer({
  currentFilters,
  onOptimizedFilters,
  userData,
  historicalData,
}: MLFilterOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([])
  const [mlModels, setMLModels] = useState<MLModel[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("neural_network")
  const [autoOptimize, setAutoOptimize] = useState(false)

  useEffect(() => {
    initializeMLModels()
  }, [])

  useEffect(() => {
    if (autoOptimize && currentFilters.length > 0) {
      optimizeFilters()
    }
  }, [currentFilters, autoOptimize])

  const initializeMLModels = () => {
    const models: MLModel[] = [
      {
        name: "Neural Network Optimizer",
        type: "neural_network",
        accuracy: 0.94,
        trainingData: 50000,
        lastTrained: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        status: "ready",
      },
      {
        name: "Decision Tree Classifier",
        type: "decision_tree",
        accuracy: 0.87,
        trainingData: 35000,
        lastTrained: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: "ready",
      },
      {
        name: "Random Forest Ensemble",
        type: "random_forest",
        accuracy: 0.91,
        trainingData: 45000,
        lastTrained: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        status: "ready",
      },
      {
        name: "Gradient Boosting Model",
        type: "gradient_boosting",
        accuracy: 0.89,
        trainingData: 40000,
        lastTrained: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        status: "training",
      },
    ]
    setMLModels(models)
  }

  const optimizeFilters = async () => {
    if (currentFilters.length === 0) return

    setIsOptimizing(true)
    setOptimizationProgress(0)

    // Simulate ML optimization process
    const steps = [
      "Analyzing current filter performance...",
      "Training optimization model...",
      "Generating filter variations...",
      "Evaluating performance metrics...",
      "Selecting optimal combinations...",
      "Validating results...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOptimizationProgress(((i + 1) / steps.length) * 100)
    }

    // Generate optimization results
    const results = generateOptimizationResults()
    setOptimizationResults(results)
    setIsOptimizing(false)
  }

  const generateOptimizationResults = (): OptimizationResult[] => {
    const results: OptimizationResult[] = []

    // Optimization 1: Add complementary filters
    if (currentFilters.some((f) => f.field === "score")) {
      results.push({
        id: "opt-1",
        originalFilters: currentFilters,
        optimizedFilters: [
          ...currentFilters,
          { field: "attendance", operator: ">=", value: 80, display: "Attendance ≥ 80%" },
        ],
        improvement: {
          relevance: 23,
          speed: 12,
          accuracy: 18,
        },
        reasoning: "Adding attendance filter improves correlation with academic success by 23%",
        confidence: 0.91,
        estimatedResults: 187,
      })
    }

    // Optimization 2: Adjust thresholds
    const scoreFilter = currentFilters.find((f) => f.field === "score")
    if (scoreFilter && scoreFilter.operator === ">=" && scoreFilter.value > 70) {
      results.push({
        id: "opt-2",
        originalFilters: currentFilters,
        optimizedFilters: currentFilters.map((f) =>
          f.field === "score" ? { ...f, value: f.value - 5, display: `Score ≥ ${f.value - 5}%` } : f,
        ),
        improvement: {
          relevance: 15,
          speed: 8,
          accuracy: 12,
        },
        reasoning: "Lowering score threshold by 5 points increases sample size while maintaining quality",
        confidence: 0.87,
        estimatedResults: 298,
      })
    }

    // Optimization 3: Add temporal context
    if (!currentFilters.some((f) => f.field === "date")) {
      results.push({
        id: "opt-3",
        originalFilters: currentFilters,
        optimizedFilters: [
          ...currentFilters,
          { field: "date", operator: ">=", value: "last60days", display: "Last 60 days" },
        ],
        improvement: {
          relevance: 19,
          speed: 25,
          accuracy: 14,
        },
        reasoning: "Adding temporal filter improves relevance and reduces processing time by 25%",
        confidence: 0.93,
        estimatedResults: 156,
      })
    }

    // Optimization 4: Regional clustering
    if (currentFilters.some((f) => f.field === "region")) {
      results.push({
        id: "opt-4",
        originalFilters: currentFilters,
        optimizedFilters: [
          ...currentFilters.filter((f) => f.field !== "region"),
          {
            field: "region_cluster",
            operator: "in",
            value: ["high_performance_cluster"],
            display: "High-performance regions",
          },
        ],
        improvement: {
          relevance: 31,
          speed: 18,
          accuracy: 27,
        },
        reasoning: "ML-identified regional clusters show 31% better performance correlation",
        confidence: 0.89,
        estimatedResults: 234,
      })
    }

    return results.slice(0, 3) // Return top 3 optimizations
  }

  const applyOptimization = (result: OptimizationResult) => {
    onOptimizedFilters(result.optimizedFilters)
  }

  const trainModel = async (modelType: string) => {
    setMLModels(mlModels.map((model) => (model.type === modelType ? { ...model, status: "training" as const } : model)))

    // Simulate training
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setMLModels(
      mlModels.map((model) =>
        model.type === modelType
          ? {
              ...model,
              status: "ready" as const,
              accuracy: Math.min(0.98, model.accuracy + 0.02),
              lastTrained: new Date(),
            }
          : model,
      ),
    )
  }

  const getModelIcon = (type: string) => {
    switch (type) {
      case "neural_network":
        return <Brain className="w-4 h-4" />
      case "decision_tree":
        return <BarChart3 className="w-4 h-4" />
      case "random_forest":
        return <TrendingUp className="w-4 h-4" />
      case "gradient_boosting":
        return <Zap className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getImprovementColor = (improvement: number) => {
    if (improvement >= 25) return "text-green-600"
    if (improvement >= 15) return "text-blue-600"
    if (improvement >= 5) return "text-yellow-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            ML Filter Optimizer
          </CardTitle>
          <CardDescription>
            Machine learning-powered filter optimization for better results and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="optimize" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="optimize">Optimize</TabsTrigger>
              <TabsTrigger value="models">ML Models</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="optimize" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Current Filter Analysis</h3>
                  <p className="text-sm text-slate-600">
                    {currentFilters.length > 0
                      ? `Analyzing ${currentFilters.length} active filters`
                      : "No filters to optimize"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setAutoOptimize(!autoOptimize)}
                    className={autoOptimize ? "bg-green-50 border-green-200" : ""}
                  >
                    {autoOptimize ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    Auto-Optimize
                  </Button>
                  <Button onClick={optimizeFilters} disabled={isOptimizing || currentFilters.length === 0}>
                    <Target className="w-4 h-4 mr-1" />
                    Optimize Now
                  </Button>
                </div>
              </div>

              {isOptimizing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Optimizing filters...</span>
                    <span>{optimizationProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={optimizationProgress} className="h-2" />
                </div>
              )}

              {optimizationResults.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Optimization Suggestions</h4>
                  {optimizationResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-slate-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-medium">Optimization #{result.id.split("-")[1]}</h5>
                          <p className="text-sm text-slate-600 mt-1">{result.reasoning}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-700">
                            {(result.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                          <Button size="sm" onClick={() => applyOptimization(result)}>
                            Apply
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getImprovementColor(result.improvement.relevance)}`}>
                            +{result.improvement.relevance}%
                          </div>
                          <div className="text-xs text-slate-500">Relevance</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getImprovementColor(result.improvement.speed)}`}>
                            +{result.improvement.speed}%
                          </div>
                          <div className="text-xs text-slate-500">Speed</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getImprovementColor(result.improvement.accuracy)}`}>
                            +{result.improvement.accuracy}%
                          </div>
                          <div className="text-xs text-slate-500">Accuracy</div>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-slate-500">Estimated results:</span>
                        <span className="font-medium ml-1">{result.estimatedResults}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="models" className="space-y-4">
              <div className="grid gap-4">
                {mlModels.map((model) => (
                  <div key={model.type} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getModelIcon(model.type)}
                        <h4 className="font-semibold">{model.name}</h4>
                        <Badge
                          variant={
                            model.status === "ready" ? "default" : model.status === "training" ? "secondary" : "outline"
                          }
                        >
                          {model.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedModel(model.type)}
                          disabled={model.status === "training"}
                        >
                          {selectedModel === model.type ? "Selected" : "Select"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => trainModel(model.type)}
                          disabled={model.status === "training"}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Retrain
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Accuracy:</span>
                        <div className="font-semibold text-green-600">{(model.accuracy * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Training Data:</span>
                        <div className="font-semibold">{model.trainingData.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Last Trained:</span>
                        <div className="font-semibold">{model.lastTrained.toLocaleDateString()}</div>
                      </div>
                    </div>

                    {model.status === "training" && (
                      <div className="mt-3">
                        <Progress value={75} className="h-2" />
                        <div className="text-xs text-slate-500 mt-1">Training in progress...</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Optimization History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { date: "Today", optimizations: 3, improvement: 24 },
                        { date: "Yesterday", optimizations: 5, improvement: 18 },
                        { date: "2 days ago", optimizations: 2, improvement: 31 },
                        { date: "3 days ago", optimizations: 4, improvement: 15 },
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{item.date}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.optimizations} opts</Badge>
                            <span className="text-sm font-medium text-green-600">+{item.improvement}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Filter Relevance</span>
                          <span>87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Query Speed</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Result Accuracy</span>
                          <span>94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ML Insights</CardTitle>
                  <CardDescription>Key patterns discovered by machine learning analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-1">Filter Correlation Discovery</h5>
                      <p className="text-sm text-blue-700">
                        Score and attendance filters show 89% correlation - combining them improves accuracy by 23%
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-1">Temporal Pattern</h5>
                      <p className="text-sm text-green-700">
                        Filters applied between 9-11 AM show 34% better performance than afternoon sessions
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h5 className="font-medium text-purple-800 mb-1">User Behavior Insight</h5>
                      <p className="text-sm text-purple-700">
                        Your filter combinations are 18% more efficient than the average user in your role
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
