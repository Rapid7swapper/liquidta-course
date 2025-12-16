export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'owner' | 'admin' | 'employee'
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'employee'
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'employee'
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          title: string
          description: string | null
          position: number
          is_published: boolean
          course_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          position: number
          is_published?: boolean
          course_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          position?: number
          is_published?: boolean
          course_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          description: string | null
          video_url: string | null
          position: number
          is_published: boolean
          is_free: boolean
          module_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          video_url?: string | null
          position: number
          is_published?: boolean
          is_free?: boolean
          module_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          video_url?: string | null
          position?: number
          is_published?: boolean
          is_free?: boolean
          module_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          name: string
          url: string
          type: 'pdf' | 'video' | 'link' | 'file'
          lesson_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          type: 'pdf' | 'video' | 'link' | 'file'
          lesson_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          type?: 'pdf' | 'video' | 'link' | 'file'
          lesson_id?: string
          created_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          module_id: string
          passing_score: number
          max_attempts: number | null
          time_limit_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          passing_score?: number
          max_attempts?: number | null
          time_limit_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          passing_score?: number
          max_attempts?: number | null
          time_limit_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          text: string
          type: 'multiple_choice' | 'true_false' | 'multiple_select'
          position: number
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          text: string
          type: 'multiple_choice' | 'true_false' | 'multiple_select'
          position: number
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          text?: string
          type?: 'multiple_choice' | 'true_false' | 'multiple_select'
          position?: number
          points?: number
          created_at?: string
        }
      }
      question_options: {
        Row: {
          id: string
          question_id: string
          text: string
          is_correct: boolean
          position: number
        }
        Insert: {
          id?: string
          question_id: string
          text: string
          is_correct?: boolean
          position: number
        }
        Update: {
          id?: string
          question_id?: string
          text?: string
          is_correct?: boolean
          position?: number
        }
      }
      quiz_attempts: {
        Row: {
          id: string
          quiz_id: string
          user_id: string
          score: number
          passed: boolean
          answers: Json
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          quiz_id: string
          user_id: string
          score: number
          passed: boolean
          answers: Json
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          quiz_id?: string
          user_id?: string
          score?: number
          passed?: boolean
          answers?: Json
          started_at?: string
          completed_at?: string | null
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          organization_id: string | null
          enrolled_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          organization_id?: string | null
          enrolled_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          organization_id?: string | null
          enrolled_at?: string
          completed_at?: string | null
        }
      }
      lesson_progress: {
        Row: {
          id: string
          lesson_id: string
          enrollment_id: string
          is_completed: boolean
          watched_seconds: number
          total_seconds: number
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          enrollment_id: string
          is_completed?: boolean
          watched_seconds?: number
          total_seconds?: number
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          enrollment_id?: string
          is_completed?: boolean
          watched_seconds?: number
          total_seconds?: number
          completed_at?: string | null
          updated_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          enrollment_id: string
          certificate_id: string
          issued_at: string
        }
        Insert: {
          id?: string
          enrollment_id: string
          certificate_id?: string
          issued_at?: string
        }
        Update: {
          id?: string
          enrollment_id?: string
          certificate_id?: string
          issued_at?: string
        }
      }
      users: {
        Row: {
          id: string
          clerk_id: string | null
          email: string
          first_name: string
          last_name: string
          role: 'student' | 'admin' | 'super_admin'
          created_by: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id?: string | null
          email: string
          first_name: string
          last_name: string
          role?: 'student' | 'admin' | 'super_admin'
          created_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string | null
          email?: string
          first_name?: string
          last_name?: string
          role?: 'student' | 'admin' | 'super_admin'
          created_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      member_role: 'owner' | 'admin' | 'employee'
      resource_type: 'pdf' | 'video' | 'link' | 'file'
      question_type: 'multiple_choice' | 'true_false' | 'multiple_select'
      user_role: 'student' | 'admin' | 'super_admin'
    }
  }
}

export type UserRole = 'student' | 'admin' | 'super_admin'
export type User = Database['public']['Tables']['users']['Row']

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
