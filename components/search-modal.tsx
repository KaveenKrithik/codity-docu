'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, X, FileText, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Documentation data from Codity's actual documentation
const docs = [
  { title: 'Introduction', href: '/documentation', content: 'Welcome to Codity documentation' },
  { title: 'Getting Started', href: '/getting-started', content: 'Get started with Codity by connecting repositories and configuring settings' },
  { title: 'PR Reviews', href: '/guides/pr-reviews', content: 'Learn how Codity helps streamline your Pull Request and Merge Request review process' },
  { title: 'JIRA Integration', href: '/guides/jira-integration', content: 'Connect JIRA to automatically extract ticket requirements and verify acceptance criteria' },
  { title: 'Code Navigation', href: '/guides/code-navigation', content: 'AI-powered codebase assistant for understanding code and finding implementations' },
  { title: 'Best Practices', href: '/guides/best-practices', content: 'Recommended practices for using Codity effectively' },
  { title: 'Troubleshooting', href: '/guides/troubleshooting', content: 'Common issues and solutions when using Codity' },
  { title: 'API Overview', href: '/api', content: 'Complete API reference guide' },
  { title: 'Authentication', href: '/api/authentication', content: 'Learn how to authenticate API requests' },
  { title: 'Endpoints', href: '/api/endpoints', content: 'All available API endpoints' },
  { title: 'Webhooks', href: '/api/webhooks', content: 'Set up and manage webhooks' },
]

const fuse = new Fuse(docs, {
  keys: ['title', 'content'],
  threshold: 0.3,
  includeScore: true,
})

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const results = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).slice(0, 8)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) {
          onClose()
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSelect = (href: string) => {
    router.push(href)
    onClose()
    setQuery('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center px-5 border-b border-border/50 bg-secondary/20">
                <Search className="h-5 w-5 text-muted-foreground mr-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search documentation..."
                  className="flex-1 py-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="ml-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {query.trim() && results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result, index) => (
                      <motion.button
                        key={result.item.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelect(result.item.href)}
                        className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl hover:bg-secondary/50 transition-all text-left group border border-transparent hover:border-border/30 hover:shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <div>
                            <div className="font-medium text-foreground">
                              {result.item.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {result.item.content}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </motion.button>
                    ))}
                  </div>
                ) : query.trim() ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No results found for &quot;{query}&quot;
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    Start typing to search...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

