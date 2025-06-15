import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

// API Response types
export interface ApiResponse<T = any> {
  success?: boolean
  message?: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T = any> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  user_type: string
  user_id: string
}

export interface User {
  user_id: string
  user_type: string
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  is_active: boolean
  permissions: string[]
  created_at?: string
  gender?: string
  institution_name?: string
  title?: string
  type?: string
}

export interface Institution {
  institution_id: string
  name: string
  type: string
  region: string
  address: string
  phone_number?: string
  email?: string
  is_verified: boolean
  created_at: string
}

export interface InstitutionCreate {
  name: string
  address: string
  type: string
  region: string
  phone_number?: string
  email?: string
}

export interface Student {
  student_id: string
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  gender?: string
  institution_name: string
  is_active: boolean
  created_at: string
}

export interface StudentCreate {
  first_name: string
  last_name: string
  email: string
  password: string
  phone_number?: string
  gender: string
  institution_name: string
}

export interface InstitutionAdminCreate {
  first_name: string
  last_name: string
  email: string
  password: string
  phone_number?: string
  institution_name: string
  title?: string
}

export interface MinistryAdminCreate {
  first_name: string
  last_name: string
  email: string
  password: string
  phone_number?: string
  type?: string
}

export interface Exam {
  exam_id: string
  name: string
  type: string
  level: string
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  status: string
  subjects: string[]
  fee: number
}

