"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X, FileText, ImageIcon, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  maxFiles?: number
  className?: string
}

interface UploadedFile {
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  url?: string
  error?: string
}

export function FileUpload({
  onUpload,
  accept = "*/*",
  multiple = true,
  maxSize = 10,
  maxFiles = 5,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type.includes("pdf") || file.type.includes("document")) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    return null
  }

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles = Array.from(fileList)

      if (files.length + newFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`)
        return
      }

      const validFiles: File[] = []
      const uploadedFiles: UploadedFile[] = []

      for (const file of newFiles) {
        const error = validateFile(file)
        if (error) {
          uploadedFiles.push({
            file,
            progress: 0,
            status: "error",
            error,
          })
        } else {
          validFiles.push(file)
          uploadedFiles.push({
            file,
            progress: 0,
            status: "uploading",
          })
        }
      }

      setFiles((prev) => [...prev, ...uploadedFiles])

      // Simulate upload progress for valid files
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        const fileIndex = files.length + i

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          setFiles((prev) => prev.map((f, index) => (index === fileIndex ? { ...f, progress } : f)))
        }

        // Mark as completed
        setFiles((prev) =>
          prev.map((f, index) =>
            index === fileIndex
              ? {
                  ...f,
                  status: "completed",
                  url: URL.createObjectURL(file),
                }
              : f,
          ),
        )
      }

      if (validFiles.length > 0) {
        try {
          await onUpload(validFiles)
        } catch (error) {
          console.error("Upload failed:", error)
        }
      }
    },
    [files.length, maxFiles, onUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles)
      }
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          "hover:border-primary hover:bg-primary/5",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium">Drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Maximum {maxFiles} files, up to {maxSize}MB each
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {files.map((uploadedFile, index) => {
            const Icon = getFileIcon(uploadedFile.file)
            return (
              <Card key={index} className="p-3">
                <div className="flex items-center space-x-3">
                  <Icon className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{uploadedFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.file.size)}</p>
                    {uploadedFile.status === "uploading" && <Progress value={uploadedFile.progress} className="mt-1" />}
                    {uploadedFile.status === "error" && (
                      <p className="text-xs text-destructive mt-1">{uploadedFile.error}</p>
                    )}
                    {uploadedFile.status === "completed" && (
                      <p className="text-xs text-green-600 mt-1">Upload completed</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
