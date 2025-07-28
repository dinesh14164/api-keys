import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('api_keys')
      .select('count')
      .single()

    if (error) {
      console.error('Connection test failed:', error)
      return { success: false, error: error.message }
    }

    console.log('Supabase connection successful!')
    return { success: true, data }
  } catch (err) {
    console.error('Connection test error:', err)
    return { success: false, error: err.message }
  }
}

export async function testTableExists() {
  try {
    console.log('Testing if api_keys table exists...')
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Table test failed:', error)
      return { success: false, error: error.message }
    }

    console.log('api_keys table exists and is accessible!')
    return { success: true }
  } catch (err) {
    console.error('Table test error:', err)
    return { success: false, error: err.message }
  }
} 