class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000"

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          this.logout()
          window.location.href = "/auth"
        }

        return Promise.reject(error)
      },
    )
  }

  private getToken(): string {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token") || ""
    }
    return ""
  }

  private setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  private clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
    }
  }

  private async request<T = any>(method: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        method,
        url,
        data,
        ...config,
      })
      return response.data
    } catch (error: any) {
      console.error(`API Error [${method.toUpperCase()} ${url}]:`, error.response?.data || error.message)

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.")
      }
      if (error.response?.status === 403) {
        throw new Error("Access denied. You don't have permission to perform this action.")
      }
      if (error.response?.status === 404) {
        throw new Error(`Endpoint not found: ${method.toUpperCase()} ${url}`)
      }
      if (error.response?.status === 422) {
        const details = error.response.data?.detail
        if (Array.isArray(details)) {
          const messages = details.map((d: any) => `${d.loc?.join(".")} - ${d.msg}`).join(", ")
          throw new Error(`Validation error: ${messages}`)
        }
        throw new Error(details || "Validation error")
      }
      if (error.response?.data) {
        throw new Error(error.response.data.detail || error.response.data.message || "Request failed")
      }
      throw new Error(error.message || "Network error")
    }
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const formData = new URLSearchParams()
    formData.append("username", email)
    formData.append("password", password)

    const response = await this.request<TokenResponse>("post", "/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    this.setToken(response.access_token)
    const user = await this.getCurrentUser()

    return { user, token: response.access_token }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("get", "/auth/me")
  }

  async logout(): Promise<void> {
    try {
      await this.request("post", "/auth/logout")
    } catch (error) {
      // Ignore logout errors
    } finally {
      this.clearTokens()
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("post", "/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    })
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("post", "/auth/forgot-password", { email })
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("post", "/auth/reset-password", {
      token,
      new_password: newPassword,
    })
  }

  // Ministry Admin endpoints
  async getMinistryDashboard(): Promise<any> {
    return this.request("get", "/ministry-admin/dashboard")
  }

  async getSystemWideAnalytics(): Promise<any> {
    return this.request("get", "/ministry-admin/analytics/system-wide")
  }

  async getAllUsers(params?: {
    page?: number
    size?: number
    user_type?: string
    search?: string
  }): Promise<PaginatedResponse> {
    return this.request<PaginatedResponse>("get", "/users/", undefined, { params })
  }

  async getUserById(userType: string, userId: string): Promise<any> {
    return this.request("get", `/users/${userType}/${userId}`)
  }

  async activateUser(userType: string, userId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("put", `/users/${userType}/${userId}/activate`)
  }

  async deactivateUser(userType: string, userId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("put", `/users/${userType}/${userId}/deactivate`)
  }

  async getUserStatistics(): Promise<any> {
    return this.request("get", "/users/statistics/overview")
  }

  // User Creation endpoints
  async createStudent(studentData: StudentCreate): Promise<Student> {
    return this.request<Student>("post", "/ministry-admin/create-student", studentData)
  }

  async createInstitutionAdmin(adminData: InstitutionAdminCreate): Promise<any> {
    return this.request("post", "/ministry-admin/create-institutional-admin", adminData)
  }

  async createMinistryAdmin(adminData: MinistryAdminCreate): Promise<any> {
    return this.request("post", "/ministry-admin/create-ministry-admin", adminData)
  }

  // Institution Management (Ministry Admin)
  async getInstitutions(params?: {
    page?: number
    size?: number
    type?: string
    region?: string
    verified?: boolean
    search?: string
  }): Promise<PaginatedResponse<Institution>> {
    return this.request<PaginatedResponse<Institution>>("get", "/institutions/", undefined, { params })
  }

  async getInstitution(institutionId: string): Promise<Institution> {
    return this.request<Institution>("get", `/institutions/${institutionId}`)
  }

  async createInstitution(institutionData: InstitutionCreate): Promise<Institution> {
    // Ensure the data matches the expected schema
    const payload = {
      name: institutionData.name,
      address: institutionData.address,
      type: institutionData.type,
      region: institutionData.region,
      phone_number: institutionData.phone_number || null,
      email: institutionData.email || null,
    }

    console.log("Creating institution with payload:", payload)
    return this.request<Institution>("post", "/institutions/", payload)
  }

  async updateInstitution(institutionId: string, institutionData: Partial<Institution>): Promise<Institution> {
    return this.request<Institution>("put", `/institutions/${institutionId}`, institutionData)
  }

  async deleteInstitution(institutionId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("delete", `/institutions/${institutionId}`)
  }

  async verifyInstitution(institutionId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("post", `/institutions/${institutionId}/verify`)
  }

  async getInstitutionStudents(institutionId: string, params?: { page?: number; size?: number }): Promise<any> {
    return this.request("get", `/institutions/${institutionId}/students`, undefined, { params })
  }

  async getInstitutionAdmins(institutionId: string): Promise<any> {
    return this.request("get", `/institutions/${institutionId}/admins`)
  }

  async getInstitutionStatistics(institutionId: string): Promise<any> {
    return this.request("get", `/institutions/${institutionId}/statistics`)
  }

  // Institutional Admin endpoints
  async getInstitutionDashboard(): Promise<any> {
    return this.request("get", "/institutional-admin/institution/data")
  }

  async getInstitutionStudentsList(params?: {
    page?: number
    size?: number
    search?: string
  }): Promise<PaginatedResponse<Student>> {
    return this.request<PaginatedResponse<Student>>("get", "/institutional-admin/students", undefined, { params })
  }

  async updateStudent(studentId: string, studentData: Partial<Student>): Promise<Student> {
    return this.request<Student>("put", `/institutional-admin/students/${studentId}`, studentData)
  }

  async deleteStudent(studentId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("delete", `/institutional-admin/students/${studentId}`)
  }

  async getInstitutionRegistrations(params?: {
    page?: number
    size?: number
    exam_id?: string
    status?: string
  }): Promise<PaginatedResponse> {
    return this.request<PaginatedResponse>("get", "/institutional-admin/registrations", undefined, { params })
  }

  async getInstitutionResults(params?: {
    page?: number
    size?: number
    exam_id?: string
    student_id?: string
  }): Promise<PaginatedResponse> {
    return this.request<PaginatedResponse>("get", "/institutional-admin/results", undefined, { params })
  }

  // Student endpoints
  async getStudentDashboard(): Promise<any> {
    return this.request("get", "/student-dashboard/dashboard")
  }

  async getAvailableExams(): Promise<Exam[]> {
    return this.request<Exam[]>("get", "/student-dashboard/available-exams")
  }

  async getMyRegistrations(): Promise<any[]> {
    return this.request("get", "/student-dashboard/registrations")
  }

  async getMyResults(): Promise<any[]> {
    return this.request("get", "/student-dashboard/results")
  }

  async registerForExam(examId: string, subjects: string[]): Promise<ApiResponse> {
    return this.request<ApiResponse>("post", "/student-dashboard/register-exam", {
      exam_id: examId,
      subjects: subjects,
    })
  }

  // Exam Management (Exam Body/Ministry)
  async getExams(params?: {
    page?: number
    size?: number
    type?: string
    level?: string
    status?: string
    search?: string
  }): Promise<PaginatedResponse<Exam>> {
    return this.request<PaginatedResponse<Exam>>("get", "/exams/", undefined, { params })
  }

  async getExam(examId: string): Promise<Exam> {
    return this.request<Exam>("get", `/exams/${examId}`)
  }

  async createExam(examData: Partial<Exam>): Promise<Exam> {
    return this.request<Exam>("post", "/exams/", examData)
  }

  async updateExam(examId: string, examData: Partial<Exam>): Promise<Exam> {
    return this.request<Exam>("put", `/exams/${examId}`, examData)
  }

  async deleteExam(examId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("delete", `/exams/${examId}`)
  }

  async getExamRegistrations(examId: string, params?: { page?: number; size?: number }): Promise<PaginatedResponse> {
    return this.request<PaginatedResponse>("get", `/exams/${examId}/registrations`, undefined, { params })
  }

  async approveRegistration(registrationId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("post", `/registrations/${registrationId}/approve`)
  }

  async rejectRegistration(registrationId: string, reason?: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("post", `/registrations/${registrationId}/reject`, { reason })
  }

  // Results Management
  async getResults(params?: {
    page?: number
    size?: number
    student_id?: string
    exam_id?: string
    status?: string
    published_only?: boolean
  }): Promise<PaginatedResponse> {
    return this.request<PaginatedResponse>("get", "/results/", undefined, { params })
  }

  async getResult(resultId: string): Promise<any> {
    return this.request("get", `/results/${resultId}`)
  }

  async createResult(resultData: any): Promise<any> {
    return this.request("post", "/results/", resultData)
  }

  async updateResult(resultId: string, resultData: any): Promise<any> {
    return this.request("put", `/results/${resultId}`, resultData)
  }

  async publishResult(resultId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>("post", `/results/${resultId}/publish`)
  }

  async bulkUploadResults(resultsData: any[]): Promise<ApiResponse> {
    return this.request<ApiResponse>("post", "/results/bulk-upload", resultsData)
  }

  // Public endpoints
  async searchPublicResults(searchData: any): Promise<any[]> {
    return this.request("post", "/public/search-results", searchData)
  }

  async getPublicExams(): Promise<Exam[]> {
    return this.request<Exam[]>("get", "/public/exams")
  }

  async getPublicInstitutions(params?: { region?: string; type?: string }): Promise<Institution[]> {
    return this.request<Institution[]>("get", "/public/institutions", undefined, { params })
  }

  async getPublicStatistics(): Promise<any> {
    return this.request("get", "/public/statistics")
  }

  // File upload endpoints
  async uploadFile(file: File, endpoint: string): Promise<any> {
    const formData = new FormData()
    formData.append("file", file)

    return this.request("post", endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }
}

const apiClient = new ApiClient()
export default apiClient
