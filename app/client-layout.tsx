"use client"

import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import { AuthProvider } from "@/contexts/auth-context"
import { SettingsProvider } from "@/contexts/setting-context"
import Footer from "@/components/footer"
import ContactPopup from "@/components/contact-popup"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // 🔹 Pages where navbar/footer/buttons should be hidden
  const hideUI =
    pathname?.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"

  const [contactPhone, setContactPhone] = useState<string>("")
  const [isContactOpen, setIsContactOpen] = useState(false)

  // 🔹 Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings")
        const data = await res.json()
        if (data?.contactPhone) {
          setContactPhone(data.contactPhone)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

  // 🔹 WhatsApp click handler
  const handleWhatsAppClick = () => {
    if (contactPhone) {
      const phone = contactPhone.replace(/[^0-9]/g, "")
      const message = `Hi! I'm interested in the properties. Please share more details.`
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank")
    } else {
      alert("WhatsApp contact number is not configured yet.")
    }
  }

  return (
    <AuthProvider>
      <SettingsProvider>
        {/* Hide Navbar on admin and auth pages */}
        {!hideUI && <Navbar />}

        {/* Hide WhatsApp & Enquiry Button on admin and auth pages */}
        {!hideUI && (
          <>
            {/* WhatsApp Button */}
            <div className="fixed right-1 bottom-20 z-50 flex flex-col gap-3">
              <button
                onClick={handleWhatsAppClick}
                className="bg-gold3 text-white p-3 rounded-full shadow-lg hover:bg-greenTheme transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                </svg>
              </button>
            </div>

            {/* Enquiry Button */}
            <div
              className="fixed -right-10 top-1/2 transform -translate-y z-[50]"
              onClick={() => setIsContactOpen(true)}
            >
              <button
                className="bg-gold3 text-white px-3 py-4 rounded-xl text-sm font-medium transform rotate-270 origin-center hover:bg-greenTheme transition-opacity"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Enquiry Now
              </button>
            </div>

            {/* Contact Popup */}
            <ContactPopup
              isOpen={isContactOpen}
              onClose={() => setIsContactOpen(false)}
            />
          </>
        )}
        {!hideUI &&
        <div className="lg:h-22 md:h-15 h-10"></div>}
        {/* PAGE CONTENT */}
        <Suspense fallback={null}>{children}</Suspense>

        {/* Hide footer on admin and auth pages */}
        {!hideUI && <Footer />}
      </SettingsProvider>
    </AuthProvider>
  )
}
