import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export interface CertificateData {
  studentName: string
  studentId: string
  examName: string
  examCode: string
  grade: string
  score: number
  dateIssued: string
  certificateNumber: string
  institution: string
  examDate: string
}

export interface AdmissionCardData {
  studentName: string
  studentId: string
  examName: string
  examCode: string
  examDate: string
  examTime: string
  examCenter: string
  centerAddress: string
  subjects: string[]
  instructions: string[]
  photo?: string
}

export interface TranscriptData {
  studentName: string
  studentId: string
  institution: string
  program: string
  level: string
  results: Array<{
    examName: string
    examCode: string
    date: string
    score: number
    grade: string
    credits: number
  }>
  gpa: number
  totalCredits: number
  dateIssued: string
}

export class PDFGenerator {
  private static addWatermark(doc: jsPDF, text: string) {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    doc.saveGraphicsState()
    doc.setGState(new doc.GState({ opacity: 0.1 }))
    doc.setTextColor(128, 128, 128)
    doc.setFontSize(50)

    // Rotate and center the watermark
    doc.text(text, pageWidth / 2, pageHeight / 2, {
      angle: 45,
      align: "center",
    })
    doc.restoreGraphicsState()
  }

  private static addHeader(doc: jsPDF, title: string) {
    const pageWidth = doc.internal.pageSize.getWidth()

    // Ministry header
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 51, 102) // Dark blue
    doc.text("REPUBLIC OF CAMEROON", pageWidth / 2, 20, { align: "center" })
    doc.text("Peace - Work - Fatherland", pageWidth / 2, 28, { align: "center" })

    doc.setFontSize(14)
    doc.text("MINISTRY OF SECONDARY EDUCATION", pageWidth / 2, 38, { align: "center" })

    // Title
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text(title, pageWidth / 2, 55, { align: "center" })

    // Line separator
    doc.setLineWidth(0.5)
    doc.line(20, 65, pageWidth - 20, 65)

