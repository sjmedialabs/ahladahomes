"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Property, User } from "@/lib/types"

interface ContactPopupProps {
  isOpen: boolean
  onClose: () => void
  projectTitle?: string
  propertyId?: string
}

export default function ContactPopup({ isOpen, onClose, projectTitle, propertyId }: ContactPopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
    agreeToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [property, setProperty] = useState<Property | null>(null)
  const [agent, setAgent] = useState<User | null>(null)

  // 🔹 Validation state for UI feedback
  const [errors, setErrors] = useState<{ email?: string; mobile?: string }>({})

  // Fetch property and agent
  useEffect(() => {
    if (!propertyId) return

    const fetchPropertyAndAgent = async () => {
      try {
        const propRes = await fetch(`/api/properties/${propertyId}`)
        if (!propRes.ok) throw new Error("Property not found")
        const propData: Property = await propRes.json()
        setProperty(propData)
      } catch (error) {
        console.error(error)
      }
    }

    fetchPropertyAndAgent()
  }, [propertyId])

  // 🔹 Validation helper
  const validateForm = () => {
    const newErrors: { email?: string; mobile?: string } = {}

    // ✅ Email must look like "abc123@gmail.com"
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid Gmail address (e.g., abc123@gmail.com)"
    }

// supports +91 9876543210, +1-202-555-0100, +971501234567 etc.
const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

if (!phoneRegex.test(formData.mobile)) {
  newErrors.mobile = "Please enter a valid phone number with country code";
}


    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 🔹 Validate before submitting
    if (!validateForm()) return

    if (!formData.agreeToTerms) {
      alert("Please agree to Terms of use & Privacy Policy")
      return
    }

    setIsSubmitting(true)

    try {
      const bodyData = {
        name: formData.name,
        email: formData.email,
        phone: `${formData.mobile}`,
        message: `${formData.message}${projectTitle ? `\n\nProject Interest: ${projectTitle}` : ""
          }`,
      }

      // ✅ Case 1: If propertyId exists → send to property contact endpoint
      if (propertyId) {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...bodyData,
            propertyId,
          }),
        })

        if (res.ok) {
          alert("Message sent successfully! Our agent will contact you soon.")
        } else {
          const err = await res.json()
          alert(err.error || "Failed to send message. Please try again.")
        }
      }

      // ✅ Case 2: No propertyId → general enquiry mail to owner
      else {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...bodyData
          }),
        })

        if (res.ok) {
          alert("Your enquiry has been sent to our team!")
        } else {
          const err = await res.json()
          alert(err.error || "Failed to send message. Please try again.")
        }
      }

      // ✅ Reset & close
      onClose()
      setFormData({
        name: "",
        email: "",
        mobile: "",
        message: "",
        agreeToTerms: false,
      })
      setErrors({})
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-end pr-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>
        {/* Content */}
        <div className="px-6 ">
          <div className="text-center flex flex-col items-center justify-center mb-6">
            <img src="/images/ahlada-logo.png" alt="" className="h-28"/>
            <h2 className="text-xl font-semibold text-blue-600 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              Contact form
            </h2>
            {property && (
              <p className="text-gray-600 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                {property.title}
              </p>
            )}
            <p className="text-gray-600 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
              Connect with our qualified Agent
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name*"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ✅ Added Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email (only Gmail allowed)*"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone Number (with country code)*  e.g. +91 9876543210"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className={`w-full p-3 border rounded-lg focus:ring-2 ${errors.mobile ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>


            <div>
              <textarea
                placeholder="How can an Agent help"
                rows={1}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-1"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                By Providing your contact details, you agree to our{" "}
                <span className="text-blue-600 underline cursor-pointer">Terms of use</span> &{" "}
                <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-3 mb-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
