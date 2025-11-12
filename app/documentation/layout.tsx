'use client'

import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-[280px] pt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
