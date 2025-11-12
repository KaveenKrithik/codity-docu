'use client'

import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

export default function DatabaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {children}
            </article>
          </div>
        </main>
      </div>
    </div>
  )
}

