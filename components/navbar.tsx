'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { SearchModal } from './search-modal'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-border/40 shadow-lg shadow-black/5'
            : 'bg-background/60 backdrop-blur-md border-border/30'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center space-x-3 group"
            >
              <div className="relative inline-flex items-center space-x-2 py-2">
                <Image
                  src="/logo-navbar.svg"
                  alt="Codity Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span 
                  className="font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent group-hover:from-white group-hover:via-primary group-hover:to-primary transition-all duration-300"
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Codity
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center gap-2 px-3 h-9 rounded-md border border-border bg-secondary text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Search docs...</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="https://dashboard.codity.ai"
              className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

