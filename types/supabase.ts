export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          email: string
          role: "user" | "underwriter" | "admin"
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          email: string
          role?: "user" | "underwriter" | "admin"
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          email?: string
          role?: "user" | "underwriter" | "admin"
        }
      }
      policies: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          policy_type: "auto" | "home" | "life"
          policy_number: string
          status: "active" | "pending" | "cancelled" | "expired"
          start_date: string
          end_date: string
          premium: number
          details: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          policy_type: "auto" | "home" | "life"
          policy_number: string
          status: "active" | "pending" | "cancelled" | "expired"
          start_date: string
          end_date: string
          premium: number
          details?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          policy_type?: "auto" | "home" | "life"
          policy_number?: string
          status?: "active" | "pending" | "cancelled" | "expired"
          start_date?: string
          end_date?: string
          premium?: number
          details?: Json
        }
      }
      claims: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          policy_id: string
          claim_number: string
          claim_type: string
          incident_date: string
          status: "submitted" | "processing" | "approved" | "denied" | "completed"
          amount: number | null
          description: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          policy_id: string
          claim_number: string
          claim_type: string
          incident_date: string
          status: "submitted" | "processing" | "approved" | "denied" | "completed"
          amount?: number | null
          description: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          policy_id?: string
          claim_number?: string
          claim_type?: string
          incident_date?: string
          status?: "submitted" | "processing" | "approved" | "denied" | "completed"
          amount?: number | null
          description?: string
        }
      }
    }
  }
}

