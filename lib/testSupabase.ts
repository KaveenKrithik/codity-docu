import { getSupabaseAdmin } from './supabaseClient'

/**
 * Test Supabase Connection
 * Run this to verify your Supabase setup is working
 */
export async function testSupabaseConnection() {
  try {
    const supabase = getSupabaseAdmin()
    
    console.log('🔍 Testing Supabase connection...')
    
    // Test 1: Check database connection
    console.log('\n📊 Test 1: Database Connection')
    const { data: docs, error: dbError } = await supabase
      .from('docs')
      .select('*')
      .limit(1)
    
    if (dbError) {
      console.error('❌ Database Error:', dbError.message)
      return false
    }
    console.log('✅ Database connected successfully')
    console.log(`   Found ${docs?.length || 0} document(s)`)
    
    // Test 2: Check storage bucket
    console.log('\n📦 Test 2: Storage Bucket')
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets()
    
    if (bucketError) {
      console.error('❌ Storage Error:', bucketError.message)
      return false
    }
    
    const docsBucket = buckets?.find(b => b.name === 'DOCUMENTATIONS and BLOGS')
    if (!docsBucket) {
      console.error('❌ Bucket "DOCUMENTATIONS and BLOGS" not found')
      return false
    }
    console.log('✅ Storage bucket "DOCUMENTATIONS and BLOGS" found')
    
    // Test 3: Check DOCUMENTATION folder
    console.log('\n📁 Test 3: DOCUMENTATION Folder')
    const { data: folders, error: folderError } = await supabase
      .storage
      .from('DOCUMENTATIONS and BLOGS')
      .list('DOCUMENTATION', { limit: 10 })
    
    if (folderError) {
      console.error('❌ Folder Error:', folderError.message)
      console.log('   Note: This is expected if DOCUMENTATION folder is empty')
    } else {
      console.log('✅ DOCUMENTATION folder accessible')
      console.log(`   Found ${folders?.length || 0} item(s)`)
      if (folders && folders.length > 0) {
        folders.forEach(f => console.log(`   - ${f.name}`))
      }
    }
    
    console.log('\n✨ All tests passed! Supabase is ready to use.')
    return true
    
  } catch (error: any) {
    console.error('\n❌ Connection Test Failed:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check your .env.local file has correct credentials')
    console.error('2. Verify the "docs" table exists in Supabase')
    console.error('3. Verify the "DOCUMENTATIONS and BLOGS" bucket exists in Storage')
    console.error('4. Restart your dev server after updating .env.local')
    return false
  }
}

// Export a version that can be called from the API route
export async function GET() {
  const success = await testSupabaseConnection()
  return Response.json({ success })
}