    return 75 // Return Y position for content
  }

  private static addFooter(doc: jsPDF, documentNumber: string) {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(`Document No: ${documentNumber}`, 20, pageHeight - 20)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 20, pageHeight - 20, { align: "right" })

    // Official seal placeholder
    doc.setFontSize(10)
    doc.text("OFFICIAL DOCUMENT", pageWidth - 20, pageHeight - 10, { align: "right" })
  }

  static async generateCertificate(data: CertificateData): Promise<Blob> {
    const doc = new jsPDF("portrait", "mm", "a4")
    const pageWidth = doc.internal.pageSize.getWidth()

    // Add watermark
    this.addWatermark(doc, "OFFICIAL CERTIFICATE")

    // Add header
    let yPos = this.addHeader(doc, "CERTIFICATE OF ACHIEVEMENT")

    yPos += 20

    // Certificate content
    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.text("This is to certify that", pageWidth / 2, yPos, { align: "center" })

    yPos += 15
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 51, 102)
    doc.text(data.studentName.toUpperCase(), pageWidth / 2, yPos, { align: "center" })

    yPos += 15
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(`Student ID: ${data.studentId}`, pageWidth / 2, yPos, { align: "center" })

    yPos += 20
    doc.setFontSize(14)
    doc.text("has successfully completed the", pageWidth / 2, yPos, { align: "center" })

    yPos += 15
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(data.examName, pageWidth / 2, yPos, { align: "center" })

    yPos += 10
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`(${data.examCode})`, pageWidth / 2, yPos, { align: "center" })

    yPos += 20
    doc.text(`Examination held on: ${data.examDate}`, pageWidth / 2, yPos, { align: "center" })

    yPos += 15
    doc.text(`Institution: ${data.institution}`, pageWidth / 2, yPos, { align: "center" })

    // Grade box
    yPos += 25
    const gradeBoxWidth = 60
    const gradeBoxHeight = 30
    const gradeBoxX = (pageWidth - gradeBoxWidth) / 2

    doc.setFillColor(240, 248, 255)
    doc.rect(gradeBoxX, yPos, gradeBoxWidth, gradeBoxHeight, "F")
    doc.setLineWidth(1)
    doc.rect(gradeBoxX, yPos, gradeBoxWidth, gradeBoxHeight)

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("GRADE ACHIEVED", pageWidth / 2, yPos + 10, { align: "center" })
    doc.setFontSize(24)
    doc.setTextColor(0, 128, 0)
    doc.text(data.grade, pageWidth / 2, yPos + 22, { align: "center" })

    yPos += 40
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Score: ${data.score}%`, pageWidth / 2, yPos, { align: "center" })

    // Signature section
    yPos += 30
    doc.setFontSize(10)
    doc.text("_________________________", 40, yPos)
    doc.text("_________________________", pageWidth - 80, yPos)

    yPos += 8
    doc.text("Director of Examinations", 40, yPos)
    doc.text("Minister of Education", pageWidth - 80, yPos)

    yPos += 3
    doc.text("Date: _______________", 40, yPos)
    doc.text("Date: _______________", pageWidth - 80, yPos)

    // Add footer
    this.addFooter(doc, data.certificateNumber)

    return doc.output("blob")
  }

  static async generateAdmissionCard(data: AdmissionCardData): Promise<Blob> {
    const doc = new jsPDF("portrait", "mm", "a4")
    const pageWidth = doc.internal.pageSize.getWidth()

    // Add watermark
    this.addWatermark(doc, "ADMISSION CARD")

    // Add header
    let yPos = this.addHeader(doc, "EXAMINATION ADMISSION CARD")

    yPos += 10

    // Student photo placeholder
    if (data.photo) {
      doc.addImage(data.photo, "JPEG", pageWidth - 50, yPos, 30, 40)
    } else {
      doc.setFillColor(240, 240, 240)
      doc.rect(pageWidth - 50, yPos, 30, 40, "F")
      doc.setFontSize(8)
      doc.text("STUDENT", pageWidth - 35, yPos + 18, { align: "center" })
      doc.text("PHOTO", pageWidth - 35, yPos + 25, { align: "center" })
    }

    // Student information
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("STUDENT INFORMATION", 20, yPos)

    yPos += 10
    doc.setFont("helvetica", "normal")
    doc.text(`Name: ${data.studentName}`, 20, yPos)

    yPos += 8
    doc.text(`Student ID: ${data.studentId}`, 20, yPos)

    yPos += 15
    doc.setFont("helvetica", "bold")
    doc.text("EXAMINATION DETAILS", 20, yPos)

    yPos += 10
    doc.setFont("helvetica", "normal")
    doc.text(`Examination: ${data.examName}`, 20, yPos)

    yPos += 8
    doc.text(`Code: ${data.examCode}`, 20, yPos)

    yPos += 8
    doc.text(`Date: ${data.examDate}`, 20, yPos)

    yPos += 8
    doc.text(`Time: ${data.examTime}`, 20, yPos)

    yPos += 15
    doc.setFont("helvetica", "bold")
    doc.text("EXAMINATION CENTER", 20, yPos)

    yPos += 10
    doc.setFont("helvetica", "normal")
    doc.text(`Center: ${data.examCenter}`, 20, yPos)

    yPos += 8
    const addressLines = doc.splitTextToSize(data.centerAddress, pageWidth - 40)
    doc.text(addressLines, 20, yPos)
    yPos += addressLines.length * 5

    // Subjects
    yPos += 10
    doc.setFont("helvetica", "bold")
    doc.text("SUBJECTS TO BE EXAMINED", 20, yPos)

    yPos += 8
    doc.setFont("helvetica", "normal")
    data.subjects.forEach((subject, index) => {
      doc.text(`${index + 1}. ${subject}`, 25, yPos)
      yPos += 6
    })

    // Instructions
    yPos += 10
    doc.setFont("helvetica", "bold")
    doc.text("IMPORTANT INSTRUCTIONS", 20, yPos)

    yPos += 8
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    data.instructions.forEach((instruction, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${instruction}`, pageWidth - 40)
      doc.text(lines, 25, yPos)
      yPos += lines.length * 4 + 2
    })

    // Warning box
    yPos += 10
    doc.setFillColor(255, 245, 245)
    doc.rect(20, yPos, pageWidth - 40, 25, "F")
    doc.setLineWidth(0.5)
    doc.setDrawColor(255, 0, 0)
    doc.rect(20, yPos, pageWidth - 40, 25)

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 0, 0)
    doc.text("WARNING:", 25, yPos + 8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.text("This admission card must be presented at the examination center.", 25, yPos + 15)
    doc.text("No candidate will be admitted without this card and valid ID.", 25, yPos + 20)

    // Add footer
    this.addFooter(doc, `AC-${data.studentId}-${data.examCode}`)

    return doc.output("blob")
  }

  static async generateTranscript(data: TranscriptData): Promise<Blob> {
    const doc = new jsPDF("portrait", "mm", "a4")
    const pageWidth = doc.internal.pageSize.getWidth()

    // Add watermark
    this.addWatermark(doc, "OFFICIAL TRANSCRIPT")

    // Add header
    let yPos = this.addHeader(doc, "ACADEMIC TRANSCRIPT")

    yPos += 10

    // Student information
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("STUDENT INFORMATION", 20, yPos)

    yPos += 10
    doc.setFont("helvetica", "normal")
    doc.text(`Name: ${data.studentName}`, 20, yPos)
    doc.text(`Student ID: ${data.studentId}`, pageWidth - 20, yPos, { align: "right" })

    yPos += 8
    doc.text(`Institution: ${data.institution}`, 20, yPos)

    yPos += 8
    doc.text(`Program: ${data.program}`, 20, yPos)
    doc.text(`Level: ${data.level}`, pageWidth - 20, yPos, { align: "right" })

    // Results table
    yPos += 20
    doc.setFont("helvetica", "bold")
    doc.text("EXAMINATION RESULTS", 20, yPos)

    yPos += 10

    // Table headers
    const tableHeaders = ["Examination", "Code", "Date", "Score", "Grade", "Credits"]
    const colWidths = [50, 25, 25, 20, 20, 20]
    let xPos = 20

    doc.setFillColor(240, 240, 240)
    doc.rect(20, yPos - 5, pageWidth - 40, 10, "F")

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    tableHeaders.forEach((header, index) => {
      doc.text(header, xPos + 2, yPos)
      xPos += colWidths[index]
    })

    yPos += 8

    // Table rows
    doc.setFont("helvetica", "normal")
    data.results.forEach((result, index) => {
      if (yPos > 250) {
        // New page if needed
        doc.addPage()
        yPos = 30
      }

      xPos = 20
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
        doc.rect(20, yPos - 3, pageWidth - 40, 8, "F")
      }

      rowData.forEach((data, colIndex) => {
        doc.text(data, xPos + 2, yPos)
        xPos += colWidths[colIndex]
      })

      yPos += 8
    })

    // Summary
    yPos += 15
    doc.setFont("helvetica", "bold")
    doc.text("ACADEMIC SUMMARY", 20, yPos)

    yPos += 10
    doc.setFont("helvetica", "normal")
    doc.text(`Total Credits Earned: ${data.totalCredits}`, 20, yPos)
    doc.text(`Cumulative GPA: ${data.gpa.toFixed(2)}`, pageWidth - 20, yPos, { align: "right" })

    yPos += 8
    doc.text(`Date Issued: ${data.dateIssued}`, 20, yPos)

    // Classification
    yPos += 15
    let classification = ""
    if (data.gpa >= 3.7) classification = "FIRST CLASS HONORS"
    else if (data.gpa >= 3.3) classification = "SECOND CLASS HONORS (UPPER DIVISION)"
    else if (data.gpa >= 2.7) classification = "SECOND CLASS HONORS (LOWER DIVISION)"
    else if (data.gpa >= 2.0) classification = "THIRD CLASS HONORS"
    else classification = "PASS"

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(`CLASSIFICATION: ${classification}`, pageWidth / 2, yPos, { align: "center" })

    // Signature section
    yPos += 25
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("_________________________", 40, yPos)
    doc.text("_________________________", pageWidth - 80, yPos)

    yPos += 8
    doc.text("Registrar", 40, yPos)
    doc.text("Director of Examinations", pageWidth - 80, yPos)

    // Add footer
    this.addFooter(doc, `TR-${data.studentId}-${new Date().getFullYear()}`)

    return doc.output("blob")
  }

  static async generateFromHTML(elementId: string, filename: string): Promise<Blob> {
    const element = document.getElementById(elementId)
    if (!element) throw new Error("Element not found")

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("portrait", "mm", "a4")

    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    return pdf.output("blob")
  }
}
