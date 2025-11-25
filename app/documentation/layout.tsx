'use client'

import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-60">
          <div className="max-w-4xl px-6 py-8">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {children}
            </article>
          </div>
        </main>
      </div>
    </div>
  )
}
