"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import type { LoginCredentials } from "@/lib/types"

export function LoginForm() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  const { login, checkRoleByEmail } = useAuth() // <— New method to check role by email
  const router = useRouter()

  const handleEmailChange = async (email: string) => {
    setCredentials({ ...credentials, email })

    // Optional: dynamically check if the entered email is a super_admin
    if (email && checkRoleByEmail) {
      const role = await checkRoleByEmail(email)
      setIsSuperAdmin(role === "super_admin")
    } else {
      setIsSuperAdmin(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(credentials)

    if (result.success) {
      // Redirect based on user role
      if (result.user?.role === "super_admin" || result.user?.role === "agent") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } else {
      setError(result.error || "Login failed")
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {/* Only show forgot password link if email belongs to a super_admin */}
          {isSuperAdmin && (
            <div className="text-right">
              <Link
                href={`/forgot-password?email=${encodeURIComponent(credentials.email)}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
