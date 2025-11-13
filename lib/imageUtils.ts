/**
 * Process MDX content to replace relative image paths with Supabase URLs
 */
export function processImagePaths(mdxContent: string, slug: string, supabaseUrl: string): string {
  const bucketName = 'DOCUMENTATIONS and BLOGS'
  
  // Replace markdown image syntax: ![alt](./images/image.png) or ![alt](images/image.png)
  let processed = mdxContent.replace(
    /!\[([^\]]*)\]\(\.?\/?(images\/[^)]+)\)/g,
    (match, alt, imagePath) => {
      // Try document-specific images first: DOCUMENTATION/slug/images/...
      const docSpecificPath = `DOCUMENTATION/${slug}/${imagePath}`
      const docSpecificUrl = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucketName)}/${docSpecificPath}`
      
      // Also try root-level images: images/...
      const rootPath = imagePath
      const rootUrl = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucketName)}/${rootPath}`
      
      // For now, try document-specific path first
      return `![${alt}](${docSpecificUrl})`
    }
  )
  
  // Also handle HTML img tags: <img src="./images/image.png" />
  processed = processed.replace(
    /<img\s+([^>]*?)src=["']\.?\/?images\/([^"']+)["']([^>]*?)>/g,
    (match, before, imagePath, after) => {
      const docSpecificPath = `DOCUMENTATION/${slug}/images/${imagePath}`
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucketName)}/${docSpecificPath}`
      return `<img ${before}src="${publicUrl}"${after}>`
    }
  )
  
  // Handle direct image references without the images/ prefix (e.g., /fig1.png)
  processed = processed.replace(
    /!\[([^\]]*)\]\(\/([^/][^)]+)\)/g,
    (match, alt, imageName) => {
      // Check if it's an image file
      if (/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(imageName)) {
        // Try root-level images folder
        const rootPath = `images/${imageName}`
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucketName)}/${rootPath}`
        return `![${alt}](${publicUrl})`
      }
      return match
    }
  )
  
  return processed
}
