import type {
  Exam,
  Institution,
  Concours,
  User,
  MinistryAdmin,
  InstitutionAdmin,
  Student,
  ExamBody,
  Result,
  Notification,
  ExamRegistration,
} from "./types"

// Mock data for institutions
export const institutions: Institution[] = [
  {
    id: "inst-001",
    name: "University of Buea",
    address: "Buea, South West Region",
    type: "University",
    region: "South West",
    regDate: new Date("1993-01-15"),
    website: "www.ubuea.cm",
    email: "info@ubuea.cm",
    phone: "+237 233 322 134",
    logo: "/institutions/ubuea.png",
  },
  {
    id: "inst-002",
    name: "University of Yaoundé I",
    address: "Yaoundé, Centre Region",
    type: "University",
    region: "Centre",
    regDate: new Date("1962-07-21"),
    website: "www.uy1.cm",
    email: "info@uy1.cm",
    phone: "+237 222 220 275",
    logo: "/institutions/uy1.png",
  },
  {
    id: "inst-003",
    name: "University of Douala",
    address: "Douala, Littoral Region",
    type: "University",
    region: "Littoral",
    regDate: new Date("1977-04-12"),
    website: "www.univ-douala.cm",
    email: "info@univ-douala.cm",
    phone: "+237 233 401 291",
    logo: "/institutions/udouala.png",
  },
  {
    id: "inst-004",
    name: "Lycée Général Leclerc",
    address: "Yaoundé, Centre Region",
    type: "Secondary School",
    region: "Centre",
    regDate: new Date("1952-09-01"),
    email: "lycee.leclerc@education.cm",
    phone: "+237 222 223 456",
    logo: "/institutions/leclerc.png",
  },
  {
    id: "inst-005",
    name: "Lycée Bilingue de Buea",
    address: "Buea, South West Region",
    type: "Secondary School",
    region: "South West",
    regDate: new Date("1965-09-01"),
    email: "lycee.buea@education.cm",
    phone: "+237 233 322 789",
    logo: "/institutions/lbb.png",
  },
  {
    id: "inst-006",
    name: "National Advanced School of Engineering (ENSP)",
    address: "Yaoundé, Centre Region",
    type: "Professional School",
    region: "Centre",
    regDate: new Date("1971-05-20"),
    website: "www.polytechnique.cm",
    email: "info@polytechnique.cm",
    phone: "+237 222 231 245",
    logo: "/institutions/ensp.png",
  },
  {
    id: "inst-007",
    name: "Faculty of Engineering and Technology (FET)",
    address: "Buea, South West Region",
    type: "Professional School",
    region: "South West",
    regDate: new Date("2010-10-05"),
    website: "www.fet.ubuea.cm",
    email: "fet@ubuea.cm",
    phone: "+237 233 322 567",
    logo: "/institutions/fet.png",
  },
]

// Mock data for exams
export const exams: Exam[] = [
  {
    examId: "exam-001",
    title: "GCE Advanced Level",
    date: new Date("2024-06-15"),
    type: "National Examination",
    isPublic: true,
    registrationDeadline: new Date("2024-03-31"),
    examFee: 15000,
    description: "General Certificate of Education Advanced Level examination for secondary school students",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Economics", "Literature"],
  },
  {
    examId: "exam-002",
    title: "GCE Ordinary Level",
    date: new Date("2024-06-01"),
    type: "National Examination",
    isPublic: true,
    registrationDeadline: new Date("2024-03-31"),
    examFee: 10000,
    description: "General Certificate of Education Ordinary Level examination for secondary school students",
    subjects: ["Mathematics", "English", "French", "Physics", "Chemistry", "Biology", "History", "Geography"],
  },
  {
    examId: "exam-003",
    title: "Baccalauréat",
    date: new Date("2024-06-10"),
    type: "National Examination",
    isPublic: true,
    registrationDeadline: new Date("2024-03-31"),
    examFee: 15000,
    description: "French-system secondary school leaving examination",
    subjects: ["Mathematics", "Physics", "Chemistry", "SVT", "Philosophy", "French", "History-Geography"],
  },
  {
    examId: "exam-004",
    title: "Probatoire",
    date: new Date("2024-05-20"),
    type: "National Examination",
    isPublic: true,
    registrationDeadline: new Date("2024-03-15"),
    examFee: 12000,
    description: "French-system intermediate secondary school examination",
    subjects: ["Mathematics", "Physics", "Chemistry", "SVT", "French", "History-Geography"],
  },
  {
    examId: "exam-005",
    title: "BEPC",
    date: new Date("2024-06-05"),
    type: "National Examination",
    isPublic: true,
    registrationDeadline: new Date("2024-03-20"),
    examFee: 8000,
    description: "Brevet d'Études du Premier Cycle examination",
    subjects: ["Mathematics", "French", "English", "Science", "History", "Geography"],
  },
]

