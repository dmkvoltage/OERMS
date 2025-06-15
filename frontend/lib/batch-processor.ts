import JSZip from "jszip"
import { generateCertificate, generateAdmissionCard, generateTranscript } from "./pdf-generator"
import type { CertificateData, AdmissionCardData, TranscriptData } from "./pdf-generator"

type BatchResult = {
  zipBlob: Blob | null
  successCount: number
  failureCount: number
  errors: Array<{ id: string; error: string }>
}

type ProgressCallback = (progress: {
  total: number
  processed: number
  successful: number
  failed: number
}) => void

export class BatchProcessor {
  /**
   * Process multiple certificates in batch and return a ZIP file
   */
  static async processCertificates(
    data: CertificateData[],
    onProgress?: ProgressCallback,
    batchSize = 10,
  ): Promise<BatchResult> {
    const zip = new JSZip()
    let successCount = 0
    let failureCount = 0
    const errors: Array<{ id: string; error: string }> = []
    const total = data.length

    // Process in batches to avoid memory issues
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)

      // Process batch concurrently
      const results = await Promise.allSettled(
        batch.map(async (item) => {
          try {
            const pdfBlob = await generateCertificate(item)
            const sanitizedName = item.studentName.replace(/[^a-z0-9]/gi, "_").toLowerCase()
            const fileName = `certificate_${sanitizedName}_${item.examCode}.pdf`
            return { fileName, pdfBlob }
          } catch (error) {
            throw { id: item.studentId, error: (error as Error).message }
          }
        }),
      )

      // Process results
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          zip.file(result.value.fileName, result.value.pdfBlob)
          successCount++
        } else {
          failureCount++
          errors.push(result.reason)
        }
      })

      // Report progress
      if (onProgress) {
        onProgress({
          total,
          processed: i + batch.length,
          successful: successCount,
          failed: failureCount,
        })
      }
    }

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" })

    return {
      zipBlob,
      successCount,
      failureCount,
      errors,
    }
  }

  /**
   * Process multiple admission cards in batch and return a ZIP file
   */
  static async processAdmissionCards(
    data: AdmissionCardData[],
    onProgress?: ProgressCallback,
    batchSize = 10,
  ): Promise<BatchResult> {
    const zip = new JSZip()
    let successCount = 0
    let failureCount = 0
    const errors: Array<{ id: string; error: string }> = []
    const total = data.length

    // Process in batches to avoid memory issues
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)

      // Process batch concurrently
      const results = await Promise.allSettled(
        batch.map(async (item) => {
          try {
            const pdfBlob = await generateAdmissionCard(item)
            const sanitizedName = item.studentName.replace(/[^a-z0-9]/gi, "_").toLowerCase()
            const fileName = `admission_card_${sanitizedName}_${item.examCode}.pdf`
            return { fileName, pdfBlob }
          } catch (error) {
            throw { id: item.studentId, error: (error as Error).message }
          }
        }),
      )

      // Process results
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          zip.file(result.value.fileName, result.value.pdfBlob)
          successCount++
        } else {
          failureCount++
          errors.push(result.reason)
        }
      })

      // Report progress
      if (onProgress) {
        onProgress({
          total,
          processed: i + batch.length,
          successful: successCount,
          failed: failureCount,
        })
      }
    }

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" })

    return {
      zipBlob,
      successCount,
      failureCount,
      errors,
    }
  }

  /**
   * Process multiple transcripts in batch and return a ZIP file
   */
  static async processTranscripts(
    data: TranscriptData[],
    onProgress?: ProgressCallback,
    batchSize = 10,
  ): Promise<BatchResult> {
    const zip = new JSZip()
    let successCount = 0
    let failureCount = 0
    const errors: Array<{ id: string; error: string }> = []
    const total = data.length

    // Process in batches to avoid memory issues
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)

      // Process batch concurrently
      const results = await Promise.allSettled(
        batch.map(async (item) => {
          try {
            const pdfBlob = await generateTranscript(item)
            const sanitizedName = item.studentName.replace(/[^a-z0-9]/gi, "_").toLowerCase()
            const fileName = `transcript_${sanitizedName}_${item.studentId}.pdf`
            return { fileName, pdfBlob }
          } catch (error) {
            throw { id: item.studentId, error: (error as Error).message }
          }
        }),
      )

      // Process results
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          zip.file(result.value.fileName, result.value.pdfBlob)
          successCount++
        } else {
          failureCount++
          errors.push(result.reason)
        }
      })

      // Report progress
      if (onProgress) {
        onProgress({
          total,
          processed: i + batch.length,
          successful: successCount,
          failed: failureCount,
        })
      }
    }

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" })

    return {
      zipBlob,
      successCount,
      failureCount,
      errors,
    }
  }
}
