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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border/30">
        <div>
          <h1 className="text-5xl font-bold mb-3 relative">
            <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
            <span className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-primary to-primary/0 rounded-full" />
          </h1>
          <p className="text-muted-foreground text-lg">Manage your documentation files</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all bg-primary/80 hover:bg-primary text-white border border-primary/40 hover:border-primary/60 shadow-sm hover:shadow-lg hover:shadow-primary/25 backdrop-blur-sm active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add New File
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border/30 bg-background/20 hover:bg-background/30 text-sm text-foreground placeholder:text-muted-foreground transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
        />
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="group relative p-6 rounded-xl border border-border/30 bg-background/40 hover:bg-background/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">{file.title}</h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4 font-mono bg-secondary/30 px-2 py-1 rounded border border-border/20 inline-block">{file.slug || file.path || 'N/A'}</p>
            <p className="text-sm text-muted-foreground mb-5 line-clamp-3 leading-relaxed">
              {file.content.substring(0, 120)}...
            </p>
            <div className="flex items-center gap-2 pt-4 border-t border-border/20">
              <button
                onClick={() => handlePreview(file)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50 backdrop-blur-sm hover:shadow-sm"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 hover:border-destructive/50 backdrop-blur-sm hover:shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-20 rounded-xl border border-border/30 bg-background/20 backdrop-blur-sm">
          <div className="p-4 rounded-full bg-muted/20 inline-flex mb-4">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-lg">No files found</p>
          {searchQuery && (
            <p className="text-sm text-muted-foreground/70 mt-2">Try a different search term</p>
          )}
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in-0">
          <div className="w-full max-w-4xl bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-background to-background/50">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-1">Add New MDX File</h2>
                <p className="text-sm text-muted-foreground">Create a new documentation page</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2.5 text-foreground">
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
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 border-dashed border-border/50 bg-background/20 hover:bg-background/40 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
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
                    className="mt-2 text-xs text-destructive hover:underline"
                  >
                    Remove file
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2.5 text-foreground">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Getting Started"
                  className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background/40 hover:bg-background/60 text-foreground placeholder:text-muted-foreground transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2.5 text-foreground">
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
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 border-dashed border-border/50 bg-background/20 hover:bg-background/40 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
                  >
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-sm">Click to upload images</span>
                  </label>
                </div>
                {imageFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground">{imageFiles.length} image(s) selected:</p>
                    <div className="flex flex-wrap gap-2">
                      {imageFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/20"
                        >
                          <span className="text-xs text-foreground">{file.name}</span>
                          <button
                            onClick={() => removeImage(index)}
                            className="text-destructive hover:text-destructive/80"
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
                <label className="block text-sm font-medium mb-2.5 text-foreground">
                  Content (MDX) {mdFile && <span className="text-xs text-muted-foreground">(loaded from file)</span>}
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="# Your Title&#10;&#10;Your content here..."
                  rows={15}
                  className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background/40 hover:bg-background/60 text-foreground placeholder:text-muted-foreground font-mono text-sm transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50 bg-gradient-to-r from-background/50 to-background">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all bg-transparent hover:bg-secondary/50 text-foreground border border-border/40 hover:border-border/60 backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all bg-primary/80 hover:bg-primary text-white border border-primary/40 hover:border-primary/60 shadow-sm hover:shadow-lg hover:shadow-primary/25 backdrop-blur-sm active:scale-95"
              >
                Add File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in-0">
          <div className="w-full max-w-4xl bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-background to-background/50">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-1">{previewTitle}</h2>
                <p className="text-sm text-muted-foreground">Preview</p>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <MDXPreview source={previewContent} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