// Mock data for concours (entrance examinations)
export const concours: Concours[] = [
  {
    examId: "conc-001",
    title: "FET Engineering Entrance Examination",
    date: new Date("2024-07-15"),
    type: "Entrance Examination",
    isPublic: true,
    registrationDeadline: new Date("2024-06-15"),
    examFee: 20000,
    description: "Entrance examination for the Faculty of Engineering and Technology at the University of Buea",
    hostInstitution: "University of Buea",
    department: "Faculty of Engineering and Technology",
    availableSeats: 150,
    applicationRequirements: [
      "GCE A-Level with at least C grade in Mathematics and Physics",
      "Birth Certificate",
      "Medical Certificate",
      "Passport Photo",
    ],
  },
  {
    examId: "conc-002",
    title: "ENSP Engineering Entrance Examination",
    date: new Date("2024-07-20"),
    type: "Entrance Examination",
    isPublic: true,
    registrationDeadline: new Date("2024-06-20"),
    examFee: 25000,
    description: "Entrance examination for the National Advanced School of Engineering",
    hostInstitution: "University of Yaoundé I",
    department: "National Advanced School of Engineering",
    availableSeats: 200,
    applicationRequirements: [
      "Baccalauréat C or D or GCE A-Level with at least B grade in Mathematics and Physics",
      "Birth Certificate",
      "Medical Certificate",
      "Passport Photo",
    ],
  },
  {
    examId: "conc-003",
    title: "FMBS Medical School Entrance Examination",
    date: new Date("2024-08-05"),
    type: "Entrance Examination",
    isPublic: true,
    registrationDeadline: new Date("2024-07-05"),
    examFee: 30000,
    description: "Entrance examination for the Faculty of Medicine and Biomedical Sciences",
    hostInstitution: "University of Yaoundé I",
    department: "Faculty of Medicine and Biomedical Sciences",
    availableSeats: 120,
    applicationRequirements: [
      "Baccalauréat C or D or GCE A-Level with at least B grade in Biology and Chemistry",
      "Birth Certificate",
      "Medical Certificate",
      "Passport Photo",
    ],
  },
  {
    examId: "conc-004",
    title: "ESSTIC Entrance Examination",
    date: new Date("2024-08-10"),
    type: "Entrance Examination",
    isPublic: true,
    registrationDeadline: new Date("2024-07-10"),
    examFee: 20000,
    description: "Entrance examination for the Advanced School of Mass Communication",
    hostInstitution: "University of Yaoundé II",
    department: "Advanced School of Mass Communication",
    availableSeats: 100,
    applicationRequirements: [
      "Baccalauréat or GCE A-Level",
      "Birth Certificate",
      "Medical Certificate",
      "Passport Photo",
    ],
  },
  {
    examId: "conc-005",
    title: "ENAM Entrance Examination",
    date: new Date("2024-09-05"),
    type: "Entrance Examination",
    isPublic: true,
    registrationDeadline: new Date("2024-08-05"),
    examFee: 25000,
    description: "Entrance examination for the National School of Administration and Magistracy",
    hostInstitution: "Ministry of Public Service and Administrative Reform",
    department: "National School of Administration and Magistracy",
    availableSeats: 80,
    applicationRequirements: [
      "Bachelor's Degree",
      "Birth Certificate",
      "Medical Certificate",
      "Passport Photo",
      "Certificate of Nationality",
    ],
  },
]

