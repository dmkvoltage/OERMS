"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Save, Eye, Palette, Layout, FileText, ImageIcon, Settings, Upload, Loader2 } from "lucide-react"
import type { DocumentTemplate } from "@/lib/template-engine"

interface TemplateEditorProps {
  template?: DocumentTemplate
  institutionId: string
  templateType: "certificate" | "admission_card" | "transcript"
  onSave?: (template: DocumentTemplate) => void
  onCancel?: () => void
}

export function TemplateEditor({ template, institutionId, templateType, onSave, onCancel }: TemplateEditorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<DocumentTemplate>>({
    institution_id: institutionId,
    template_type: templateType,
    name: template?.name || `Custom ${templateType} Template`,
    layout: template?.layout || {
      pageSize: "a4",
      orientation: "portrait",
      margins: { top: 20, bottom: 20, left: 20, right: 20 },
    },
    header: template?.header || {
      showLogo: true,
      logoPosition: "left",
      institutionName: true,
      ministryHeader: true,
      customText: "",
      height: 80,
    },
    footer: template?.footer || {
      showSignatures: true,
      showDocumentNumber: true,
      showGeneratedDate: true,
      customText: "",
      height: 60,
    },
    styling: template?.styling || {
      primaryColor: "#003366",
      secondaryColor: "#0066cc",
      accentColor: "#ff6600",
      fontFamily: "helvetica",
      fontSize: {
        title: 18,
        subtitle: 14,
        body: 12,
        small: 10,
      },
    },
    content: template?.content || {
      watermark: {
        enabled: true,
        text: "OFFICIAL DOCUMENT",
        opacity: 0.1,
      },
      seal: {
        enabled: true,
        position: "bottom-right",
      },
      qrCode: {
        enabled: false,
        position: "bottom-left",
      },
    },
    branding: template?.branding || {
      motto: "",
      address: "",
      website: "",
      phone: "",
      email: "",
    },
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = template?.id ? `/api/templates/${template.id}` : "/api/templates"
      const method = template?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save template")
      }

      const { template: savedTemplate } = await response.json()

      toast.success("Template saved successfully")
      onSave?.(savedTemplate)
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Failed to save template", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = async () => {
    // Generate a preview PDF with sample data
    toast.info("Preview functionality coming soon")
  }

  const updateFormData = (section: keyof DocumentTemplate, updates: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Template Editor</h2>
          <p className="text-slate-600">Customize the {templateType.replace("_", " ")} template for your institution</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Template
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="styling">
            <Palette className="h-4 w-4 mr-2" />
            Styling
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="branding">
            <ImageIcon className="h-4 w-4 mr-2" />
            Branding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic template configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="page-size">Page Size</Label>
                  <Select
                    value={formData.layout?.pageSize || "a4"}
                    onValueChange={(value) => updateFormData("layout", { pageSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orientation">Orientation</Label>
                  <Select
                    value={formData.layout?.orientation || "portrait"}
                    onValueChange={(value) => updateFormData("layout", { orientation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Margins</CardTitle>
              <CardDescription>Set the page margins in millimeters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="margin-top">Top Margin</Label>
                  <Input
                    id="margin-top"
                    type="number"
                    value={formData.layout?.margins?.top || 20}
                    onChange={(e) =>
                      updateFormData("layout", {
                        margins: { ...formData.layout?.margins, top: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margin-bottom">Bottom Margin</Label>
                  <Input
                    id="margin-bottom"
                    type="number"
                    value={formData.layout?.margins?.bottom || 20}
                    onChange={(e) =>
                      updateFormData("layout", {
                        margins: { ...formData.layout?.margins, bottom: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margin-left">Left Margin</Label>
                  <Input
                    id="margin-left"
                    type="number"
                    value={formData.layout?.margins?.left || 20}
                    onChange={(e) =>
                      updateFormData("layout", {
                        margins: { ...formData.layout?.margins, left: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="margin-right">Right Margin</Label>
                  <Input
                    id="margin-right"
                    type="number"
                    value={formData.layout?.margins?.right || 20}
                    onChange={(e) =>
                      updateFormData("layout", {
                        margins: { ...formData.layout?.margins, right: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Header Configuration</CardTitle>
              <CardDescription>Customize the document header</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-logo"
                  checked={formData.header?.showLogo || false}
                  onCheckedChange={(checked) => updateFormData("header", { showLogo: checked })}
                />
                <Label htmlFor="show-logo">Show Institution Logo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ministry-header"
                  checked={formData.header?.ministryHeader || false}
                  onCheckedChange={(checked) => updateFormData("header", { ministryHeader: checked })}
                />
                <Label htmlFor="ministry-header">Show Ministry Header</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-header">Custom Header Text</Label>
                <Textarea
                  id="custom-header"
                  value={formData.header?.customText || ""}
                  onChange={(e) => updateFormData("header", { customText: e.target.value })}
                  placeholder="Enter custom header text"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer Configuration</CardTitle>
              <CardDescription>Customize the document footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-signatures"
                  checked={formData.footer?.showSignatures || false}
                  onCheckedChange={(checked) => updateFormData("footer", { showSignatures: checked })}
                />
                <Label htmlFor="show-signatures">Show Signature Lines</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-doc-number"
                  checked={formData.footer?.showDocumentNumber || false}
                  onCheckedChange={(checked) => updateFormData("footer", { showDocumentNumber: checked })}
                />
                <Label htmlFor="show-doc-number">Show Document Number</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-footer">Custom Footer Text</Label>
                <Textarea
                  id="custom-footer"
                  value={formData.footer?.customText || ""}
                  onChange={(e) => updateFormData("footer", { customText: e.target.value })}
                  placeholder="Enter custom footer text"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="styling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>Customize the document colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={formData.styling?.primaryColor || "#003366"}
                      onChange={(e) => updateFormData("styling", { primaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.styling?.primaryColor || "#003366"}
                      onChange={(e) => updateFormData("styling", { primaryColor: e.target.value })}
                      placeholder="#003366"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={formData.styling?.secondaryColor || "#0066cc"}
                      onChange={(e) => updateFormData("styling", { secondaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.styling?.secondaryColor || "#0066cc"}
                      onChange={(e) => updateFormData("styling", { secondaryColor: e.target.value })}
                      placeholder="#0066cc"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={formData.styling?.accentColor || "#ff6600"}
                      onChange={(e) => updateFormData("styling", { accentColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.styling?.accentColor || "#ff6600"}
                      onChange={(e) => updateFormData("styling", { accentColor: e.target.value })}
                      placeholder="#ff6600"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Customize fonts and sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select
                  value={formData.styling?.fontFamily || "helvetica"}
                  onValueChange={(value) => updateFormData("styling", { fontFamily: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helvetica">Helvetica</SelectItem>
                    <SelectItem value="times">Times</SelectItem>
                    <SelectItem value="courier">Courier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title-size">Title Font Size</Label>
                  <Input
                    id="title-size"
                    type="number"
                    value={formData.styling?.fontSize?.title || 18}
                    onChange={(e) =>
                      updateFormData("styling", {
                        fontSize: { ...formData.styling?.fontSize, title: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle-size">Subtitle Font Size</Label>
                  <Input
                    id="subtitle-size"
                    type="number"
                    value={formData.styling?.fontSize?.subtitle || 14}
                    onChange={(e) =>
                      updateFormData("styling", {
                        fontSize: { ...formData.styling?.fontSize, subtitle: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body-size">Body Font Size</Label>
                  <Input
                    id="body-size"
                    type="number"
                    value={formData.styling?.fontSize?.body || 12}
                    onChange={(e) =>
                      updateFormData("styling", {
                        fontSize: { ...formData.styling?.fontSize, body: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="small-size">Small Font Size</Label>
                  <Input
                    id="small-size"
                    type="number"
                    value={formData.styling?.fontSize?.small || 10}
                    onChange={(e) =>
                      updateFormData("styling", {
                        fontSize: { ...formData.styling?.fontSize, small: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Watermark Settings</CardTitle>
              <CardDescription>Configure document watermark</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="watermark-enabled"
                  checked={formData.content?.watermark?.enabled || false}
                  onCheckedChange={(checked) =>
                    updateFormData("content", {
                      watermark: { ...formData.content?.watermark, enabled: checked },
                    })
                  }
                />
                <Label htmlFor="watermark-enabled">Enable Watermark</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="watermark-text">Watermark Text</Label>
                <Input
                  id="watermark-text"
                  value={formData.content?.watermark?.text || "OFFICIAL DOCUMENT"}
                  onChange={(e) =>
                    updateFormData("content", {
                      watermark: { ...formData.content?.watermark, text: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="watermark-opacity">Opacity</Label>
                <Input
                  id="watermark-opacity"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.content?.watermark?.opacity || 0.1}
                  onChange={(e) =>
                    updateFormData("content", {
                      watermark: { ...formData.content?.watermark, opacity: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Features</CardTitle>
              <CardDescription>Configure security elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="seal-enabled"
                  checked={formData.content?.seal?.enabled || false}
                  onCheckedChange={(checked) =>
                    updateFormData("content", {
                      seal: { ...formData.content?.seal, enabled: checked },
                    })
                  }
                />
                <Label htmlFor="seal-enabled">Show Official Seal</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seal-position">Seal Position</Label>
                <Select
                  value={formData.content?.seal?.position || "bottom-right"}
                  onValueChange={(value) =>
                    updateFormData("content", {
                      seal: { ...formData.content?.seal, position: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Switch
                  id="qr-enabled"
                  checked={formData.content?.qrCode?.enabled || false}
                  onCheckedChange={(checked) =>
                    updateFormData("content", {
                      qrCode: { ...formData.content?.qrCode, enabled: checked },
                    })
                  }
                />
                <Label htmlFor="qr-enabled">Include QR Code</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qr-position">QR Code Position</Label>
                <Select
                  value={formData.content?.qrCode?.position || "bottom-left"}
                  onValueChange={(value) =>
                    updateFormData("content", {
                      qrCode: { ...formData.content?.qrCode, position: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Institution Branding</CardTitle>
              <CardDescription>Customize institution-specific information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="motto">Institution Motto</Label>
                <Input
                  id="motto"
                  value={formData.branding?.motto || ""}
                  onChange={(e) => updateFormData("branding", { motto: e.target.value })}
                  placeholder="Enter institution motto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.branding?.address || ""}
                  onChange={(e) => updateFormData("branding", { address: e.target.value })}
                  placeholder="Enter institution address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.branding?.website || ""}
                    onChange={(e) => updateFormData("branding", { website: e.target.value })}
                    placeholder="www.institution.edu.cm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.branding?.phone || ""}
                    onChange={(e) => updateFormData("branding", { phone: e.target.value })}
                    placeholder="+237 XXX XXX XXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.branding?.email || ""}
                  onChange={(e) => updateFormData("branding", { email: e.target.value })}
                  placeholder="contact@institution.edu.cm"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="logo-upload">Institution Logo</Label>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  {formData.branding?.logo && (
                    <div className="flex items-center gap-2">
                      <img
                        src={formData.branding.logo || "/placeholder.svg"}
                        alt="Logo preview"
                        className="h-8 w-8 object-contain"
                      />
                      <Button variant="ghost" size="sm" onClick={() => updateFormData("branding", { logo: null })}>
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500">Upload a PNG or JPG logo. Recommended size: 200x200px</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
