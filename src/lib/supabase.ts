
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qmhniutoisfrewynrmun.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtaG5pdXRvaXNmcmV3eW5ybXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjU5MjEsImV4cCI6MjA2NDcwMTkyMX0.Ff2ej-xSv-ov23HUYmYxcvaXdVyAYHMSR24WOGPYfG8'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Term {
  id: string
  english_term: string
  arabic_term?: string
  description_en?: string
  description_ar?: string
  category?: string
  status: 'approved' | 'pending' | 'rejected'
  created_at: string
  updated_at?: string
}

export interface Suggestion {
  id: string
  term_id: string
  suggested_arabic_term: string
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  admin_notes?: string
}

export interface Comment {
  id: string
  term_id: string
  comment: string
  created_at: string
}

export interface Profile {
  id: string
  email?: string
  full_name?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at?: string
}