// Mock users data
export const users: User[] = [
  {
    userId: "user-001",
    firstName: "Jean",
    lastName: "Baptiste",
    email: "jean.baptiste@student.ubuea.cm",
    password: "password123",
    phoneNumber: 237677123456,
    gender: "Male",
    role: "student",
  },
  {
    userId: "user-002",
    firstName: "Marie",
    lastName: "Ngozi",
    email: "marie.ngozi@minesup.gov.cm",
    password: "admin123",
    phoneNumber: 237699887766,
    gender: "Female",
    role: "ministry_admin",
  },
  {
    userId: "user-003",
    firstName: "Paul",
    lastName: "Nkomo",
    email: "paul.nkomo@lycee-leclerc.cm",
    password: "admin456",
    phoneNumber: 237655443322,
    gender: "Male",
    role: "institution_admin",
  },
  {
    userId: "user-004",
    firstName: "Emmanuel",
    lastName: "Mbarga",
    email: "emmanuel.mbarga@gce-board.cm",
    password: "examiner123",
    phoneNumber: 237677889900,
    gender: "Male",
    role: "exam_body",
  },
]

// Mock ministry admins
export const ministryAdmins: MinistryAdmin[] = [
  {
    userId: "user-002",
    firstName: "Marie",
    lastName: "Ngozi",
    email: "marie.ngozi@minesup.gov.cm",
    password: "admin123",
    phoneNumber: 237699887766,
    gender: "Female",
    role: "ministry_admin",
    ministryID: "MIN-001",
    type: "Senior Administrator",
  },
]

// Mock institution admins
export const institutionAdmins: InstitutionAdmin[] = [
  {
    userId: "user-003",
    firstName: "Paul",
    lastName: "Nkomo",
    email: "paul.nkomo@lycee-leclerc.cm",
    password: "admin456",
    phoneNumber: 237655443322,
    gender: "Male",
    role: "institution_admin",
    institutionName: "Lycée Général Leclerc",
    title: "Principal",
    assignedDate: new Date("2020-09-01"),
  },
  {
    userId: "user-005",
    firstName: "Sarah",
    lastName: "Etonde",
    email: "sarah.etonde@ubuea.cm",
    password: "admin789",
    phoneNumber: 237677112233,
    gender: "Female",
    role: "institution_admin",
    institutionName: "University of Buea",
    title: "Registrar",
    assignedDate: new Date("2019-01-15"),
  },
]

// Mock students
export const students: Student[] = [
  {
    userId: "user-001",
    firstName: "Jean",
    lastName: "Baptiste",
    email: "jean.baptiste@student.ubuea.cm",
    password: "password123",
    phoneNumber: 237677123456,
    gender: "Male",
    role: "student",
    institutionName: "University of Buea",
    studentId: "UB19001234",
    program: "Computer Engineering",
    level: "300",
  },
  {
    userId: "user-006",
    firstName: "Aisha",
    lastName: "Nkeng",
    email: "aisha.nkeng@student.ubuea.cm",
    password: "password456",
    phoneNumber: 237677445566,
    gender: "Female",
    role: "student",
    institutionName: "University of Buea",
    studentId: "UB20002345",
    program: "Electrical Engineering",
    level: "200",
  },
  {
    userId: "user-007",
    firstName: "Pierre",
    lastName: "Kamdem",
    email: "pierre.kamdem@student.lycee-leclerc.cm",
    password: "password789",
    phoneNumber: 237677778899,
    gender: "Male",
    role: "student",
    institutionName: "Lycée Général Leclerc",
    studentId: "LGL22003456",
    program: "Science",
    level: "Upper Sixth",
  },
]

// Mock exam bodies
export const examBodies: ExamBody[] = [
  {
    userId: "user-004",
    firstName: "Emmanuel",
    lastName: "Mbarga",
    email: "emmanuel.mbarga@gce-board.cm",
    password: "examiner123",
    phoneNumber: 237677889900,
    gender: "Male",
    role: "exam_body",
    type: "Examination Board",
    organization: "GCE Board",
  },
  {
    userId: "user-008",
    firstName: "Jacqueline",
    lastName: "Mendo",
    email: "jacqueline.mendo@obc.cm",
    password: "examiner456",
    phoneNumber: 237677001122,
    gender: "Female",
    role: "exam_body",
    type: "Examination Board",
    organization: "Office du Baccalauréat du Cameroun",
  },
]

