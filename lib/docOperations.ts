import { getSupabaseAdmin } from './supabaseClient'

/**
 * Convert Markdown to MDX format
 * Currently a simple pass-through, but can be extended with transformations
 */
export function convertMdToMdx(mdContent: string): string {
  // Add any specific MD to MDX transformations here
  // For now, we'll just ensure it's valid MDX
  return mdContent
}

/**
 * Generate a slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .trim()
}

interface UploadDocParams {
  title: string
  mdContent: string
  images?: File[] // Array of image files
}

/**
 * Replace image paths in MDX content with Supabase public URLs
 */
function replaceImagePathsWithUrls(mdxContent: string, slug: string, supabaseUrl: string): string {
  const bucketName = 'DOCUMENTATIONS and BLOGS'
  
  // Replace all markdown image references: ![alt](anything/with/path.png)
  // We just extract the filename and construct the correct Supabase URL
  return mdxContent.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, imagePath) => {
      // Skip if already a full URL
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return match;
      }

      // Extract just the filename from the path
      // Handles: "Codity ai/Screenshot.png", "Codity%20ai/Screenshot.png", 
      //          "./images/Screenshot.png", "images/Screenshot.png", "Screenshot.png"
      let filename = imagePath;
      
      // Remove any folder prefix
      if (filename.includes('/')) {
        const parts = filename.split('/');
        filename = parts[parts.length - 1]; // Get the last part (actual filename)
      }
      
      // Decode URL encoding if present (e.g., %20 -> space)
      filename = decodeURIComponent(filename);
      
      // Replace spaces with underscores (files are stored with underscores in Supabase)
      filename = filename.replace(/\s+/g, '_');

      // Construct the Supabase public URL
      // Encode each path component separately
      const bucketPath = encodeURIComponent(bucketName);
      const storagePath = `DOCUMENTATION/${slug}/images/${encodeURIComponent(filename)}`;
      const imageUrl = `${supabaseUrl}/storage/v1/object/public/${bucketPath}/${storagePath}`;

      return `![${alt}](${imageUrl})`;
    }
  );
}


/**
 * Upload a new document with optional images to Supabase
 * Creates the folder structure: docs/MDNAME/index.mdx and docs/MDNAME/images/
 */
export async function uploadDoc({ title, mdContent, images = [] }: UploadDocParams) {
  const supabase = getSupabaseAdmin()
  const slug = generateSlug(title)
  let mdxContent = convertMdToMdx(mdContent)
  
  try {
    // 1. Check if a doc with this slug already exists
    const { data: existingDoc } = await supabase
      .from('docs')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (existingDoc) {
      throw new Error(`A document with slug "${slug}" already exists`)
    }

    // 2. Upload images first to ensure they're available
    const imageUrls: string[] = []
    if (images.length > 0) {
      for (const image of images) {
        const imagePath = `DOCUMENTATION/${slug}/images/${image.name}`
        const { error: imageError } = await supabase.storage
          .from('DOCUMENTATIONS and BLOGS')
          .upload(imagePath, image, {
            contentType: image.type,
            upsert: false
          })

        if (imageError) {
          console.error(`Failed to upload image ${image.name}:`, imageError)
          // Continue with other images even if one fails
        } else {
          imageUrls.push(imagePath)
        }
      }
    }

    // 3. Replace image paths in MDX content with Supabase public URLs
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    mdxContent = replaceImagePathsWithUrls(mdxContent, slug, supabaseUrl)

    // 4. Upload the MDX file to storage (after processing image paths)
    const mdxFilePath = `DOCUMENTATION/${slug}/index.mdx`
    const { error: mdxError } = await supabase.storage
      .from('DOCUMENTATIONS and BLOGS')
      .upload(mdxFilePath, new Blob([mdxContent], { type: 'text/markdown' }), {
        contentType: 'text/markdown',
        upsert: false
      })

    if (mdxError) {
      throw new Error(`Failed to upload MDX file: ${mdxError.message}`)
    }

    // 5. Create database entry
    const { data: newDoc, error: dbError } = await supabase
      .from('docs')
      .insert({
        title,
        slug,
        file_path: mdxFilePath
      })
      .select()
      .single()

      if (dbError) {
      // Rollback: Delete uploaded files if database insert fails
      await supabase.storage.from('DOCUMENTATIONS and BLOGS').remove([mdxFilePath, ...imageUrls])
      throw new Error(`Failed to create database entry: ${dbError.message}`)
    }    return {
      success: true,
      doc: newDoc,
      imageCount: imageUrls.length
    }
  } catch (error) {
    console.error('Upload doc error:', error)
    throw error
  }
}

