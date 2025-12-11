"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { SiteSettings } from "@/lib/types"

export default function AboutCompanyPage() {
  const [aboutUs, setAboutUs] = useState<SiteSettings["aboutUsPage"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await fetch("/api/settings")
        if (!response.ok) throw new Error("Failed to fetch settings")
        const data: SiteSettings = await response.json()
        setAboutUs(data.aboutUsPage || null)
        console.log("Fetched about us data:", data.aboutUsPage?.bannerImage)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchAboutUs()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    )
  }

  if (!aboutUs) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500 text-lg">No about us data found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Banner */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url('${aboutUs.bannerImage}')` }}
      >
        <div className="absolute inset-0"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            {/* <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              {aboutUs.pageTitle || "About Us"}
            </h1> */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Intro */}
        <div className="text-start mb-16 flex flex-col lg:flex-row gap-12 items-center justify-center">
          <div className="lg:basis-1/2 flex flex-col justify-center items-center text-start gap-4">
            <div className="px-2">
            <h2 className="text-sm font-bold text-gold3" style={{ fontFamily: "Poppins, sans-serif" }}>
              {aboutUs.welcomeTitle}
            </h2>
            <h3 className="text-gray-600 uppercase text-3xl font-light" style={{ fontFamily: "Poppins, sans-serif" }}>
              {aboutUs.introText}
            </h3>
            <p className="text-gray-600 text-justify" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              {aboutUs.detailedDescription}
            </p></div>
            <div className="flex flex-col gap-2 text-center justify-center">
              <div className="flex lg:flex-row flex-col md:flex-row gap-2">
                <div className="bg-gold4 rounded-xl px-6 md:px-10 text-start py-8 md:py-10">
                  <h3 className="text-2xl font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {aboutUs.statistics?.yearsExperience} Years of
                  </h3>
                  <p className="text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>purposeful craftmanship</p>
                </div>
                <div className="bg-gold4 rounded-xl md:p-10 p-8">
                  <h3 className="text-2xl font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {aboutUs.statistics?.locations}
                  </h3>
                  <p className="text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>Locations</p>
                </div>
              </div>
              <div className="flex lg:flex-row flex-col md:flex-row gap-3">
                <div className="bg-gold4 rounded-xl md:p-10 p-8">
                  <h3 className="text-2xl font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {aboutUs.statistics?.propertiesClosed}
                  </h3>
                  <p className="text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>Projects</p>
                </div>
                <div className="bg-gold4 rounded-xl md:p-10 p-8">
                  <h3 className="text-2xl font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {aboutUs.statistics?.happyClients}
                  </h3>
                  <p className="text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>Clients</p>

                </div>
                <div className="bg-gold4 rounded-xl md:p-10 p-8">
                  <h3 className="text-2xl font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {aboutUs.statistics?.partnerships}
                  </h3>
                  <p className="text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>Builder </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img src={aboutUs.welcomeImage || "/placeholder.svg"} alt="" />
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-16">
          <div className="text-center bg-gold4 rounded-xl">
            <img src={aboutUs.visionImage || "/placeholder.svg"} alt="Our Vision" className="w-full max-w-md mx-auto rounded-lg" />
            <div className="p-4">
            <h3 className="text-2xl font-bold text-gold3" style={{ fontFamily: "Poppins, sans-serif"}}>
              {aboutUs.visionTitle}
            </h3>
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              {aboutUs.visionText}
            </p>
          <p className="text-black font-bold leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              {aboutUs.visionText2}
            </p>
            </div>
          </div>

          <div className="text-center bg-gold4 rounded-xl">
            <img src={aboutUs.missionImage || "/placeholder.svg"} alt="Our Mission" className="w-full max-w-md mx-auto rounded-lg" />
              <div className="p-4">
             <h3 className="text-2xl font-bold text-gold3" style={{ fontFamily: "Poppins, sans-serif"}}>
              {aboutUs.missionTitle}
            </h3>
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              {aboutUs.missionText}
            </p>
            <p className="text-black font-bold leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              {aboutUs.missionText2}
            </p>
            </div>
          </div>
          <div className="text-center bg-gold4 rounded-xl">
            <img src={aboutUs.goalImage || "/placeholder.svg"} alt="Our Vision" className="w-full max-w-md mx-auto rounded-lg" />
            <div className="p-4">
            <h3 className="text-2xl font-bold text-gold3" style={{ fontFamily: "Poppins, sans-serif"}}>
              {aboutUs.goalTitle}
            </h3>
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              {aboutUs.goalText}
            </p>
            <p className="text-black font-bold leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              {aboutUs.missionText2}
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
