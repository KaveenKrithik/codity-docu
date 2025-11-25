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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-60">
          <div className="max-w-7xl px-6 py-8">
            {/* Admin Header with Logout */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Logged in as: <span className="font-medium text-white">{user.email}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors"
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

