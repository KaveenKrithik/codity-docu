import { MDXContent } from '@/lib/mdx'
import { fetchAllDocs, downloadMdxContent } from '@/lib/docOperations'

export const revalidate = 0 // Disable caching to always fetch fresh data

export default async function DocumentationPage() {
  try {
    // Fetch all documents from Supabase
    const docs = await fetchAllDocs()
    
    if (docs.length === 0) {
      // No documents uploaded yet
      return (
        <div className="max-w-4xl mx-auto">
          <MDXContent source="# Documentation\n\nNo documents have been uploaded yet. Please use the admin panel to add content." />
        </div>
      )
    }

    // Combine all MDX content from all documents
    let combinedContent = ''
    
    for (const doc of docs) {
      try {
        const content = await downloadMdxContent(doc.file_path)
        combinedContent += content + '\n\n---\n\n'
      } catch (error) {
        console.error(`Failed to load content for ${doc.slug}:`, error)
      }
    }

    // If no content was loaded, show error
    if (!combinedContent.trim()) {
      return (
        <div className="max-w-4xl mx-auto">
          <MDXContent source="# Error\n\nFailed to load documentation content." />
        </div>
      )
    }

    return (
      <div className="max-w-4xl mx-auto">
        <MDXContent source={combinedContent} />
      </div>
    )
  } catch (error) {
    console.error('Error loading documentation:', error)
    return (
      <div className="max-w-4xl mx-auto">
        <MDXContent source="# Error\n\nFailed to load documentation. Please try again later." />
      </div>
    )
  }
}

