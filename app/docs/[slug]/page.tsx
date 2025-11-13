import { notFound } from 'next/navigation'
import { fetchDocBySlug, downloadMdxContent } from '@/lib/docOperations'
import { MDXContent } from '@/lib/mdx'
import { processImagePaths } from '@/lib/imageUtils'

interface PageProps {
  params: {
    slug: string
  }
}

/**
 * Generate static paths for all docs (optional - for static generation)
 */
export async function generateStaticParams() {
  try {
    const { fetchAllDocs } = await import('@/lib/docOperations')
    const docs = await fetchAllDocs()
    
    return docs.map((doc) => ({
      slug: doc.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PageProps) {
  try {
    const doc = await fetchDocBySlug(params.slug)
    
    return {
      title: doc.title,
      description: `${doc.title} - Codity Documentation`,
    }
  } catch (error) {
    return {
      title: 'Not Found',
    }
  }
}

/**
 * Dynamic docs page that renders MDX from Supabase
 */
export default async function DocsPage({ params }: PageProps) {
  try {
    // Fetch document metadata
    const doc = await fetchDocBySlug(params.slug)
    
    if (!doc) {
      notFound()
    }

    // Download MDX content from Supabase Storage
    let mdxContent = await downloadMdxContent(doc.file_path)
    
    // Process image paths to use Supabase URLs
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    mdxContent = processImagePaths(mdxContent, params.slug, supabaseUrl)

    return (
      <div className="w-full px-8 py-8">
        <MDXContent source={mdxContent} />
      </div>
    )
  } catch (error) {
    console.error('Error loading doc:', error)
    notFound()
  }
}
