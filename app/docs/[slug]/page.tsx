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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">{doc.title}</h1>
          <MDXContent source={mdxContent} />
        </article>
        
        <div className="mt-12 pt-6 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(doc.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading doc:', error)
    notFound()
  }
}
