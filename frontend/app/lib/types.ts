// Base User interface
export interface User {
  userId: string
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: number
  gender: string
  role: "student" | "ministry_admin" | "institution_admin" | "exam_body"
}

// Ministry Admin
export interface MinistryAdmin extends User {
  role: "ministry_admin"
  ministryID: string
  type: string
}

// Institution Admin
export interface InstitutionAdmin extends User {
  role: "institution_admin"
  institutionName: string
  title: string
  assignedDate: Date
}

// Student
export interface Student extends User {
  role: "student"
  institutionName: string
  studentId: string
  program: string
  level: string
}

// Exam Body
export interface ExamBody extends User {
  role: "exam_body"
  type: string
  organization: string
}

// Institution
export interface Institution {
  id: string
  name: string
  address: string
  type: string
  region: string
  regDate: Date
  website?: string
  email: string
  phone: string
  logo?: string
}

// Base Exam interface
export interface Exam {
  examId: string
  title: string
  date: Date
  type: string
  isPublic: boolean
  registrationDeadline: Date
  examFee: number
  description: string
  subjects?: string[]
}

// Concours (entrance examinations)
export interface Concours extends Exam {
  hostInstitution: string
  department: string
  availableSeats: number
  applicationRequirements: string[]
}

// Result
export interface Result {
  resultId: string
  studentId: string
  examId: string
  score: number
  grade: string
  isPublished: boolean
  datePublished?: Date
}

// Notification
export interface Notification {
  notificationId: string
  userId: string
  message: string
  date: Date
  isRead: boolean
  type: "result" | "registration" | "system" | "approval"
}

// Exam Registration
export interface ExamRegistration {
  registrationId: string
  examId: string
  studentId: string
  registrationDate: Date
  status: "pending" | "approved" | "rejected"
  paymentStatus: "pending" | "completed" | "failed"
  admissionCardIssued: boolean
}
