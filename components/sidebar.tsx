'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Book,
  Code,
  Settings,
  Zap,
  Database,
  Shield,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Getting Started',
    href: '/documentation',
    icon: Home,
    children: [
      { name: 'Introduction', href: '/documentation' },
      { name: 'Quick Start', href: '/getting-started' },
      { name: 'Installation', href: '/installation' },
    ],
  },
  {
    name: 'API Reference',
    href: '/api',
    icon: Code,
    children: [
      { name: 'Overview', href: '/api' },
      { name: 'Authentication', href: '/api/authentication' },
      { name: 'Endpoints', href: '/api/endpoints' },
      { name: 'Webhooks', href: '/api/webhooks' },
    ],
  },
  {
    name: 'Guides',
    href: '/guides',
    icon: Book,
    children: [
      { name: 'Overview', href: '/guides' },
      { name: 'Best Practices', href: '/guides/best-practices' },
      { name: 'Troubleshooting', href: '/guides/troubleshooting' },
    ],
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: Zap,
    children: [
      { name: 'Overview', href: '/performance' },
      { name: 'Optimization', href: '/performance/optimization' },
      { name: 'Caching', href: '/performance/caching' },
    ],
  },
  {
    name: 'Database',
    href: '/database',
    icon: Database,
    children: [
      { name: 'Overview', href: '/database' },
      { name: 'Schema', href: '/database/schema' },
      { name: 'Migrations', href: '/database/migrations' },
    ],
  },
  {
    name: 'Security',
    href: '/security',
    icon: Shield,
    children: [
      { name: 'Overview', href: '/security' },
      { name: 'Authentication', href: '/security/authentication' },
      { name: 'Authorization', href: '/security/authorization' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>([])
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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
        className="lg:hidden fixed top-20 left-4 z-50 h-10 w-10 rounded-lg bg-background/80 backdrop-blur-lg border border-border flex items-center justify-center"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-70 z-40 bg-background/80 backdrop-blur-lg border-r border-border overflow-y-auto',
              'lg:block',
              isMobileOpen ? 'block' : 'hidden'
            )}
            style={{ width: '280px' }}
        >
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-border">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Documentation
                </h2>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {navigation.map((section) => {
                  const isOpen = openSections.includes(section.name)
                  const hasActiveChild = section.children?.some(
                    (child) => child.href === pathname
                  )

                  return (
                    <div key={section.name}>
                      <button
                        onClick={() => toggleSection(section.name)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all',
                          hasActiveChild
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <section.icon className="h-4 w-4" />
                          <span>{section.name}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: isOpen ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && section.children && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-6 mt-1 space-y-1 border-l border-border pl-4">
                              {section.children.map((child) => {
                                const isActive = child.href === pathname
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={cn(
                                      'block px-3 py-1.5 rounded-lg text-sm transition-all',
                                      isActive
                                        ? 'text-primary font-medium bg-primary/10'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )}
                                  >
                                    {child.name}
                                  </Link>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </nav>
            </div>
          </motion.aside>
      </AnimatePresence>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
        />
      )}
    </>
  )
}

