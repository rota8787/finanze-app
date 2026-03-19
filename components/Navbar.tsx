'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LayoutDashboard, 
  Receipt, 
  Tag, 
  PieChart, 
  LogOut, 
  Wallet 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Transazioni', href: '/transactions', icon: Receipt },
  { label: 'Categorie', href: '/categories', icon: Tag },
  { label: 'Report', href: '/reports', icon: PieChart },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r bg-white p-6 lg:block text-gray-900">
        <div className="mb-10 flex items-center gap-2">
          <div className="rounded-full bg-blue-600 p-2">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Finanze</span>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 border-t pt-6">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Esci
          </button>
        </div>
      </aside>

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full border-t bg-white p-2 lg:hidden text-gray-900">
        <div className="flex w-full items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-2 text-xs font-medium transition-colors",
                pathname === item.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <item.icon className="h-6 w-6" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center gap-1 rounded-lg p-2 text-xs font-medium text-red-600"
          >
            <LogOut className="h-6 w-6" />
            Esci
          </button>
        </div>
      </nav>
    </>
  )
}
