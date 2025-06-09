
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

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

export interface EditSuggestion {
  id: string
  term_id: string
  user_id: string
  suggested_english_term?: string
  suggested_arabic_term?: string
  suggested_description_en?: string
  suggested_description_ar?: string
  change_reason?: string
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
