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
      <nav className="sticky top-0 z-50 w-full h-14 bg-black border-b border-white/5">
        <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 8L3 12L7 16M17 8L21 12L17 16M14 4L10 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-base font-semibold text-white">Codity</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center">
              <Link href="/documentation" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1">
                Documentation
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center gap-2 px-3 h-8 rounded-md bg-white/5 border border-white/10 text-sm text-gray-400 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Search docs...</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] text-gray-400">
                <span>⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium h-8 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all"
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

