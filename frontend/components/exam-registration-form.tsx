"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "./file-upload"
import { useRegistrations } from "@/hooks/use-api"
import { toast } from "sonner"

const registrationSchema = z.object({
  examId: z.string().min(1, "Please select an exam"),
  studentId: z.string().min(1, "Student ID is required"),
  subjects: z.array(z.string()).min(1, "Please select at least one subject"),
  center: z.string().min(1, "Please select an exam center"),
  specialNeeds: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    phone: z.string().min(1, "Emergency contact phone is required"),
    relationship: z.string().min(1, "Relationship is required"),
  }),
  documents: z.array(z.string()).min(1, "Please upload required documents"),
})

type RegistrationFormData = z.infer<typeof registrationSchema>

interface ExamRegistrationFormProps {
  examId?: string
  onSuccess?: () => void
}

export function ExamRegistrationForm({ examId, onSuccess }: ExamRegistrationFormProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([])
  const { createRegistration } = useRegistrations()

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      examId: examId || "",
      studentId: "",
      subjects: [],
      center: "",
      specialNeeds: "",
      emergencyContact: {
        name: "",
        phone: "",
        relationship: "",
      },
      documents: [],
    },
  })

  const availableSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "French",
    "English",
    "Philosophy",
    "History",
    "Geography",
    "Economics",
    "Computer Science",
  ]

  const examCenters = [
    "Centre d'Examen Yaoundé",
    "Centre d'Examen Douala",
    "Centre d'Examen Bafoussam",
    "Centre d'Examen Bamenda",
    "Centre d'Examen Garoua",
    "Centre d'Examen Maroua",
    "Centre d'Examen Ngaoundéré",
    "Centre d'Examen Bertoua",
    "Centre d'Examen Ebolowa",
    "Centre d'Examen Kribi",
  ]

  const handleFileUpload = async (files: File[]) => {
    // Simulate file upload - in real app, upload to server/cloud storage
    const documentUrls = files.map((file) => URL.createObjectURL(file))
    setUploadedDocuments((prev) => [...prev, ...documentUrls])
    form.setValue("documents", [...uploadedDocuments, ...documentUrls])
  }

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      await createRegistration(data)
      toast.success("Registration submitted successfully!")
      form.reset()
      setUploadedDocuments([])
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to submit registration. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Exam Registration</CardTitle>
        <CardDescription>
          Complete this form to register for the examination. All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="examId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Examination *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select examination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Baccalauréat A4 2024</SelectItem>
                        <SelectItem value="2">BEPC 2024</SelectItem>
                        <SelectItem value="3">GCE Advanced Level 2024</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your student ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subject Selection */}
            <FormField
              control={form.control}
              name="subjects"
              render={() => (
                <FormItem>
                  <FormLabel>Subjects *</FormLabel>
                  <FormDescription>Select the subjects you want to register for</FormDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableSubjects.map((subject) => (
                      <FormField
                        key={subject}
                        control={form.control}
                        name="subjects"
                        render={({ field }) => {
                          return (
                            <FormItem key={subject} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(subject)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, subject])
                                      : field.onChange(field.value?.filter((value) => value !== subject))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">{subject}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Exam Center */}
            <FormField
              control={form.control}
              name="center"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Exam Center *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam center" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {examCenters.map((center) => (
                        <SelectItem key={center} value={center}>
                          {center}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Special Needs */}
            <FormField
              control={form.control}
              name="specialNeeds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Needs/Accommodations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe any special accommodations needed (e.g., extra time, large print, etc.)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please describe any special accommodations you may need during the examination
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Emergency Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContact.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+237 6XX XXX XXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact.relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="relative">Relative</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Required Documents</h3>
              <p className="text-sm text-muted-foreground">
                Please upload the following documents: Birth Certificate, School Transcript, Passport Photo, and any
                other relevant documents.
              </p>
              <FileUpload onUpload={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" maxSize={5} maxFiles={10} />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset Form
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
