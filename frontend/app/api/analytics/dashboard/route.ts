import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role") || "student"
    const timeframe = searchParams.get("timeframe") || "30d"

    // Mock analytics data based on role
    const analyticsData = {
      ministry: {
        totalExams: 45,
        totalStudents: 125000,
        totalInstitutions: 850,
        activeRegistrations: 15420,
        completedExams: 12,
        upcomingExams: 8,
        passRate: 78.5,
        trends: {
          examParticipation: [
            { month: "Jan", value: 8500 },
            { month: "Feb", value: 9200 },
            { month: "Mar", value: 11800 },
            { month: "Apr", value: 15400 },
            { month: "May", value: 18200 },
            { month: "Jun", value: 22100 },
          ],
          passRates: [
            { exam: "BAC A", rate: 82.3 },
            { exam: "BAC C", rate: 79.1 },
            { exam: "BEPC", rate: 75.8 },
            { exam: "GCE AL", rate: 88.2 },
          ],
        },
        regionalData: [
          { region: "Centre", students: 25000, passRate: 81.2 },
          { region: "Littoral", students: 22000, passRate: 79.8 },
          { region: "Ouest", students: 18000, passRate: 76.5 },
          { region: "Nord", students: 15000, passRate: 72.1 },
        ],
      },
      student: {
        registeredExams: 3,
        completedExams: 1,
        upcomingExams: 2,
        averageScore: 14.5,
        rank: 245,
        totalStudents: 1250,
        recentResults: [
          { exam: "Mock Exam 1", score: 15.2, date: "2024-02-15" },
          { exam: "Mock Exam 2", score: 13.8, date: "2024-03-01" },
        ],
        upcomingSchedule: [
          { exam: "BEPC 2024", date: "2024-06-08", status: "registered" },
          { exam: "Mock Exam 3", date: "2024-04-15", status: "pending" },
        ],
      },
      institution_admin: {
        totalStudents: 1250,
        registeredStudents: 980,
        pendingRegistrations: 45,
        approvedRegistrations: 935,
        upcomingExams: 5,
        institutionRank: 12,
        passRate: 82.1,
        trends: {
          registrations: [
            { month: "Jan", value: 120 },
            { month: "Feb", value: 180 },
            { month: "Mar", value: 250 },
            { month: "Apr", value: 320 },
            { month: "May", value: 450 },
            { month: "Jun", value: 580 },
          ],
        },
      },
      exam_body: {
        totalExams: 12,
        activeExams: 3,
        totalCandidates: 45000,
        processedResults: 28000,
        pendingResults: 17000,
        averagePassRate: 76.8,
        examStats: [
          { exam: "GCE OL", candidates: 15000, processed: 15000, passRate: 78.2 },
          { exam: "GCE AL", candidates: 8000, processed: 8000, passRate: 82.1 },
          { exam: "Technical", candidates: 5000, processed: 3000, passRate: 71.5 },
        ],
      },
    }

    return NextResponse.json(analyticsData[role as keyof typeof analyticsData] || analyticsData.student)
  } catch (error) {
    console.error("Get dashboard analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
