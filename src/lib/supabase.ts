
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qmhniutoisfrewynrmun.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtaG5pdXRvaXNmcmV3eW5ybXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjU5MjEsImV4cCI6MjA2NDcwMTkyMX0.Ff2ej-xSv-ov23HUYmYxcvaXdVyAYHMSR24WOGPYfG8'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Word {
  id: number
  english_term: string
  arabic_translation: string
  definition_english?: string
  definition_arabic?: string
  category?: string
  status: 'approved' | 'pending' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Suggestion {
  id: number
  english_term: string
  suggested_arabic: string
  definition_english?: string
  definition_arabic?: string
  category?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface Comment {
  id: number
  word_id: number
  comment_text: string
  language: 'en' | 'ar'
  created_at: string
}