// Mock results
export const results: Result[] = [
  {
    resultId: "res-001",
    studentId: "UB19001234",
    examId: "exam-001",
    score: 85.5,
    grade: "A",
    isPublished: true,
    datePublished: new Date("2023-08-15"),
  },
  {
    resultId: "res-002",
    studentId: "UB20002345",
    examId: "exam-001",
    score: 78.2,
    grade: "B+",
    isPublished: true,
    datePublished: new Date("2023-08-15"),
  },
  {
    resultId: "res-003",
    studentId: "LGL22003456",
    examId: "exam-002",
    score: 92.0,
    grade: "A+",
    isPublished: true,
    datePublished: new Date("2023-08-10"),
  },
  {
    resultId: "res-004",
    studentId: "UB19001234",
    examId: "conc-001",
    score: 72.5,
    grade: "B",
    isPublished: false,
  },
]

// Mock notifications
export const notifications: Notification[] = [
  {
    notificationId: "notif-001",
    userId: "user-001",
    message: "Your GCE A-Level results have been published. You scored an A grade!",
    date: new Date("2023-08-15T10:30:00"),
    isRead: false,
    type: "result",
  },
  {
    notificationId: "notif-002",
    userId: "user-001",
    message: "Registration for FET Engineering Entrance Examination is now open.",
    date: new Date("2024-05-01T09:15:00"),
    isRead: true,
    type: "registration",
  },
  {
    notificationId: "notif-003",
    userId: "user-002",
    message: "New institution registration request from Bamenda University of Science and Technology.",
    date: new Date("2024-04-28T14:45:00"),
    isRead: false,
    type: "system",
  },
  {
    notificationId: "notif-004",
    userId: "user-003",
    message: "GCE Board has requested student verification for the upcoming examinations.",
    date: new Date("2024-04-25T11:20:00"),
    isRead: false,
    type: "system",
  },
  {
    notificationId: "notif-005",
    userId: "user-004",
    message: "Ministry of Higher Education has approved the examination results for publication.",
    date: new Date("2023-08-14T16:30:00"),
    isRead: true,
    type: "approval",
  },
]

// Mock exam registrations
export const examRegistrations: ExamRegistration[] = [
  {
    registrationId: "reg-001",
    examId: "exam-001",
    studentId: "UB19001234",
    registrationDate: new Date("2024-02-15"),
    status: "approved",
    paymentStatus: "completed",
    admissionCardIssued: true,
  },
  {
    registrationId: "reg-002",
    examId: "exam-001",
    studentId: "UB20002345",
    registrationDate: new Date("2024-02-20"),
    status: "approved",
    paymentStatus: "completed",
    admissionCardIssued: true,
  },
  {
    registrationId: "reg-003",
    examId: "exam-002",
    studentId: "LGL22003456",
    registrationDate: new Date("2024-02-10"),
    status: "approved",
    paymentStatus: "completed",
    admissionCardIssued: true,
  },
  {
    registrationId: "reg-004",
    examId: "conc-001",
    studentId: "UB19001234",
    registrationDate: new Date("2024-05-25"),
    status: "pending",
    paymentStatus: "pending",
    admissionCardIssued: false,
  },
]

// Helper functions to get data
export function getUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email)
}

export function getUserById(userId: string): User | undefined {
  return users.find((user) => user.userId === userId)
}

export function getStudentById(studentId: string): Student | undefined {
  return students.find((student) => student.studentId === studentId)
}

export function getExamById(examId: string): Exam | undefined {
  return [...exams, ...concours].find((exam) => exam.examId === examId)
}

export function getInstitutionById(institutionId: string): Institution | undefined {
  return institutions.find((institution) => institution.id === institutionId)
}

export function getResultsByStudentId(studentId: string): Result[] {
  return results.filter((result) => result.studentId === studentId)
}

export function getNotificationsByUserId(userId: string): Notification[] {
  return notifications.filter((notification) => notification.userId === userId)
}

export function getExamRegistrationsByStudentId(studentId: string): ExamRegistration[] {
  return examRegistrations.filter((registration) => registration.studentId === studentId)
}

export function getExamRegistrationsByExamId(examId: string): ExamRegistration[] {
  return examRegistrations.filter((registration) => registration.examId === examId)
}
