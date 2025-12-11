"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

const AdminSidebar = ({ userRole }: { userRole: string }) => {
  const pathname = usePathname()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", href: "/admin", roles: ["super_admin", "agent"] },
    { id: "leads", label: "Lead Management", icon: "🎯", href: "/admin/leads", roles: ["super_admin", "agent"] },
    { id: "properties", label: "Properties", icon: "🏠", href: "/admin/properties", roles: ["super_admin", "agent"] },
    { id: "press-release", label: "Press Release", icon: "⚙️", href: "/admin/press-release", roles: ["super_admin"] },
    { id: "analytics", label: "Analytics", icon: "📈", href: "/admin/analytics", roles: ["super_admin"] },
    { id: "settings", label: "Settings", icon: "⚙️", href: "/admin/settings", roles: ["super_admin"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="w-64 bg-gray-900 text-white max-h-screen flex flex-col justify-between fixed left-0 top-0 bottom-0">
      <div className="p-6">
        <Link href="/admin" className="text-xl font-bold text-red-400">
          Ahlada Homes Admin
        </Link>
        <nav className="mt-8 space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
                pathname === item.href ? "bg-red-600 border-r-4 border-red-400" : ""
              }`}
            >
              <span className="mr-3 text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-6">
        <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
          ← Back to Site
        </Link>
      </div>
    </div>
  )
}

const AdminHeader = ({
  user,
  onLogout,
}: { user: { name: string; email: string; role: string }; onLogout: () => void }) => {
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "super_admin": return "Super Administrator"
      case "agent": return "Agent"
      default: return role
    }
  }

  return (
    <header className="bg-white shadow-sm border-b fixed top-0 left-64 right-0 z-30">
      <div className="flex justify-between items-center px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">Lead Management System</h2>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs font-medium text-gray-900">{user.name}</p>
            <p className="text-2xs text-gray-500">{getRoleDisplay(user.role)}</p>
          </div>
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
          <button
            onClick={onLogout}
            className="text-xs text-gray-600 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Ensures rendering happens on client only
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!loading && (!user || !["super_admin", "agent"].includes(user.role))) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // Prevent SSR mismatch
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-base">Loading...</div>
      </div>
    )
  }

  if (!user || !["super_admin", "agent"].includes(user.role)) return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar userRole={user.role} />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={user} onLogout={handleLogout} />
        <main className="p-6 flex-1 mt-16 ml-64">{children}</main>
      </div>
    </div>
  )
}
