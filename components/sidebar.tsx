'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText,
  ChevronDown,
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
  ]

  useEffect(() => {
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
        className="lg:hidden fixed top-16 left-4 z-50 h-8 w-8 rounded bg-white/5 border border-white/10 flex items-center justify-center"
      >
        {isMobileOpen ? <X className="h-4 w-4 text-white" /> : <Menu className="h-4 w-4 text-white" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-60 z-40 bg-black border-r border-white/5 overflow-y-auto',
          'lg:block',
          isMobileOpen ? 'block' : 'hidden'
        )}
      >
        <div className="h-full flex flex-col">
          <nav className="flex-1 p-3 space-y-1">
            {navigation.map((section) => {
              const isOpen = openSections.includes(section.name)
              const hasActiveChild = section.children?.some(
                (child) => child.href === pathname
              )

              return (
                <div key={section.name} className="space-y-0.5">
                  <button
                    onClick={() => toggleSection(section.name)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <section.icon className="h-4 w-4 shrink-0" />
                      <span>{section.name}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {isOpen && section.children && (
                    <div className="mt-0.5 space-y-0.5 pl-2">
                      {section.children.map((child) => {
                        const isActive = child.href === pathname
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                              'block px-2 py-1.5 rounded text-sm transition-colors',
                              isActive
                                ? 'text-white bg-white/10 font-medium'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
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
          className="lg:hidden fixed inset-0 bg-black/80 z-30"
        />
      )}
    </>
  )
}

