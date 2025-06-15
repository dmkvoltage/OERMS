"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Play, Save, Download, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FilterRule {
  id: string
  field: string
  operator: string
  value: any
  logicalOperator?: "AND" | "OR"
}

interface FilterGroup {
  id: string
  rules: FilterRule[]
  logicalOperator: "AND" | "OR"
}

interface FilterBuilderProps {
  fields: { value: string; label: string; type: string }[]
  onFiltersChange: (filters: FilterGroup[]) => void
  onSave?: (name: string, filters: FilterGroup[]) => void
  onExport?: (filters: FilterGroup[]) => void
}

export function FilterBuilder({ fields, onFiltersChange, onSave, onExport }: FilterBuilderProps) {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    {
      id: "group-1",
      rules: [{ id: "rule-1", field: "", operator: "", value: "" }],
      logicalOperator: "AND",
    },
  ])
  const [previewData, setPreviewData] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const operators = {
    text: [
      { value: "equals", label: "Equals" },
      { value: "contains", label: "Contains" },
      { value: "startsWith", label: "Starts with" },
      { value: "endsWith", label: "Ends with" },
      { value: "notEquals", label: "Not equals" },
    ],
    number: [
      { value: "equals", label: "Equals" },
      { value: "greaterThan", label: "Greater than" },
      { value: "lessThan", label: "Less than" },
      { value: "greaterThanOrEqual", label: "Greater than or equal" },
      { value: "lessThanOrEqual", label: "Less than or equal" },
      { value: "between", label: "Between" },
    ],
    date: [
      { value: "equals", label: "Equals" },
      { value: "before", label: "Before" },
      { value: "after", label: "After" },
      { value: "between", label: "Between" },
      { value: "lastDays", label: "Last N days" },
    ],
    boolean: [
      { value: "equals", label: "Equals" },
      { value: "notEquals", label: "Not equals" },
    ],
  }

  const addRule = (groupId: string) => {
    setFilterGroups(
      filterGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              rules: [...group.rules, { id: `rule-${Date.now()}`, field: "", operator: "", value: "" }],
            }
          : group,
      ),
    )
  }

  const removeRule = (groupId: string, ruleId: string) => {
    setFilterGroups(
      filterGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              rules: group.rules.filter((rule) => rule.id !== ruleId),
            }
          : group,
      ),
    )
  }

  const updateRule = (groupId: string, ruleId: string, updates: Partial<FilterRule>) => {
    setFilterGroups(
      filterGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              rules: group.rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)),
            }
          : group,
      ),
    )
  }

  const addGroup = () => {
    setFilterGroups([
      ...filterGroups,
      {
        id: `group-${Date.now()}`,
        rules: [{ id: `rule-${Date.now()}`, field: "", operator: "", value: "" }],
        logicalOperator: "AND",
      },
    ])
  }

  const removeGroup = (groupId: string) => {
    if (filterGroups.length > 1) {
      setFilterGroups(filterGroups.filter((group) => group.id !== groupId))
    }
  }

  const updateGroupOperator = (groupId: string, operator: "AND" | "OR") => {
    setFilterGroups(
      filterGroups.map((group) => (group.id === groupId ? { ...group, logicalOperator: operator } : group)),
    )
  }

  const applyFilters = () => {
    onFiltersChange(filterGroups)
    // Simulate filter application and preview
    setShowPreview(true)
    // In a real app, this would apply filters to actual data
    setPreviewData([
      { id: 1, name: "John Doe", score: 85, department: "Computer Engineering" },
      { id: 2, name: "Jane Smith", score: 92, department: "Electrical Engineering" },
    ])
  }

  const getFieldType = (fieldValue: string) => {
    const field = fields.find((f) => f.value === fieldValue)
    return field?.type || "text"
  }

  const renderValueInput = (groupId: string, rule: FilterRule) => {
    const fieldType = getFieldType(rule.field)

    if (rule.operator === "between") {
      return (
        <div className="flex gap-2">
          <Input
            placeholder="From"
            value={Array.isArray(rule.value) ? rule.value[0] : ""}
            onChange={(e) => {
              const newValue = Array.isArray(rule.value) ? [e.target.value, rule.value[1]] : [e.target.value, ""]
              updateRule(groupId, rule.id, { value: newValue })
            }}
          />
          <Input
            placeholder="To"
            value={Array.isArray(rule.value) ? rule.value[1] : ""}
            onChange={(e) => {
              const newValue = Array.isArray(rule.value) ? [rule.value[0], e.target.value] : ["", e.target.value]
              updateRule(groupId, rule.id, { value: newValue })
            }}
          />
        </div>
      )
    }

    if (fieldType === "boolean") {
      return (
        <Select value={rule.value} onValueChange={(value) => updateRule(groupId, rule.id, { value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    return (
      <Input
        placeholder="Enter value"
        type={fieldType === "number" ? "number" : fieldType === "date" ? "date" : "text"}
        value={rule.value}
        onChange={(e) => updateRule(groupId, rule.id, { value: e.target.value })}
      />
    )
  }

  const exportFilters = () => {
    const filterConfig = {
      groups: filterGroups,
      createdAt: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(filterConfig, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "filter-config.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Advanced Filter Builder
          </CardTitle>
          <CardDescription>
            Create complex filter conditions with multiple criteria and logical operators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {filterGroups.map((group, groupIndex) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-slate-200 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Group {groupIndex + 1}</Label>
                  <Select
                    value={group.logicalOperator}
                    onValueChange={(value: "AND" | "OR") => updateGroupOperator(group.id, value)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {filterGroups.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeGroup(group.id)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {group.rules.map((rule, ruleIndex) => (
                  <div key={rule.id} className="grid grid-cols-12 gap-2 items-center">
                    {ruleIndex > 0 && (
                      <div className="col-span-1 text-center">
                        <Badge variant="outline" className="text-xs">
                          {group.logicalOperator}
                        </Badge>
                      </div>
                    )}
                    <div className={ruleIndex === 0 ? "col-span-3" : "col-span-3"}>
                      <Select
                        value={rule.field}
                        onValueChange={(value) =>
                          updateRule(group.id, rule.id, { field: value, operator: "", value: "" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Select
                        value={rule.operator}
                        onValueChange={(value) => updateRule(group.id, rule.id, { operator: value, value: "" })}
                        disabled={!rule.field}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {rule.field &&
                            operators[getFieldType(rule.field) as keyof typeof operators]?.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-4">{renderValueInput(group.id, rule)}</div>
                    <div className="col-span-1">
                      {group.rules.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeRule(group.id, rule.id)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={() => addRule(group.id)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Rule
              </Button>
            </motion.div>
          ))}

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={addGroup}>
              <Plus className="w-4 h-4 mr-1" />
              Add Group
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-1" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={exportFilters}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            {onSave && (
              <Button variant="outline" onClick={() => onSave("Custom Filter", filterGroups)}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Results */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filter Preview</CardTitle>
                <CardDescription>Results matching your filter criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{previewData.length} results found</Badge>
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Results
                    </Button>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-3 font-medium">Name</th>
                          <th className="text-left p-3 font-medium">Score</th>
                          <th className="text-left p-3 font-medium">Department</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3">{item.name}</td>
                            <td className="p-3">{item.score}%</td>
                            <td className="p-3">{item.department}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
