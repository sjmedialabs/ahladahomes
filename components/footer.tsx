"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Facebook, Instagram, Linkedin, Mail, MapPin, PhoneCall, Pin, Twitter } from "lucide-react"

interface Settings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
  }
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings")
        const data = await res.json()
        setSettings(data)
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }
    fetchSettings()
  }, [])

  if (!settings) return null // prevent rendering until data is fetched

  return (
<footer
  className="relative bg-greenTheme text-white flex gap-2 flex-col"
>

      <div className="xl:max-w-6xl mx-auto px-6 bg-transparent pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Contact us */}
          <div className="flex flex-col gap-2">
            <h3
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "18px" }}
            >
              Contact us
            </h3>
            <div className="flex justify-start">
            <img src="/images/ahlada-logo.png" alt="" className="h-24 w-auto -ml-10"/></div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 flex-shrink-0 text-[#ecc33e]"/>
                <p
                  className=""
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "1.5" }}
                >
                  {settings.address || "123 Main Street, City, Country"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 flex-shrink-0 text-[#ecc33e]"/>
                <p
                  className=""
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: "14px" }}
                >
                  {settings.contactPhone || "(123) 456-7890"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-[#ecc33e]"/>
                <p
                  className=""
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: "14px" }}
                >
                  {settings.contactEmail || "8m6f6@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className=" mb-4"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "18px" }}
            >
              Quick Links
            </h3>

            <div className="space-y-3">
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
                  className="block  hover:text-red-500 transition-colors text-xs"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "14px" }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3
              className=" mb-6"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "18px" }}
            >
              Menu
            </h3>

            <div className="space-y-3">
              {[ { name: "Testimonials", href: "/testimonials" },
                { name: "Media Center", href: "/gallery" },
              { name: "Contact US", href: "/contact"}].map((category) => (
                <button
                  key={category.name}
                  onClick={() => router.push(category.href)}
                  className="capitalize block  hover:text-red-500 transition-colors text-left text-xs font-bold"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "14px" }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h3
              className=" mb-6"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "18px" }}
            >
              Support
            </h3>

            <div className="space-y-3">
              {["Privacy Policy", "Terms & conditions"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block  hover:text-red-500 transition-colors"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "14px" }}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-2">
              {[
                { href: (settings?.socialMedia?.facebook || ""), icon: <Facebook className="text-white h-6 w-5"/>},
                { href: (settings?.socialMedia?.twitter || ""), icon: <Twitter className="text-white h-6 w-5"/>},
                { href: (settings?.socialMedia?.instagram || ""), icon: <Instagram className="text-white h-6 w-5"/>},
                { href: (settings?.socialMedia?.linkedin || ""), icon: <Linkedin className="text-white h-6 w-5"/>},
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" flex items-center justify-center hover:bg-gray-200 transition-colors rounded-full bg-gold3 px-1.5 bg-gold3 py-1"
                >
                {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* About Company */}
          <div>
            <h3
              className=" mb-6"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "18px" }}
            >
              About Company
            </h3>

            <p
              className=""
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "1.6" }}
            >
              {settings.siteDescription}
            </p>
          </div>
        </div>
        <div className="flex justify-end h-8">
          {/* <Link href="#">
          <img src="/images/Chat-icon.png" alt="" className="h-24 w-24"/></Link> */}
        </div>
      </div>
      
        {/* Copyright Section */}
        <div className="border-t-4 border-black p-8 text-center justify-end">
          <p
            className=""
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "14px" }}
          >
            Copyright 2025 {settings.siteName}. All Rights Reserved.
          </p>
        </div>
    </footer>
  )
}
