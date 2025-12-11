"use client"

import { useState, useEffect } from "react"
import type { Property, ContactSubmission, SiteSettings /*, ApiResponse*/ } from "@/lib/types" // ❌ removed ApiResponse

export function useApi<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url, options)
      // ❌ removed ApiResponse parsing
      // const result: ApiResponse<T> = await response.json()

      if (!response.ok) throw new Error(`HTTP ${response.status}`) // ✅ new error handling

      const result = await response.json()
      setData(result as T) // ✅ directly assign JSON to data
      // if (result.success) {
      //   setData(result.data || null)
      // } else {
      //   setError(result.error || "An error occurred")
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { data, loading, error, refetch: fetchData }
}

export const api = {
  // Properties
  getProperties: async (params?: { featured?: boolean; type?: string; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.featured) searchParams.set("featured", "true")
    if (params?.type) searchParams.set("type", params.type)
    if (params?.status) searchParams.set("status", params.status)

    const response = await fetch(`/api/properties?${searchParams}`)
    if (!response.ok) throw new Error("Failed to fetch properties") // ✅ added error handling
    return (await response.json()) as Property[] // ✅ removed ApiResponse
  },

  getProperty: async (id: string) => {
    const response = await fetch(`/api/properties/${id}`)
    if (!response.ok) throw new Error("Failed to fetch property details")
    return (await response.json()) as Property
    // return response.json() as Promise<ApiResponse<Property>> // ❌ removed
  },

  createProperty: async (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    const response = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(property),
    })
    if (!response.ok) throw new Error("Failed to create property")
    return (await response.json()) as Property
    // return response.json() as Promise<ApiResponse<Property>> // ❌ removed
  },

  updateProperty: async (id: string, property: Partial<Property>) => {
    const response = await fetch(`/api/properties/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(property),
    })
    if (!response.ok) throw new Error("Failed to update property")
    return (await response.json()) as Property
    // return response.json() as Promise<ApiResponse<Property>> // ❌ removed
  },

  deleteProperty: async (id: string) => {
    const response = await fetch(`/api/properties/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Failed to delete property")
    return await response.json()
    // return response.json() as Promise<ApiResponse<null>> // ❌ removed
  },

  // Contact submissions
  getContactSubmissions: async () => {
    const response = await fetch("/api/contact")
    if (!response.ok) throw new Error("Failed to fetch contact submissions")
    return (await response.json()) as ContactSubmission[]
    // return response.json() as Promise<ApiResponse<ContactSubmission[]>> // ❌ removed
  },

  submitContact: async (submission: Omit<ContactSubmission, "id" | "createdAt" | "status">) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    })
    if (!response.ok) throw new Error("Failed to submit contact form")
    return (await response.json()) as ContactSubmission
    // return response.json() as Promise<ApiResponse<ContactSubmission>> // ❌ removed
  },

  // Site settings
  getSiteSettings: async () => {
    const response = await fetch("/api/settings")
    if (!response.ok) throw new Error("Failed to fetch site settings")
    return (await response.json()) as SiteSettings
    // return response.json() as Promise<ApiResponse<SiteSettings>> // ❌ removed
  },

  updateSiteSettings: async (settings: Partial<SiteSettings>) => {
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
    if (!response.ok) throw new Error("Failed to update site settings")
    return (await response.json()) as SiteSettings
    // return response.json() as Promise<ApiResponse<SiteSettings>> // ❌ removed
  },
}
