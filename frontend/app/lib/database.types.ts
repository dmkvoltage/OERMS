export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          role: "ministry" | "ministry_admin" | "institution_admin" | "teacher" | "student" | "exam_body"
          first_name: string
          last_name: string
          phone: string | null
          date_of_birth: string | null
          place_of_birth: string | null
          nationality: string | null
          institution_id: string | null
          is_active: boolean | null
          email_verified: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          role: "ministry" | "ministry_admin" | "institution_admin" | "teacher" | "student" | "exam_body"
          first_name: string
          last_name: string
          phone?: string | null
          date_of_birth?: string | null
          place_of_birth?: string | null
          nationality?: string | null
          institution_id?: string | null
          is_active?: boolean | null
          email_verified?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          role?: "ministry" | "ministry_admin" | "institution_admin" | "teacher" | "student" | "exam_body"
          first_name?: string
          last_name?: string
          phone?: string | null
          date_of_birth?: string | null
          place_of_birth?: string | null
          nationality?: string | null
          institution_id?: string | null
          is_active?: boolean | null
          email_verified?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      institutions: {
        Row: {
          id: string
          name: string
          type: string
          address: string
          region: string
          city: string
          phone: string | null
          email: string | null
          principal_name: string | null
          registration_number: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: string
          address: string
          region: string
          city: string
          phone?: string | null
          email?: string | null
          principal_name?: string | null
          registration_number?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string
          address?: string
          region?: string
          city?: string
          phone?: string | null
          email?: string | null
          principal_name?: string | null
          registration_number?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      exams: {
        Row: {
          id: string
          name: string
          type: string
          level: string
          subjects: Json
          start_date: string
          end_date: string
          registration_deadline: string
          status: "draft" | "upcoming" | "active" | "completed" | "cancelled" | null
          passing_score: number | null
          total_marks: number | null
          exam_fee: number
          description: string | null
          instructions: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: string
          level: string
          subjects: Json
          start_date: string
          end_date: string
          registration_deadline: string
          status?: "draft" | "upcoming" | "active" | "completed" | "cancelled" | null
          passing_score?: number | null
          total_marks?: number | null
          exam_fee: number
          description?: string | null
          instructions?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string
          level?: string
          subjects?: Json
          start_date?: string
          end_date?: string
          registration_deadline?: string
          status?: "draft" | "upcoming" | "active" | "completed" | "cancelled" | null
          passing_score?: number | null
          total_marks?: number | null
          exam_fee?: number
          description?: string | null
          instructions?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      exam_centers: {
        Row: {
          id: string
          name: string
          address: string
          region: string
          city: string
          capacity: number
          facilities: Json | null
          contact_person: string | null
          phone: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          address: string
          region: string
          city: string
          capacity: number
          facilities?: Json | null
          contact_person?: string | null
          phone?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          address?: string
          region?: string
          city?: string
          capacity?: number
          facilities?: Json | null
          contact_person?: string | null
          phone?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
      }
      registrations: {
        Row: {
          id: string
          student_id: string
          exam_id: string
          exam_center_id: string | null
          registration_number: string
          subjects: Json
          status: "pending" | "approved" | "rejected" | "cancelled" | null
          payment_status: "pending" | "paid" | "failed" | "refunded" | null
          payment_amount: number
          payment_reference: string | null
          documents: Json | null
          special_needs: string | null
          emergency_contact: Json | null
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          exam_id: string
          exam_center_id?: string | null
          registration_number: string
          subjects: Json
          status?: "pending" | "approved" | "rejected" | "cancelled" | null
          payment_status?: "pending" | "paid" | "failed" | "refunded" | null
          payment_amount: number
          payment_reference?: string | null
          documents?: Json | null
          special_needs?: string | null
          emergency_contact?: Json | null
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          exam_id?: string
          exam_center_id?: string | null
          registration_number?: string
          subjects?: Json
          status?: "pending" | "approved" | "rejected" | "cancelled" | null
          payment_status?: "pending" | "paid" | "failed" | "refunded" | null
          payment_amount?: number
          payment_reference?: string | null
          documents?: Json | null
          special_needs?: string | null
          emergency_contact?: Json | null
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      results: {
        Row: {
          id: string
          student_id: string
          exam_id: string
          registration_id: string
          subject_scores: Json
          total_score: number
          percentage: number
          grade: string
          rank: number | null
          is_published: boolean | null
          published_at: string | null
          certificate_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          exam_id: string
          registration_id: string
          subject_scores: Json
          total_score: number
          percentage: number
          grade: string
          rank?: number | null
          is_published?: boolean | null
          published_at?: string | null
          certificate_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          exam_id?: string
          registration_id?: string
          subject_scores?: Json
          total_score?: number
          percentage?: number
          grade?: string
          rank?: number | null
          is_published?: boolean | null
          published_at?: string | null
          certificate_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type:
            | "info"
            | "success"
            | "warning"
            | "error"
            | "exam_update"
            | "registration_update"
            | "result_published"
            | null
          is_read: boolean | null
          action_url: string | null
          metadata: Json | null
          created_at: string | null
          read_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?:
            | "info"
            | "success"
            | "warning"
            | "error"
            | "exam_update"
            | "registration_update"
            | "result_published"
            | null
          is_read?: boolean | null
          action_url?: string | null
          metadata?: Json | null
          created_at?: string | null
          read_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?:
            | "info"
            | "success"
            | "warning"
            | "error"
            | "exam_update"
            | "registration_update"
            | "result_published"
            | null
          is_read?: boolean | null
          action_url?: string | null
          metadata?: Json | null
          created_at?: string | null
          read_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      exam_status: "draft" | "upcoming" | "active" | "completed" | "cancelled"
      notification_type:
        | "info"
        | "success"
        | "warning"
        | "error"
        | "exam_update"
        | "registration_update"
        | "result_published"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      registration_status: "pending" | "approved" | "rejected" | "cancelled"
      user_role: "ministry" | "ministry_admin" | "institution_admin" | "teacher" | "student" | "exam_body"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
