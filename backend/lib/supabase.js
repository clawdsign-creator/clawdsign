const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase credentials. ' +
    'Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel environment variables.'
  )
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = { supabase }
