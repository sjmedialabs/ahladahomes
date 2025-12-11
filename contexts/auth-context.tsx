"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, LoginCredentials, RegisterData, AuthResponse } from "@/lib/types"

interface AuthContextType {
  user: Omit<User, "password"> | null
  token: string | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (data: RegisterData) => Promise<AuthResponse>
  logout: () => void
  isAuthenticated: boolean
  hasRole: (roles: User["role"] | User["role"][]) => boolean
  checkRoleByEmail?: (email: string) => Promise<User["role"] | null> // 👈 ADD THIS
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        // Verify token is still valid
        verifyToken(storedToken)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        logout()
      }
    }
    setLoading(false)
  }, [])

  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        logout()
        return
      }

      const result: AuthResponse = await response.json()
      if (result.success && result.user) {
        setUser(result.user)
      } else {
        logout()
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      logout()
    }
  }

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const result: AuthResponse = await response.json()

      if (result.success && result.user && result.token) {
        setUser(result.user)
        setToken(result.token)
        localStorage.setItem("auth_token", result.token)
        localStorage.setItem("auth_user", JSON.stringify(result.user))
      }

      return result
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
      }
    }
  }

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result: AuthResponse = await response.json()

      if (result.success && result.user && result.token) {
        setUser(result.user)
        setToken(result.token)
        localStorage.setItem("auth_token", result.token)
        localStorage.setItem("auth_user", JSON.stringify(result.user))
      }

      return result
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")

    // Call logout endpoint
    fetch("/api/auth/logout", { method: "POST" }).catch(console.error)
  }

  const hasRole = (roles: User["role"] | User["role"][]): boolean => {
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

    // ✅ Check user role by email (used for forgot-password visibility)
  const checkRoleByEmail = async (email: string): Promise<User["role"] | null> => {
    try {
      const res = await fetch(`/api/auth/check-role?email=${encodeURIComponent(email)}`)
      if (!res.ok) return null

      const data = await res.json()
      return data.role || null
    } catch (error) {
      console.error("Error checking role by email:", error)
      return null
    }
  }


  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    hasRole,
    checkRoleByEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
