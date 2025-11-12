import { MDXContent } from '@/lib/mdx'
import { fetchAllDocs, downloadMdxContent } from '@/lib/docOperations'

export const revalidate = 0 // Disable caching to always fetch fresh data

export default async function DocumentationPage() {
  try {
    // Fetch all documents from Supabase
    const docs = await fetchAllDocs()
    
    // Combine all MDX content
    let combinedContent = ''
    
    if (docs.length > 0) {
      // Fetch content for each document
      for (const doc of docs) {
        try {
          const content = await downloadMdxContent(doc.file_path)
          combinedContent += content + '\n\n'
        } catch (error) {
          console.error(`Failed to load content for ${doc.slug}:`, error)
        }
      }
    } else {
      // Fallback content if no docs exist
      combinedContent = `# Documentation

Welcome to the Codity Documentation.

No documentation has been uploaded yet. Please use the admin panel to add content.`
    }

    return (
      <div className="max-w-4xl mx-auto">
        <MDXContent content={combinedContent} />
      </div>
    )
  } catch (error) {
    console.error('Error loading documentation:', error)
    return (
      <div className="max-w-4xl mx-auto">
        <MDXContent content={`# Error

Failed to load documentation. Please try again later.`} />
      </div>
    )
  }
}

