import { notFound } from 'next/navigation'
import { fetchDocBySlug, downloadMdxContent } from '@/lib/docOperations'
import { MDXContent } from '@/lib/mdx'

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
 * Note: Image paths are already processed during upload to use Supabase public URLs
 */
export default async function DocsPage({ params }: PageProps) {
  try {
    // Fetch document metadata
    const doc = await fetchDocBySlug(params.slug)
    
    if (!doc) {
      notFound()
    }

    // Download MDX content from Supabase Storage
    const mdxContent = await downloadMdxContent(doc.file_path)

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
