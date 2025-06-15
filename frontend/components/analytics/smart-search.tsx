"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Clock, TrendingUp, Filter, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SearchSuggestion {
  id: string
  text: string
  type: "recent" | "popular" | "smart" | "filter"
  category?: string
  count?: number
}

interface SmartSearchProps {
  placeholder?: string
  onSearch: (query: string, filters?: any[]) => void
  data?: any[]
  recentSearches?: string[]
  className?: string
}

export function SmartSearch({
  placeholder = "Search...",
  onSearch,
  data = [],
  recentSearches = [],
  className,
}: SmartSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [searchHistory, setSearchHistory] = useState<string[]>(recentSearches)
  const [smartFilters, setSmartFilters] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate smart suggestions based on data and query
  useEffect(() => {
    if (query.length === 0) {
      // Show recent searches and popular terms when no query
      const recentSuggestions: SearchSuggestion[] = searchHistory.slice(0, 5).map((search, index) => ({
        id: `recent-${index}`,
        text: search,
        type: "recent",
      }))

      const popularTerms: SearchSuggestion[] = [
        { id: "pop-1", text: "high performers", type: "popular", count: 156 },
        { id: "pop-2", text: "failed students", type: "popular", count: 89 },
        { id: "pop-3", text: "recent exams", type: "popular", count: 234 },
      ]

      setSuggestions([...recentSuggestions, ...popularTerms])
    } else {
      // Generate smart suggestions based on query
      const smartSuggestions = generateSmartSuggestions(query, data)
      setSuggestions(smartSuggestions)
    }
  }, [query, data, searchHistory])

  const generateSmartSuggestions = (searchQuery: string, dataset: any[]): SearchSuggestion[] => {
    const suggestions: SearchSuggestion[] = []
    const lowerQuery = searchQuery.toLowerCase()

    // Text matching suggestions
    const textMatches = new Set<string>()
    dataset.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === "string" && value.toLowerCase().includes(lowerQuery)) {
          textMatches.add(value)
        }
      })
    })

    Array.from(textMatches)
      .slice(0, 5)
      .forEach((match, index) => {
        suggestions.push({
          id: `text-${index}`,
          text: match,
          type: "smart",
          category: "Exact Match",
        })
      })

    // Smart filter suggestions
    if (lowerQuery.includes("score") || lowerQuery.includes("grade")) {
      suggestions.push({
        id: "filter-score-high",
        text: "Students with score > 85%",
        type: "filter",
        category: "Smart Filter",
      })
      suggestions.push({
        id: "filter-score-low",
        text: "Students with score < 60%",
        type: "filter",
        category: "Smart Filter",
      })
    }

    if (lowerQuery.includes("recent") || lowerQuery.includes("new")) {
      suggestions.push({
        id: "filter-recent",
        text: "Exams from last 30 days",
        type: "filter",
        category: "Smart Filter",
      })
    }

    if (lowerQuery.includes("department") || lowerQuery.includes("faculty")) {
      suggestions.push({
        id: "filter-dept",
        text: "Filter by department",
        type: "filter",
        category: "Smart Filter",
      })
    }

    return suggestions.slice(0, 8)
  }

  const handleSearch = (searchQuery: string, isFilter = false) => {
    if (searchQuery.trim()) {
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter((h) => h !== searchQuery)].slice(0, 10)
      setSearchHistory(newHistory)

      if (isFilter) {
        // Handle smart filter application
        const filters = parseSmartFilter(searchQuery)
        onSearch(searchQuery, filters)
        setSmartFilters([...smartFilters, ...filters])
      } else {
        onSearch(searchQuery)
      }

      setQuery(searchQuery)
      setIsOpen(false)
    }
  }

  const parseSmartFilter = (filterText: string): any[] => {
    const filters = []

    if (filterText.includes("score > 85")) {
      filters.push({ field: "score", operator: ">", value: 85, display: "Score > 85%" })
    } else if (filterText.includes("score < 60")) {
      filters.push({ field: "score", operator: "<", value: 60, display: "Score < 60%" })
    } else if (filterText.includes("last 30 days")) {
      const date = new Date()
      date.setDate(date.getDate() - 30)
      filters.push({ field: "date", operator: ">=", value: date, display: "Last 30 days" })
    }

    return filters
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSearch(suggestions[selectedIndex].text, suggestions[selectedIndex].type === "filter")
        } else {
          handleSearch(query)
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const removeSmartFilter = (index: number) => {
    setSmartFilters(smartFilters.filter((_, i) => i !== index))
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "recent":
        return <Clock className="w-4 h-4 text-slate-400" />
      case "popular":
        return <TrendingUp className="w-4 h-4 text-blue-500" />
      case "filter":
        return <Filter className="w-4 h-4 text-purple-500" />
      default:
        return <Sparkles className="w-4 h-4 text-green-500" />
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Smart Filters Display */}
      {smartFilters.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {smartFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {filter.display}
              <Button variant="ghost" size="sm" onClick={() => removeSmartFilter(index)} className="h-4 w-4 p-0 ml-1">
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("")
              setIsOpen(false)
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    index === selectedIndex ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50"
                  }`}
                  onClick={() => handleSearch(suggestion.text, suggestion.type === "filter")}
                >
                  {getSuggestionIcon(suggestion.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{suggestion.text}</div>
                    {suggestion.category && <div className="text-xs text-slate-500">{suggestion.category}</div>}
                  </div>
                  {suggestion.count && (
                    <Badge variant="outline" className="text-xs">
                      {suggestion.count}
                    </Badge>
                  )}
                  {suggestion.type === "filter" && (
                    <Badge variant="secondary" className="text-xs">
                      Filter
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {query && (
              <div className="border-t border-slate-200 p-2">
                <div
                  className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-slate-50"
                  onClick={() => handleSearch(query)}
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">
                    Search for "<strong>{query}</strong>"
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
