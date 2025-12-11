"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

interface Settings {
  contactPhone: string
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [contactPhone, setContactPhone] = useState<string>("")

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings")
        const data = await res.json()
        setContactPhone(data.contactPhone)
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }
    fetchSettings()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-greenTheme">
      <div className="w-full">
        <div className=" shadow-lg px-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/images/ahlada-logo.png"
                  alt="AhladaHomes"
                  width={180}
                  height={50}
                  className="h-18 w-auto"
                />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-6 ml-2">
              {[
                { name: "Home", href: "/" },
                { name: "About Company", href: "/about-company" },
                { name: "Residential", href: "/residential" },
                { name: "Commercial", href: "/commercial" },
                { name: "Open Plots", href: "/open-plots" },
                { name: "Farm Lands", href: "/farm-lands" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-slate-200 hover:text-gold4 xl:text-sm text-xs"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500}}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
              <div className="h-22 bg-slate-400 w-[0.5px] lg:block hidden"></div>
            <div className="flex items-center py-3">
              <button
                className="lg:hidden p-2 text-slate-200 hover:text-gold4"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="hidden md:flex items-center space-x-3 border border-gray-300 px-4 py-2 rounded-xl">
               <Image
                  src="/images/whatsapp.png"
                  alt="WhatsApp"
                  width={50}
                  height={50}
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-8 lg:h-8 object-contain"
                />
                <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, color: "white" }} className="text-sm xl:text-xl">
                  {contactPhone || "+91 XXXXX XXXXX"}
                </span>
              </div>
            </div>
          </div>


        </div>
                  {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 bg-white rounded-lg shadow-lg px-6 py-4 mx-4">
              <nav className="flex flex-col space-y-3">
                {[
                  { name: "Home", href: "/" },
                  { name: "About Company", href: "/about-company" },
                  { name: "Residential", href: "/residential" },
                  { name: "Commercial", href: "/commercial" },
                  { name: "Open Plots", href: "/open-plots" },
                  { name: "Farm Lands", href: "/farm-lands" },
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-700 hover:text-gold4 py-2"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "16px" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
                  <Image src="/images/whatsapp.png" alt="WhatsApp" width={40} height={40} />
                  <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "18px", color: "black" }}>
                    {contactPhone || "+91 XXXXX XXXXX"}
                  </span>
                </div>
              </nav>
            </div>
          )}
      </div>
    </header>
  )
}
