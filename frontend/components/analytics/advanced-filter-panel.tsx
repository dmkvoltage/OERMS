"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Filter, Search, X, CalendarIcon, Save, RotateCcw, Download, Plus, BookmarkPlus } from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

interface FilterConfig {
  id: string
  name: string
  type: "text" | "select" | "multiselect" | "range" | "date" | "daterange" | "boolean"
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  placeholder?: string
}

interface ActiveFilter {
  id: string
  name: string
  value: any
  display: string
}

interface SavedFilter {
  id: string
  name: string
  filters: ActiveFilter[]
  createdAt: Date
}

interface AdvancedFilterPanelProps {
  isOpen: boolean
  onToggle: () => void
  onFiltersChange: (filters: ActiveFilter[]) => void
  filterConfigs: FilterConfig[]
  data?: any[]
}

export function AdvancedFilterPanel({
  isOpen,
  onToggle,
  onFiltersChange,
  filterConfigs,
  data = [],
}: AdvancedFilterPanelProps) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [filterHistory, setFilterHistory] = useState<ActiveFilter[][]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveFilterName, setSaveFilterName] = useState("")
  const [quickFilters, setQuickFilters] = useState([
    { name: "High Performers", filters: [{ field: "score", operator: ">=", value: 85 }] },
    { name: "Recent Exams", filters: [{ field: "date", operator: ">=", value: "last30days" }] },
    { name: "Failed Students", filters: [{ field: "grade", operator: "in", value: ["F", "E"] }] },
  ])

  // Search suggestions based on data
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    // Generate search suggestions from data
    if (data.length > 0) {
      const suggestions = new Set<string>()
      data.forEach((item) => {
        Object.values(item).forEach((value) => {
          if (typeof value === "string" && value.length > 2) {
            suggestions.add(value)
          }
        })
      })
      setSearchSuggestions(Array.from(suggestions).slice(0, 10))
    }
  }, [data])

  useEffect(() => {
    onFiltersChange(activeFilters)
  }, [activeFilters, onFiltersChange])

  const addFilter = (config: FilterConfig, value: any) => {
    const display = Array.isArray(value) ? value.join(", ") : value.toString()
    const newFilter: ActiveFilter = {
      id: `${config.id}-${Date.now()}`,
      name: config.name,
      value,
      display,
    }

    setFilterHistory([...filterHistory, activeFilters])
    setActiveFilters([...activeFilters, newFilter])
  }

  const removeFilter = (filterId: string) => {
    setFilterHistory([...filterHistory, activeFilters])
    setActiveFilters(activeFilters.filter((f) => f.id !== filterId))
  }

  const clearAllFilters = () => {
    setFilterHistory([...filterHistory, activeFilters])
    setActiveFilters([])
    setSearchQuery("")
  }

  const undoLastChange = () => {
    if (filterHistory.length > 0) {
      const previousState = filterHistory[filterHistory.length - 1]
      setActiveFilters(previousState)
      setFilterHistory(filterHistory.slice(0, -1))
    }
  }

  const saveCurrentFilters = () => {
    if (saveFilterName.trim() && activeFilters.length > 0) {
      const newSavedFilter: SavedFilter = {
        id: Date.now().toString(),
        name: saveFilterName.trim(),
        filters: [...activeFilters],
        createdAt: new Date(),
      }
      setSavedFilters([...savedFilters, newSavedFilter])
      setSaveFilterName("")
      setShowSaveDialog(false)
    }
  }

  const loadSavedFilter = (savedFilter: SavedFilter) => {
    setFilterHistory([...filterHistory, activeFilters])
    setActiveFilters([...savedFilter.filters])
  }

  const applyQuickFilter = (quickFilter: any) => {
    // Convert quick filter to active filters
    const newFilters = quickFilter.filters.map((f: any) => ({
      id: `quick-${Date.now()}-${Math.random()}`,
      name: f.field,
      value: f.value,
      display: `${f.field} ${f.operator} ${f.value}`,
    }))
    setFilterHistory([...filterHistory, activeFilters])
    setActiveFilters([...activeFilters, ...newFilters])
  }

  const FilterInput = ({ config }: { config: FilterConfig }) => {
    const [localValue, setLocalValue] = useState<any>("")
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

    const handleApply = () => {
      if (localValue !== "" && localValue !== null && localValue !== undefined) {
        addFilter(config, localValue)
        setLocalValue("")
      }
    }

    const handleDateRangeApply = () => {
      if (dateRange.from) {
        addFilter(config, dateRange)
        setDateRange({})
      }
    }

    switch (config.type) {
      case "text":
        return (
          <div className="flex gap-2">
            <Input
              placeholder={config.placeholder || `Enter ${config.name.toLowerCase()}`}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleApply()}
            />
            <Button size="sm" onClick={handleApply} disabled={!localValue}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )

      case "select":
        return (
          <div className="flex gap-2">
            <Select value={localValue} onValueChange={setLocalValue}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${config.name.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {config.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleApply} disabled={!localValue}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )

      case "multiselect":
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {config.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={Array.isArray(localValue) && localValue.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setLocalValue([...(Array.isArray(localValue) ? localValue : []), option.value])
                      } else {
                        setLocalValue(Array.isArray(localValue) ? localValue.filter((v) => v !== option.value) : [])
                      }
                    }}
                  />
                  <Label htmlFor={option.value} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={!Array.isArray(localValue) || localValue.length === 0}
              className="w-full"
            >
              Apply Selection
            </Button>
          </div>
        )

      case "range":
        return (
          <div className="space-y-3">
            <div className="px-2">
              <Slider
                value={Array.isArray(localValue) ? localValue : [config.min || 0, config.max || 100]}
                onValueChange={setLocalValue}
                min={config.min || 0}
                max={config.max || 100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>{Array.isArray(localValue) ? localValue[0] : config.min || 0}</span>
              <span>{Array.isArray(localValue) ? localValue[1] : config.max || 100}</span>
            </div>
            <Button size="sm" onClick={handleApply} className="w-full">
              Apply Range
            </Button>
          </div>
        )

      case "daterange":
        return (
          <div className="space-y-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button size="sm" onClick={handleDateRangeApply} disabled={!dateRange.from} className="w-full">
              Apply Date Range
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-0 h-full w-96 bg-white border-l border-slate-200 shadow-xl z-50 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-800">Advanced Filters</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onToggle}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <Label>Global Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search across all data..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  className="pl-10"
                />
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-md shadow-lg z-10 mt-1">
                    {searchSuggestions
                      .filter((suggestion) => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 5)
                      .map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm"
                          onClick={() => {
                            setSearchQuery(suggestion)
                            setShowSuggestions(false)
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="space-y-3">
              <Label>Quick Filters</Label>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((filter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => applyQuickFilter(filter)}
                    className="text-xs"
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Active Filters ({activeFilters.length})</Label>
                  <div className="flex gap-1">
                    {filterHistory.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={undoLastChange}>
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {activeFilters.map((filter) => (
                    <Badge key={filter.id} variant="secondary" className="flex items-center justify-between w-full">
                      <span className="truncate">
                        {filter.name}: {filter.display}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFilter(filter.id)}
                        className="h-4 w-4 p-0 ml-2"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                {filterConfigs.slice(0, 6).map((config) => (
                  <div key={config.id} className="space-y-2">
                    <Label>{config.name}</Label>
                    <FilterInput config={config} />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                {filterConfigs.slice(6).map((config) => (
                  <div key={config.id} className="space-y-2">
                    <Label>{config.name}</Label>
                    <FilterInput config={config} />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Saved Filter Sets</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSaveDialog(true)}
                      disabled={activeFilters.length === 0}
                    >
                      <BookmarkPlus className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>

                  {showSaveDialog && (
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <Input
                          placeholder="Filter set name"
                          value={saveFilterName}
                          onChange={(e) => setSaveFilterName(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveCurrentFilters} disabled={!saveFilterName.trim()}>
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(false)}>
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {savedFilters.map((savedFilter) => (
                      <Card key={savedFilter.id} className="cursor-pointer hover:bg-slate-50">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div onClick={() => loadSavedFilter(savedFilter)}>
                              <h4 className="font-medium text-sm">{savedFilter.name}</h4>
                              <p className="text-xs text-slate-600">
                                {savedFilter.filters.length} filters • {format(savedFilter.createdAt, "MMM dd")}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSavedFilters(savedFilters.filter((f) => f.id !== savedFilter.id))}
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t">
              <Button className="w-full" disabled={activeFilters.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export Filtered Data
              </Button>
              <div className="text-xs text-slate-500 text-center">
                {activeFilters.length > 0
                  ? `${activeFilters.length} filter${activeFilters.length > 1 ? "s" : ""} applied`
                  : "No filters applied"}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
