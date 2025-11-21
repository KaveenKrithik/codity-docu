'use client'

import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // If on login page, skip auth and just render children
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Skip auth check if on login page
    if (isLoginPage) {
      setLoading(false)
      return
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      } else {
        router.push('/admin/login')
      }
      setLoading(false)
    }

    checkUser()
  }, [router, isLoginPage])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    document.cookie = 'sb-access-token=; path=/; max-age=0'
    router.push('/admin/login')
    router.refresh()
  }

  // If on login page, render children without admin layout
  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            {/* Admin Header with Logout */}
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Logged in as: <span className="font-medium text-foreground">{user.email}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Logout
              </button>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

