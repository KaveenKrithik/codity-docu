'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Eye, FileText, Search, X, Upload, Image as ImageIcon } from 'lucide-react'
import { MDXPreview } from '@/components/mdx-preview'

interface MDXFile {
  id: string
  slug?: string
  path?: string // Legacy support for old files
  title: string
  content: string
  lastModified: string
}

export default function AdminPage() {
  const [files, setFiles] = useState<MDXFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState<MDXFile | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
  })
  const [mdFile, setMdFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/admin/files')
      if (response.ok) {
        const data = await response.json()
        setFiles(data)
      }
    } catch (error) {
      console.error('Failed to load files:', error)
    }
  }

  const handleAdd = async () => {
    if (!formData.title || !formData.content) {
      alert('Please provide a title and content')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      
      // Add MD file if uploaded
      if (mdFile) {
        formDataToSend.append('mdFile', mdFile)
      }
      
      // Add image files
      imageFiles.forEach((image, index) => {
        formDataToSend.append(`image_${index}`, image)
      })

      const response = await fetch('/api/admin/files', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        await loadFiles()
        setIsAddModalOpen(false)
        setFormData({ title: '', slug: '', content: '' })
        setMdFile(null)
        setImageFiles([])
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add file')
      }
    } catch (error) {
      console.error('Failed to add file:', error)
      alert('Failed to add file. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const response = await fetch(`/api/admin/files/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadFiles()
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  const handlePreview = (file: MDXFile) => {
    setPreviewContent(file.content)
    setPreviewTitle(file.title)
    setIsPreviewModalOpen(true)
  }

  const handleMdFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith('.md')) {
      setMdFile(file)
      // Read the file content
      const content = await file.text()
      setFormData({ ...formData, content })
      
      // Auto-generate title from filename if not set
      if (!formData.title) {
        const title = file.name.replace('.md', '').replace(/-/g, ' ').replace(/_/g, ' ')
        setFormData({ ...formData, title, content })
      }
    } else {
      alert('Please select a .md file')
    }
  }

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    setImageFiles(prev => [...prev, ...imageFiles])
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const filteredFiles = files.filter((file) => {
    const title = file.title?.toLowerCase() || ''
    const slug = (file.slug || file.path || '').toLowerCase()
    const query = searchQuery.toLowerCase()
    return title.includes(query) || slug.includes(query)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Manage your documentation files</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New File
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-400 hover:bg-white/10 hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
        />
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="group relative p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20">
                  <FileText className="h-4 w-4 text-blue-500" />
                </div>
                <h3 className="font-medium text-white text-base">{file.title}</h3>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3 font-mono bg-white/5 px-2 py-0.5 rounded inline-block">{file.slug || file.path || 'N/A'}</p>
            <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
              {file.content.substring(0, 100)}...
            </p>
            <div className="flex items-center gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => handlePreview(file)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/30 transition-colors"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-16 rounded-lg bg-white/5 border border-white/10">
          <div className="p-3 rounded-full bg-white/5 inline-flex mb-3">
            <FileText className="h-10 w-10 text-gray-500" />
          </div>
          <p className="text-gray-400 text-base">No files found</p>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
          )}
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-3xl bg-black/95 border border-white/10 rounded-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-semibold text-white">Add New MDX File</h2>
                <p className="text-sm text-gray-400 mt-0.5">Create a new documentation page</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Upload Markdown File (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".md"
                    onChange={handleMdFileChange}
                    className="hidden"
                    id="md-file-input"
                  />
                  <label
                    htmlFor="md-file-input"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer transition-all"
                  >
                    <Upload className="h-5 w-5" />
                    <span className="text-sm">
                      {mdFile ? mdFile.name : 'Click to upload .md file'}
                    </span>
                  </label>
                </div>
                {mdFile && (
                  <button
                    onClick={() => {
                      setMdFile(null)
                      setFormData({ ...formData, content: '' })
                    }}
                    className="mt-2 text-xs text-red-400 hover:underline"
                  >
                    Remove file
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Getting Started"
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-gray-500 hover:bg-white/10 hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Upload Images (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFilesChange}
                    className="hidden"
                    id="image-files-input"
                  />
                  <label
                    htmlFor="image-files-input"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer transition-all"
                  >
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-sm">Click to upload images</span>
                  </label>
                </div>
                {imageFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-400">{imageFiles.length} image(s) selected:</p>
                    <div className="flex flex-wrap gap-2">
                      {imageFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/10"
                        >
                          <span className="text-xs text-white">{file.name}</span>
                          <button
                            onClick={() => removeImage(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Content (MDX) {mdFile && <span className="text-xs text-gray-400">(loaded from file)</span>}
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="# Your Title&#10;&#10;Your content here..."
                  rows={12}
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-gray-500 font-mono text-sm hover:bg-white/10 hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-white/10">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-md text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Add File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-3xl bg-black/95 border border-white/10 rounded-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-semibold text-white">{previewTitle}</h2>
                <p className="text-sm text-gray-400 mt-0.5">Preview</p>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <MDXPreview source={previewContent} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