interface EditDocParams {
  id: string
  title?: string
  mdContent?: string
  images?: File[] // New images to add
}

/**
 * Edit an existing document
 * Updates the MDX content and/or adds new images
 */
export async function editDoc({ id, title, mdContent, images = [] }: EditDocParams) {
  const supabase = getSupabaseAdmin()
  
  try {
    // 1. Get existing document
    const { data: existingDoc, error: fetchError } = await supabase
      .from('docs')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingDoc) {
      throw new Error('Document not found')
    }

    const updates: any = { updated_at: new Date().toISOString() }
    let newSlug = existingDoc.slug

    // 2. If title is being updated, generate new slug
    if (title && title !== existingDoc.title) {
      newSlug = generateSlug(title)
      
      // Check if new slug conflicts with another doc
      const { data: conflictDoc } = await supabase
        .from('docs')
        .select('id')
        .eq('slug', newSlug)
        .neq('id', id)
        .single()
      
      if (conflictDoc) {
        throw new Error(`A document with slug "${newSlug}" already exists`)
      }

      updates.title = title
      updates.slug = newSlug

      // Move files to new folder if slug changed
      if (newSlug !== existingDoc.slug) {
        const oldPrefix = `DOCUMENTATION/${existingDoc.slug}/`
        const newPrefix = `DOCUMENTATION/${newSlug}/`
        
        // List all files in old location
        const { data: files } = await supabase.storage
          .from('DOCUMENTATIONS and BLOGS')
          .list(`DOCUMENTATION/${existingDoc.slug}`, { limit: 100 })

        // Copy files to new location
        if (files) {
          for (const file of files) {
            const oldPath = `${oldPrefix}${file.name}`
            const newPath = `${newPrefix}${file.name}`
            
            // Download and re-upload (Supabase doesn't have move operation)
            const { data: fileData } = await supabase.storage
              .from('DOCUMENTATIONS and BLOGS')
              .download(oldPath)
            
            if (fileData) {
              await supabase.storage.from('DOCUMENTATIONS and BLOGS').upload(newPath, fileData, { upsert: true })
            }
          }
        }

        // Delete old folder
        await supabase.storage.from('DOCUMENTATIONS and BLOGS').remove([oldPrefix])
        updates.file_path = `DOCUMENTATION/${newSlug}/index.mdx`
      }
    }

    // 3. Update MDX content if provided
    if (mdContent) {
      let mdxContent = convertMdToMdx(mdContent)
      
      // Replace image paths with Supabase public URLs
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      mdxContent = replaceImagePathsWithUrls(mdxContent, newSlug, supabaseUrl)
      
      const mdxFilePath = `DOCUMENTATION/${newSlug}/index.mdx`
      
      const { error: uploadError } = await supabase.storage
        .from('DOCUMENTATIONS and BLOGS')
        .upload(mdxFilePath, new Blob([mdxContent], { type: 'text/markdown' }), {
          contentType: 'text/markdown',
          upsert: true
        })

      if (uploadError) {
        throw new Error(`Failed to update MDX file: ${uploadError.message}`)
      }
    }

    // 4. Upload new images if any
    if (images.length > 0) {
      for (const image of images) {
        const imagePath = `DOCUMENTATION/${newSlug}/images/${image.name}`
        await supabase.storage
          .from('DOCUMENTATIONS and BLOGS')
          .upload(imagePath, image, {
            contentType: image.type,
            upsert: true
          })
      }
    }

    // 5. Update database entry
    const { data: updatedDoc, error: updateError } = await supabase
      .from('docs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Failed to update database entry: ${updateError.message}`)
    }

    return {
      success: true,
      doc: updatedDoc
    }
  } catch (error) {
    console.error('Edit doc error:', error)
    throw error
  }
}

