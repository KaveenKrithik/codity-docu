'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText,
  Settings,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Doc {
  id: string
  title: string
  slug: string
  file_path: string
  created_at: string
  updated_at: string
}

export function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(['Documentation'])
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch documents from API
    async function fetchDocs() {
      try {
        const response = await fetch('/api/admin/files')
        if (response.ok) {
          const data = await response.json()
          setDocs(data)
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDocs()
  }, [])

  // Build dynamic navigation from uploaded documents
  const navigation = [
    {
      name: 'Documentation',
      href: '/documentation',
      icon: FileText,
      children: docs.map(doc => ({
        name: doc.title,
        href: `/docs/${doc.slug}`,
      })),
    },
    {
      name: 'Admin',
      href: '/admin',
      icon: Settings,
      children: [
        { name: 'Dashboard', href: '/admin' },
      ],
    },
  ]

  useEffect(() => {
    // Auto-expand section containing current path
    const currentSection = navigation.find((section) =>
      section.children?.some((child) => child.href === pathname)
    )
    if (currentSection) {
      setOpenSections([currentSection.name])
    }
  }, [pathname])

  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((name) => name !== sectionName)
        : [...prev, sectionName]
    )
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-16 left-4 z-50 h-9 w-9 rounded-md bg-background border border-border flex items-center justify-center shadow-sm"
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-56 z-40 border-r border-border bg-background overflow-y-auto',
          'lg:block',
          isMobileOpen ? 'block' : 'hidden'
        )}
      >
        <div className="h-full flex flex-col">
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((section) => {
              const isOpen = openSections.includes(section.name)
              const hasActiveChild = section.children?.some(
                (child) => child.href === pathname
              )

              return (
                <div key={section.name} className="space-y-1">
                  <button
                    onClick={() => toggleSection(section.name)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      hasActiveChild
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <section.icon className="h-4 w-4 shrink-0" />
                      <span>{section.name}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform',
                        isOpen && 'rotate-90'
                      )}
                    />
                  </button>

                  {isOpen && section.children && (
                    <div className="ml-7 mt-1 space-y-1 border-l border-border pl-4">
                      {section.children.map((child) => {
                        const isActive = child.href === pathname
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                              'block px-3 py-1.5 rounded-md text-sm transition-colors',
                              isActive
                                ? 'text-primary font-medium bg-primary/20'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            )}
                          >
                            {child.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  )
}

