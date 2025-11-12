'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ThemeToggle } from './theme-toggle'
import { SearchModal } from './search-modal'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-lg border-border/50 shadow-sm'
            : 'bg-background/40 backdrop-blur-md border-border/30'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-lg group-hover:bg-primary/30 transition-colors" />
                <div className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-3 py-1.5 rounded-lg font-bold text-lg">
                  Codity
                </div>
              </motion.div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 hover:border-border transition-all text-sm text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4" />
                <span>Search documentation...</span>
                <kbd className="ml-auto hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link
                href="https://dashboard.codity.ai"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/30 transition-all text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

