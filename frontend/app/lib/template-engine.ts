import jsPDF from "jspdf"
import type { CertificateData, AdmissionCardData, TranscriptData } from "./pdf-generator"

export interface DocumentTemplate {
  id: string
  institution_id: string
  template_type: "certificate" | "admission_card" | "transcript"
  name: string
  is_default: boolean
  layout: {
    pageSize: "a4" | "letter"
    orientation: "portrait" | "landscape"
    margins: {
      top: number
      bottom: number
      left: number
      right: number
    }
  }
  header: {
    showLogo: boolean
    logoPosition: "left" | "center" | "right"
    institutionName: boolean
    ministryHeader: boolean
    customText: string
    height: number
  }
  footer: {
    showSignatures: boolean
    showDocumentNumber: boolean
    showGeneratedDate: boolean
    customText: string
    height: number
  }
  styling: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
    fontSize: {
      title: number
      subtitle: number
      body: number
      small: number
    }
  }
  content: {
    watermark: {
      enabled: boolean
      text: string
      opacity: number
    }
    seal: {
      enabled: boolean
      position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
    }
    qrCode: {
      enabled: boolean
      position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
    }
  }
  branding: {
    logo?: string
    motto: string
    address: string
    website: string
    phone: string
    email: string
  }
}

export class TemplateEngine {
  private static hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
      : [0, 0, 0]
  }

  private static addCustomWatermark(doc: jsPDF, template: DocumentTemplate) {
    if (!template.content.watermark.enabled) return

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    doc.saveGraphicsState()
    doc.setGState(new doc.GState({ opacity: template.content.watermark.opacity }))

    const [r, g, b] = this.hexToRgb(template.styling.primaryColor)
    doc.setTextColor(r, g, b)
    doc.setFontSize(50)

    doc.text(template.content.watermark.text, pageWidth / 2, pageHeight / 2, {
      angle: 45,
      align: "center",
    })
    doc.restoreGraphicsState()
  }

  private static addCustomHeader(doc: jsPDF, template: DocumentTemplate, title: string): number {
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPos = template.layout.margins.top

    // Add logo if enabled
    if (template.header.showLogo && template.branding.logo) {
      const logoSize = 30
      let logoX = template.layout.margins.left

      if (template.header.logoPosition === "center") {
        logoX = (pageWidth - logoSize) / 2
      } else if (template.header.logoPosition === "right") {
        logoX = pageWidth - template.layout.margins.right - logoSize
      }

      try {
        doc.addImage(template.branding.logo, "PNG", logoX, yPos, logoSize, logoSize)
      } catch (error) {
        console.warn("Failed to add logo:", error)
      }
    }

    // Ministry header
    if (template.header.ministryHeader) {
      doc.setFontSize(template.styling.fontSize.subtitle)
      doc.setFont(template.styling.fontFamily, "bold")

      const [r, g, b] = this.hexToRgb(template.styling.primaryColor)
      doc.setTextColor(r, g, b)

      doc.text("REPUBLIC OF CAMEROON", pageWidth / 2, yPos + 15, { align: "center" })
      doc.text("Peace - Work - Fatherland", pageWidth / 2, yPos + 23, { align: "center" })
      yPos += 30
    }

    // Institution name
    if (template.header.institutionName) {
      doc.setFontSize(template.styling.fontSize.body)
      doc.text("MINISTRY OF SECONDARY EDUCATION", pageWidth / 2, yPos + 8, { align: "center" })
      yPos += 15
    }

    // Custom header text
    if (template.header.customText) {
      doc.setFontSize(template.styling.fontSize.body)
      doc.setTextColor(0, 0, 0)
      const lines = doc.splitTextToSize(template.header.customText, pageWidth - 2 * template.layout.margins.left)
      doc.text(lines, pageWidth / 2, yPos + 8, { align: "center" })
      yPos += lines.length * 5 + 10
    }

    // Title
    doc.setFontSize(template.styling.fontSize.title)
    doc.setFont(template.styling.fontFamily, "bold")
    doc.setTextColor(0, 0, 0)
    doc.text(title, pageWidth / 2, yPos + 15, { align: "center" })

    // Line separator
    const [r, g, b] = this.hexToRgb(template.styling.secondaryColor)
    doc.setDrawColor(r, g, b)
    doc.setLineWidth(0.5)
    doc.line(template.layout.margins.left, yPos + 25, pageWidth - template.layout.margins.right, yPos + 25)

    return yPos + 35
  }

  private static addCustomFooter(doc: jsPDF, template: DocumentTemplate, documentNumber: string) {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const footerY = pageHeight - template.layout.margins.bottom

    doc.setFontSize(template.styling.fontSize.small)
    doc.setTextColor(128, 128, 128)

    if (template.footer.showDocumentNumber) {
      doc.text(`Document No: ${documentNumber}`, template.layout.margins.left, footerY - 15)
    }

    if (template.footer.showGeneratedDate) {
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        pageWidth - template.layout.margins.right,
        footerY - 15,
        { align: "right" },
      )
    }

    if (template.footer.customText) {
      doc.text(template.footer.customText, pageWidth / 2, footerY - 5, { align: "center" })
    }

    // Institution contact info
    if (template.branding.website || template.branding.email || template.branding.phone) {
      doc.setFontSize(template.styling.fontSize.small - 1)
      let contactText = ""
      if (template.branding.website) contactText += `Web: ${template.branding.website} | `
      if (template.branding.email) contactText += `Email: ${template.branding.email} | `
      if (template.branding.phone) contactText += `Tel: ${template.branding.phone}`

      contactText = contactText.replace(/ \| $/, "") // Remove trailing separator
      doc.text(contactText, pageWidth / 2, footerY, { align: "center" })
    }
  }

  static async generateCertificateWithTemplate(data: CertificateData, template: DocumentTemplate): Promise<Blob> {
    const doc = new jsPDF(template.layout.orientation, "mm", template.layout.pageSize)
    const pageWidth = doc.internal.pageSize.getWidth()

    // Add watermark
    this.addCustomWatermark(doc, template)

    // Add header
    let yPos = this.addCustomHeader(doc, template, "CERTIFICATE OF ACHIEVEMENT")

    yPos += 20

    // Certificate content with custom styling
    doc.setFontSize(template.styling.fontSize.body)
    doc.setFont(template.styling.fontFamily, "normal")
    doc.text("This is to certify that", pageWidth / 2, yPos, { align: "center" })

    yPos += 15
    doc.setFontSize(template.styling.fontSize.title + 2)
    doc.setFont(template.styling.fontFamily, "bold")

    const [r, g, b] = this.hexToRgb(template.styling.primaryColor)
    doc.setTextColor(r, g, b)
    doc.text(data.studentName.toUpperCase(), pageWidth / 2, yPos, { align: "center" })

    yPos += 15
    doc.setFontSize(template.styling.fontSize.body)
    doc.setFont(template.styling.fontFamily, "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(`Student ID: ${data.studentId}`, pageWidth / 2, yPos, { align: "center" })

    yPos += 20
    doc.setFontSize(template.styling.fontSize.body)
    doc.text("has successfully completed the", pageWidth / 2, yPos, { align: "center" })

    yPos += 15
    doc.setFontSize(template.styling.fontSize.title)
    doc.setFont(template.styling.fontFamily, "bold")
    doc.text(data.examName, pageWidth / 2, yPos, { align: "center" })

    yPos += 10
    doc.setFontSize(template.styling.fontSize.body)
    doc.setFont(template.styling.fontFamily, "normal")
    doc.text(`(${data.examCode})`, pageWidth / 2, yPos, { align: "center" })

    yPos += 20
    doc.text(`Examination held on: ${data.examDate}`, pageWidth / 2, yPos, { align: "center" })

    yPos += 15
    doc.text(`Institution: ${data.institution}`, pageWidth / 2, yPos, { align: "center" })

    // Grade box with custom colors
    yPos += 25
    const gradeBoxWidth = 60
    const gradeBoxHeight = 30
    const gradeBoxX = (pageWidth - gradeBoxWidth) / 2

    const [bgR, bgG, bgB] = this.hexToRgb(template.styling.secondaryColor + "20") // Add transparency
    doc.setFillColor(240, 248, 255)
    doc.rect(gradeBoxX, yPos, gradeBoxWidth, gradeBoxHeight, "F")

    const [borderR, borderG, borderB] = this.hexToRgb(template.styling.primaryColor)
    doc.setDrawColor(borderR, borderG, borderB)
    doc.setLineWidth(1)
    doc.rect(gradeBoxX, yPos, gradeBoxWidth, gradeBoxHeight)

    doc.setFontSize(template.styling.fontSize.subtitle)
    doc.setFont(template.styling.fontFamily, "bold")
    doc.text("GRADE ACHIEVED", pageWidth / 2, yPos + 10, { align: "center" })

    doc.setFontSize(24)
    const [accentR, accentG, accentB] = this.hexToRgb(template.styling.accentColor)
    doc.setTextColor(accentR, accentG, accentB)
    doc.text(data.grade, pageWidth / 2, yPos + 22, { align: "center" })

    yPos += 40
    doc.setFontSize(template.styling.fontSize.body)
    doc.setTextColor(0, 0, 0)
    doc.text(`Score: ${data.score}%`, pageWidth / 2, yPos, { align: "center" })

    // Signature section
    if (template.footer.showSignatures) {
      yPos += 30
      doc.setFontSize(template.styling.fontSize.small)
      doc.text("_________________________", template.layout.margins.left + 20, yPos)
      doc.text("_________________________", pageWidth - template.layout.margins.right - 60, yPos)

      yPos += 8
      doc.text("Director of Examinations", template.layout.margins.left + 20, yPos)
      doc.text("Minister of Education", pageWidth - template.layout.margins.right - 60, yPos)

      yPos += 3
      doc.text("Date: _______________", template.layout.margins.left + 20, yPos)
      doc.text("Date: _______________", pageWidth - template.layout.margins.right - 60, yPos)
    }

    // Add footer
    this.addCustomFooter(doc, template, data.certificateNumber)

    return doc.output("blob")
  }

  static async generateAdmissionCardWithTemplate(data: AdmissionCardData, template: DocumentTemplate): Promise<Blob> {
    const doc = new jsPDF(template.layout.orientation, "mm", template.layout.pageSize)
    const pageWidth = doc.internal.pageSize.getWidth()

    // Add watermark
    this.addCustomWatermark(doc, template)

    // Add header
    let yPos = this.addCustomHeader(doc, template, "EXAMINATION ADMISSION CARD")

    yPos += 10

    // Student photo placeholder
    if (data.photo) {
      doc.addImage(data.photo, "JPEG", pageWidth - 50, yPos, 30, 40)
    } else {
      doc.setFillColor(240, 240, 240)
      doc.rect(pageWidth - 50, yPos, 30, 40, "F")
      doc.setFontSize(template.styling.fontSize.small)
      doc.text("STUDENT", pageWidth - 35, yPos + 18, { align: "center" })
      doc.text("PHOTO", pageWidth - 35, yPos + 25, { align: "center" })
    }

    // Student information with custom styling
    doc.setFontSize(template.styling.fontSize.body)
    doc.setFont(template.styling.fontFamily, "bold")

    const [r, g, b] = this.hexToRgb(template.styling.primaryColor)
    doc.setTextColor(r, g, b)
    doc.text("STUDENT INFORMATION", template.layout.margins.left, yPos)

    yPos += 10
    doc.setFont(template.styling.fontFamily, "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(`Name: ${data.studentName}`, template.layout.margins.left, yPos)

    yPos += 8
    doc.text(`Student ID: ${data.studentId}`, template.layout.margins.left, yPos)

    yPos += 15
    doc.setFont(template.styling.fontFamily, "bold")
    doc.setTextColor(r, g, b)
    doc.text("EXAMINATION DETAILS", template.layout.margins.left, yPos)

    yPos += 10
    doc.setFont(template.styling.fontFamily, "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(`Examination: ${data.examName}`, template.layout.margins.left, yPos)

    yPos += 8
    doc.text(`Code: ${data.examCode}`, template.layout.margins.left, yPos)

    yPos += 8
    doc.text(`Date: ${data.examDate}`, template.layout.margins.left, yPos)

    yPos += 8
    doc.text(`Time: ${data.examTime}`, template.layout.margins.left, yPos)

    yPos += 15
    doc.setFont(template.styling.fontFamily, "bold")
    doc.setTextColor(r, g, b)
    doc.text("EXAMINATION CENTER", template.layout.margins.left, yPos)

    yPos += 10
    doc.setFont(template.styling.fontFamily, "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(`Center: ${data.examCenter}`, template.layout.margins.left, yPos)

    yPos += 8
    const addressLines = doc.splitTextToSize(data.centerAddress, pageWidth - 2 * template.layout.margins.left)
    doc.text(addressLines, template.layout.margins.left, yPos)
    yPos += addressLines.length * 5

    // Subjects
    yPos += 10
    doc.setFont(template.styling.fontFamily, "bold")
    doc.setTextColor(r, g, b)
    doc.text("SUBJECTS TO BE EXAMINED", template.layout.margins.left, yPos)

    yPos += 8
    doc.setFont(template.styling.fontFamily, "normal")
    doc.setTextColor(0, 0, 0)
    data.subjects.forEach((subject, index) => {
      doc.text(`${index + 1}. ${subject}`, template.layout.margins.left + 5, yPos)
      yPos += 6
    })

    // Instructions
    yPos += 10
    doc.setFont(template.styling.fontFamily, "bold")
    doc.setTextColor(r, g, b)
    doc.text("IMPORTANT INSTRUCTIONS", template.layout.margins.left, yPos)

    yPos += 8
    doc.setFont(template.styling.fontFamily, "normal")
    doc.setFontSize(template.styling.fontSize.small)
    doc.setTextColor(0, 0, 0)
    data.instructions.forEach((instruction, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${instruction}`, pageWidth - 2 * template.layout.margins.left)
      doc.text(lines, template.layout.margins.left + 5, yPos)
      yPos += lines.length * 4 + 2
    })

    // Warning box with custom colors
    yPos += 10
    const [warningR, warningG, warningB] = this.hexToRgb(template.styling.accentColor + "20")
    doc.setFillColor(255, 245, 245)
    doc.rect(template.layout.margins.left, yPos, pageWidth - 2 * template.layout.margins.left, 25, "F")

    doc.setLineWidth(0.5)
    const [borderR, borderG, borderB] = this.hexToRgb(template.styling.accentColor)
    doc.setDrawColor(borderR, borderG, borderB)
    doc.rect(template.layout.margins.left, yPos, pageWidth - 2 * template.layout.margins.left, 25)

    doc.setFontSize(template.styling.fontSize.small)
    doc.setFont(template.styling.fontFamily, "bold")
    doc.setTextColor(borderR, borderG, borderB)
    doc.text("WARNING:", template.layout.margins.left + 5, yPos + 8)

    doc.setFont(template.styling.fontFamily, "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(
      "This admission card must be presented at the examination center.",
      template.layout.margins.left + 5,
      yPos + 15,
    )
    doc.text(
      "No candidate will be admitted without this card and valid ID.",
      template.layout.margins.left + 5,
      yPos + 20,
    )

    // Add footer
    this.addCustomFooter(doc, template, `AC-${data.studentId}-${data.examCode}`)

    return doc.output("blob")
  }

  static async generateTranscriptWithTemplate(data: TranscriptData, template: DocumentTemplate): Promise<Blob> {
    const doc = new jsPDF(template.layout.orientation, "mm", template.layout.pageSize)
    const pageWidth = doc.internal.pageSize.getWidth()

    // Add watermark
    this.addCustomWatermark(doc, template)

    // Add header
    let yPos = this.addCustomHeader(doc, template, "ACADEMIC TRANSCRIPT")

    yPos += 10

    // Student information with custom styling
    doc.setFontSize(template.styling.fontSize.body)
    doc.setFont(template.styling.fontFamily, "bold")

    const [r, g, b] = this.hexToRgb(template.styling.primaryColor)
    doc.setTextColor(r, g, b)
    doc.text("STUDENT INFORMATION", template.layout.margins.left, yPos)

    yPos += 10
    doc.setFont(template.styling.fontFamily, "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(`Name: ${data.studentName}`, template.layout.margins.left, yPos)
    doc.text(`Student ID: ${data.studentId}`, pageWidth - template.layout.margins.right, yPos, { align: "right" })

    yPos += 8
    doc.text(`Institution: ${data.institution}`, template.layout.margins.left, yPos)

    yPos += 8
    doc.text(`Program: ${data.program}`, template.layout.margins.left, yPos)
    doc.text(`Level: ${data.level}`, pageWidth - template.layout.margins.right, yPos, { align: "right" })

    // Results table with custom styling
    yPos += 20
    doc.setFont(template.styling.fontFamily, "bold")
    doc.setTextColor(r, g, b)
    doc.text("EXAMINATION RESULTS", template.layout.margins.left, yPos)

    yPos += 10

    // Table headers with custom colors
    const tableHeaders = ["Examination", "Code", "Date", "Score", "Grade", "Credits"]
    const colWidths = [50, 25, 25, 20, 20, 20]
    let xPos = template.layout.margins.left

    const [headerR, headerG, headerB] = this.hexToRgb(template.styling.secondaryColor + "40")
    doc.setFillColor(240, 240, 240)
    doc.rect(template.layout.margins.left, yPos - 5, pageWidth - 2 * template.layout.margins.left, 10, "F")

    doc.setFontSize(template.styling.fontSize.small)
    doc.setFont(template.styling.fontFamily, "bold")
    doc.setTextColor(0, 0, 0)
    tableHeaders.forEach((header, index) => {
      doc.text(header, xPos + 2, yPos)
      xPos += colWidths[index]
    })

    yPos += 8

    // Table rows
    doc.setFont(template.styling.fontFamily, "normal")
    data.results.forEach((result, index) => {
      if (yPos > 250) {
        // New page if needed
        doc.addPage()
        yPos = 30
      }

      xPos = template.layout.margins.left
      const rowData = [
        result.examName,
        result.examCode,
        result.date,
        `${result.score}%`,
        result.grade,
        result.credits.toString(),
      ]

      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250)
        doc.rect(template.layout.margins.left, yPos - 3, pageWidth - 2 * template.layout.margins.left, 8, "F")
      }

      rowData.forEach((data, colIndex) => {
        doc.text(data, xPos + 2, yPos)
        xPos += colWidths[colIndex]
      })

      yPos += 8
    })

    // Summary with custom styling
    yPos += 15
    doc.setFont(template.styling.fontFamily, "bold")
    doc.setTextColor(r, g, b)
    doc.text("ACADEMIC SUMMARY", template.layout.margins.left, yPos)

    yPos += 10
    doc.setFont(template.styling.fontFamily, "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(`Total Credits Earned: ${data.totalCredits}`, template.layout.margins.left, yPos)
    doc.text(`Cumulative GPA: ${data.gpa.toFixed(2)}`, pageWidth - template.layout.margins.right, yPos, {
      align: "right",
    })

    yPos += 8
    doc.text(`Date Issued: ${data.dateIssued}`, template.layout.margins.left, yPos)

    // Classification with accent color
    yPos += 15
    let classification = ""
    if (data.gpa >= 3.7) classification = "FIRST CLASS HONORS"
    else if (data.gpa >= 3.3) classification = "SECOND CLASS HONORS (UPPER DIVISION)"
    else if (data.gpa >= 2.7) classification = "SECOND CLASS HONORS (LOWER DIVISION)"
    else if (data.gpa >= 2.0) classification = "THIRD CLASS HONORS"
    else classification = "PASS"

    doc.setFontSize(template.styling.fontSize.subtitle)
    doc.setFont(template.styling.fontFamily, "bold")
    const [accentR, accentG, accentB] = this.hexToRgb(template.styling.accentColor)
    doc.setTextColor(accentR, accentG, accentB)
    doc.text(`CLASSIFICATION: ${classification}`, pageWidth / 2, yPos, { align: "center" })

    // Signature section
    if (template.footer.showSignatures) {
      yPos += 25
      doc.setFontSize(template.styling.fontSize.small)
      doc.setFont(template.styling.fontFamily, "normal")
      doc.setTextColor(0, 0, 0)
      doc.text("_________________________", template.layout.margins.left + 20, yPos)
      doc.text("_________________________", pageWidth - template.layout.margins.right - 60, yPos)

      yPos += 8
      doc.text("Registrar", template.layout.margins.left + 20, yPos)
      doc.text("Director of Examinations", pageWidth - template.layout.margins.right - 60, yPos)
    }

    // Add footer
    this.addCustomFooter(doc, template, `TR-${data.studentId}-${new Date().getFullYear()}`)

    return doc.output("blob")
  }
}
