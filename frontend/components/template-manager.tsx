"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Plus, Edit, Copy, Trash2, MoreHorizontal, FileText, Award, CreditCard, Eye } from "lucide-react"
import type { DocumentTemplate } from "@/lib/template-engine"
import { TemplateEditor } from "./template-editor"

interface TemplateManagerProps {
  institutionId: string
  userRole: string
}

export function TemplateManager({ institutionId, userRole }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | undefined>()

  useEffect(() => {
    fetchTemplates()
  }, [institutionId])

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/templates?institutionId=${institutionId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch templates")
      }
      const { templates } = await response.json()
      setTemplates(templates)
    } catch (error) {
      console.error("Error fetching templates:", error)
      toast.error("Failed to load templates")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTemplate = (templateType: "certificate" | "admission_card" | "transcript") => {
    setEditingTemplate(undefined)
    setSelectedTemplate({ template_type: templateType } as DocumentTemplate)
    setIsEditorOpen(true)
  }

  const handleEditTemplate = (template: DocumentTemplate) => {
    setEditingTemplate(template)
    setSelectedTemplate(template)
    setIsEditorOpen(true)
  }

  const handleDuplicateTemplate = async (template: DocumentTemplate) => {
    try {
      const duplicatedTemplate = {
        ...template,
        name: `${template.name} (Copy)`,
        is_default: false,
      }
      delete duplicatedTemplate.id

      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(duplicatedTemplate),
      })

      if (!response.ok) {
        throw new Error("Failed to duplicate template")
      }

      toast.success("Template duplicated successfully")
      fetchTemplates()
    } catch (error) {
      console.error("Error duplicating template:", error)
      toast.error("Failed to duplicate template")
    }
  }

  const handleDeleteTemplate = async (template: DocumentTemplate) => {
    if (template.is_default) {
      toast.error("Cannot delete default template")
      return
    }

    if (!confirm("Are you sure you want to delete this template?")) {
      return
    }

    try {
      const response = await fetch(`/api/templates/${template.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete template")
      }

      toast.success("Template deleted successfully")
      fetchTemplates()
    } catch (error) {
      console.error("Error deleting template:", error)
      toast.error("Failed to delete template")
    }
  }

  const handleSaveTemplate = (template: DocumentTemplate) => {
    setIsEditorOpen(false)
    setSelectedTemplate(null)
    setEditingTemplate(undefined)
    fetchTemplates()
  }

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case "certificate":
        return <Award className="h-5 w-5" />
      case "admission_card":
        return <CreditCard className="h-5 w-5" />
      case "transcript":
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getTemplateTypeLabel = (type: string) => {
    switch (type) {
      case "certificate":
        return "Certificate"
      case "admission_card":
        return "Admission Card"
      case "transcript":
        return "Transcript"
      default:
        return type
    }
  }

  const groupedTemplates = templates.reduce(
    (acc, template) => {
      if (!acc[template.template_type]) {
        acc[template.template_type] = []
      }
      acc[template.template_type].push(template)
      return acc
    },
    {} as Record<string, DocumentTemplate[]>,
  )

  if (isLoading) {
    return <div>Loading templates...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Document Templates</h2>
          <p className="text-slate-600">Manage and customize your institution's document templates</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleCreateTemplate("certificate")}>
              <Award className="h-4 w-4 mr-2" />
              Certificate Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateTemplate("admission_card")}>
              <CreditCard className="h-4 w-4 mr-2" />
              Admission Card Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateTemplate("transcript")}>
              <FileText className="h-4 w-4 mr-2" />
              Transcript Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {Object.entries(groupedTemplates).map(([templateType, typeTemplates]) => (
        <div key={templateType} className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            {getTemplateIcon(templateType)}
            {getTemplateTypeLabel(templateType)} Templates
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeTemplates.map((template) => (
              <Card key={template.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTemplateIcon(template.template_type)}
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {!template.is_default && (
                          <DropdownMenuItem onClick={() => handleDeleteTemplate(template)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {template.is_default && (
                    <Badge variant="secondary" className="w-fit">
                      Default
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {template.template_type === "certificate" && "Template for generating examination certificates"}
                    {template.template_type === "admission_card" && "Template for generating admission cards"}
                    {template.template_type === "transcript" && "Template for generating academic transcripts"}
                  </CardDescription>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-slate-600 mb-4">Create your first document template to get started</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleCreateTemplate("certificate")}>
                  <Award className="h-4 w-4 mr-2" />
                  Certificate Template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateTemplate("admission_card")}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Admission Card Template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateTemplate("transcript")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Transcript Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      )}

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Create Template"}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <TemplateEditor
              template={editingTemplate}
              institutionId={institutionId}
              templateType={selectedTemplate.template_type}
              onSave={handleSaveTemplate}
              onCancel={() => setIsEditorOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
