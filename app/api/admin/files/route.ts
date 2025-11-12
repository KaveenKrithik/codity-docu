import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const DATA_DIR = join(process.cwd(), 'data')
const FILES_JSON = join(DATA_DIR, 'mdx-files.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true })
    }
  } catch (error) {
    console.error('Failed to create data directory:', error)
  }
}

// Read files from JSON
async function readFiles() {
  try {
    await ensureDataDir()
    if (existsSync(FILES_JSON)) {
      const data = await readFile(FILES_JSON, 'utf-8')
      return JSON.parse(data)
    }
    // Return initial mock data if file doesn't exist
    return [
      {
        id: '1',
        slug: '/documentation',
        title: 'Documentation',
        content: '# Documentation\n\nWelcome to Codity Documentation.',
        lastModified: new Date().toISOString(),
      },
      {
        id: '2',
        slug: '/getting-started',
        title: 'Getting Started',
        content: '# Getting Started\n\nGet up and running with Codity.',
        lastModified: new Date().toISOString(),
      },
    ]
  } catch (error) {
    console.error('Failed to read files:', error)
    return []
  }
}

// Write files to JSON
async function writeFiles(files: any[]) {
  try {
    await ensureDataDir()
    await writeFile(FILES_JSON, JSON.stringify(files, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write files:', error)
    throw error
  }
}

export async function GET() {
  try {
    const files = await readFiles()
    return NextResponse.json(files)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load files' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Read existing files
    const files = await readFiles()

    // Check if file with same slug already exists
    const existingFile = files.find((f: any) => f.slug === slug)
    if (existingFile) {
      return NextResponse.json(
        { error: 'A file with this slug already exists' },
        { status: 400 }
      )
    }

    // Create new file
    const newFile = {
      id: Date.now().toString(),
      slug,
      title,
      content,
      lastModified: new Date().toISOString(),
    }

    // Add to files array and save
    files.push(newFile)
    await writeFiles(files)

    return NextResponse.json(newFile, { status: 201 })
  } catch (error) {
    console.error('Failed to create file:', error)
    return NextResponse.json(
      { error: 'Failed to create file' },
      { status: 500 }
    )
  }
}

