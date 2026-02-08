import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(https://mtqduplgxszeqyqmrkfw.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10cWR1cGxneHN6ZXF5cW1ya2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyODc1MjksImV4cCI6MjA4NTg2MzUyOX0.QwK8QzUq9QkJUyHvKfPzk-PgTbljqXKvkkbLtDLEIjU)