/**
 * Delete a document and all its associated files
 */
export async function deleteDoc(id: string) {
  const supabase = getSupabaseAdmin()
  
  try {
    // 1. Get document to find its files
    const { data: doc, error: fetchError } = await supabase
      .from('docs')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !doc) {
      throw new Error('Document not found')
    }

    // 2. Delete all files in the document's folder
    const folderPath = `DOCUMENTATION/${doc.slug}`
    
    // List all files recursively
    const { data: files } = await supabase.storage
      .from('DOCUMENTATIONS and BLOGS')
      .list(folderPath, { limit: 100 })

    // List files in images subfolder
    const { data: imageFiles } = await supabase.storage
      .from('DOCUMENTATIONS and BLOGS')
      .list(`${folderPath}/images`, { limit: 100 })

    const filesToDelete: string[] = []
    
    if (files) {
      filesToDelete.push(...files.map(f => `${folderPath}/${f.name}`))
    }
    
    if (imageFiles) {
      filesToDelete.push(...imageFiles.map(f => `${folderPath}/images/${f.name}`))
    }

    // Delete all files
    if (filesToDelete.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from('DOCUMENTATIONS and BLOGS')
        .remove(filesToDelete)

      if (deleteError) {
        console.error('Failed to delete some files:', deleteError)
      }
    }

    // 3. Delete database entry
    const { error: dbDeleteError } = await supabase
      .from('docs')
      .delete()
      .eq('id', id)

    if (dbDeleteError) {
      throw new Error(`Failed to delete database entry: ${dbDeleteError.message}`)
    }

    return {
      success: true,
      message: 'Document deleted successfully'
    }
  } catch (error) {
    console.error('Delete doc error:', error)
    throw error
  }
}

/**
 * Fetch all documents from the database
 */
export async function fetchAllDocs() {
  const supabase = getSupabaseAdmin()
  
  try {
    const { data: docs, error } = await supabase
      .from('docs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`)
    }

    return docs || []
  } catch (error) {
    console.error('Fetch docs error:', error)
    throw error
  }
}

/**
 * Fetch a single document by slug
 */
export async function fetchDocBySlug(slug: string) {
  const supabase = getSupabaseAdmin()
  
  try {
    const { data: doc, error } = await supabase
      .from('docs')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      throw new Error(`Failed to fetch document: ${error.message}`)
    }

    return doc
  } catch (error) {
    console.error('Fetch doc by slug error:', error)
    throw error
  }
}

/**
 * Download MDX content from Supabase Storage
 */
export async function downloadMdxContent(filePath: string): Promise<string> {
  const supabase = getSupabaseAdmin()
  
  try {
    const { data, error } = await supabase.storage
      .from('DOCUMENTATIONS and BLOGS')
      .download(filePath)

    if (error) {
      throw new Error(`Failed to download MDX file: ${error.message}`)
    }

    const text = await data.text()
    return text
  } catch (error) {
    console.error('Download MDX error:', error)
    throw error
  }
}

/**
 * Fetch content for a specific section/category by slug
 * Returns the MDX content or a fallback message
 */
export async function fetchSectionContent(slug: string, fallbackContent: string): Promise<string> {
  try {
    const doc = await fetchDocBySlug(slug)
    if (doc && doc.file_path) {
      return await downloadMdxContent(doc.file_path)
    }
    return fallbackContent
  } catch (error) {
    console.error(`Error fetching content for ${slug}:`, error)
    return fallbackContent
  }
}
