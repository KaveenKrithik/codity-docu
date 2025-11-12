# Admin Dashboard - How Adding MDX Files Works

## Overview

The Admin Dashboard allows you to manage MDX documentation files through a web interface. Here's how the system works:

## How Adding MDX Files Works

### 1. **User Interface Flow**

When you click the "Add New File" button on the Admin Dashboard:

1. **Modal Opens**: A sleek modal appears with three input fields:
   - **Title**: The display name for your documentation page (e.g., "Getting Started")
   - **Slug**: The URL route where the page will be accessible (e.g., `/guides/new-guide`)
   - **Content**: The MDX/Markdown content for the page

2. **Form Submission**: When you fill in all fields and click "Add File":
   - The form data is validated (all fields must be filled)
   - A POST request is sent to `/api/admin/files` with the form data
   - The modal closes and the file list refreshes

### 2. **Backend API Processing**

The API route (`app/api/admin/files/route.ts`) handles the request:

```typescript
POST /api/admin/files
```

**Request Body:**
```json
{
  "title": "Getting Started",
  "slug": "/guides/new-guide",
  "content": "# Getting Started\n\nYour MDX content here..."
}
```

**What Happens:**
1. The API validates that all required fields (title, slug, content) are present
2. Currently, it creates a file object in memory (mock implementation)
3. Returns the created file with a unique ID and timestamp

### 3. **Current Implementation (Mock)**

**Note**: The current implementation is a **mock/prototype** that stores files in memory. This means:
- Files are not persisted to disk
- Files will be lost when the server restarts
- The file list shows mock data

### 4. **How to Make It Production-Ready**

To make this work with actual file persistence, you need to:

#### Option A: File System Storage

Update `app/api/admin/files/route.ts` to write to the file system:

```typescript
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const CONTENT_DIR = join(process.cwd(), 'content')

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, slug, content } = body

  // Ensure content directory exists
  await mkdir(CONTENT_DIR, { recursive: true })

  // Create file path from route slug
  const filePath = join(CONTENT_DIR, `${slug.replace(/^\//, '')}.mdx`)
  
  // Write MDX content to file
  await writeFile(filePath, content, 'utf-8')

  // Return success response
  return NextResponse.json({ 
    id: Date.now().toString(),
    slug,
    title,
    lastModified: new Date().toISOString()
  }, { status: 201 })
}
```

#### Option B: Database Storage

Store files in a database (e.g., PostgreSQL, MongoDB):

```typescript
// Example with Prisma
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, slug, content } = body

  const file = await prisma.mdxFile.create({
    data: {
      title,
      slug,
      content,
    }
  })

  return NextResponse.json(file, { status: 201 })
}
```

#### Option C: Dynamic Route Generation

Create Next.js pages dynamically from the stored files:

1. Store file metadata in a database or file system
2. Use Next.js dynamic routes or `generateStaticParams`
3. Read the MDX content when rendering the page

Example structure:
```
app/
  guides/
    [slug]/
      page.tsx  // Dynamic route that reads MDX from storage
```

### 5. **Preview Functionality**

The preview feature works by:

1. **Client-Side Rendering**: When you click "Preview" on a file card:
   - The file's MDX content is passed to the `MDXPreview` component
   - `MDXPreview` uses `next-mdx-remote` to serialize and render the MDX
   - The rendered content is displayed in a modal with the same styling as your documentation pages

2. **MDX Processing**: The content goes through:
   - Serialization (converting MDX string to renderable format)
   - Component mapping (using your custom MDX components)
   - Rendering with proper styling

### 6. **Delete Functionality**

When you click the delete button:

1. A confirmation dialog appears
2. If confirmed, a DELETE request is sent to `/api/admin/files/[id]`
3. The file is removed (currently from memory)
4. The file list refreshes

### 7. **Search Functionality**

The search bar filters files in real-time by:
- File title (case-insensitive)
- File slug (case-insensitive)
- Works entirely on the client-side for instant results

## Next Steps

To make this production-ready:

1. **Choose a storage solution** (file system, database, or CMS)
2. **Implement file persistence** in the API routes
3. **Add authentication/authorization** to protect the admin routes
4. **Set up file validation** (slug format, MDX syntax checking)
5. **Add edit functionality** to update existing files
6. **Implement file versioning** if needed
7. **Add file upload** for importing existing MDX files

## Security Considerations

⚠️ **Important**: Before deploying to production:

- Add authentication middleware to protect `/admin` routes
- Validate and sanitize user input (especially file paths)
- Prevent path traversal attacks (e.g., `../../../etc/passwd`)
- Rate limit API endpoints to prevent abuse
- Add file size limits for content
- Validate MDX syntax before saving

