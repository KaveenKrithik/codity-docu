import { testSupabaseConnection } from '@/lib/testSupabase'

export async function GET() {
  try {
    const success = await testSupabaseConnection()
    return Response.json({ 
      success,
      message: success ? 'Supabase connection successful' : 'Connection failed - check server logs'
    })
  } catch (error: any) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
