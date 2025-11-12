import { getSupabaseAdmin } from '@/lib/supabaseClient'

/**
 * List all buckets in Supabase to help diagnose setup
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    
    // List all buckets
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets()
    
    if (error) {
      return Response.json({ 
        error: error.message,
        buckets: [] 
      }, { status: 500 })
    }
    
    // For each bucket, try to list contents
    const bucketsWithContents = await Promise.all(
      (buckets || []).map(async (bucket) => {
        const { data: files } = await supabase
          .storage
          .from(bucket.name)
          .list('', { limit: 100 })
        
        return {
          name: bucket.name,
          id: bucket.id,
          public: bucket.public,
          fileCount: files?.length || 0,
          files: files?.map(f => f.name) || []
        }
      })
    )
    
    return Response.json({ 
      success: true,
      buckets: bucketsWithContents
    })
  } catch (error: any) {
    return Response.json({ 
      error: error.message 
    }, { status: 500 })
  }
}
