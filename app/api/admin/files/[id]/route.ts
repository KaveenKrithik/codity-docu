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
    return []
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Read existing files
    const files = await readFiles()

    // Find and remove the file
    const filteredFiles = files.filter((f: any) => f.id !== id)

    if (files.length === filteredFiles.length) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Save updated files
    await writeFiles(filteredFiles)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete file:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}

