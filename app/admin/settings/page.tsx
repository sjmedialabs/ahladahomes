"use client"

import React, { useState, useEffect } from "react"
import FileUpload from "@/components/file-upload"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { SiteSettings } from "@/lib/types"

// --- Settings Section Component ---
const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      {children}
    </CardContent>
  </Card>
)

// --- Main Settings Page ---
export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // ---------------------- Fetch Settings ----------------------
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/settings", { method: "GET" })
      if (!res.ok) throw new Error("Failed to fetch settings")
      const data: SiteSettings = await res.json()
      setSettings(data)
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      setSettings(null)
    } finally {
      setLoading(false)
    }
  }

  // ---------------------- Input Handlers ----------------------

  const handleInputChange = (key: keyof SiteSettings, value: any) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const handleFileChange = (field: keyof SiteSettings, file?: File) => {
    if (!file || !settings) return
    const reader = new FileReader()
    reader.onload = () => {
      setSettings({ ...settings, [field]: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  // Handle aboutContent array (add/edit/remove)
  const handleArrayChange = (
    arrayField: keyof SiteSettings,
    index: number,
    key: string,
    value: string
  ) => {
    if (!settings) return
    const newArray = Array.isArray(settings[arrayField]) ? [...(settings[arrayField] as any[])] : []
    if (!newArray[index]) newArray[index] = {}
    newArray[index][key] = value
    setSettings({ ...settings, [arrayField]: newArray })
  }

  const addArrayItem = (arrayField: keyof SiteSettings, item: any) => {
    if (!settings) return
    const newArray = Array.isArray(settings[arrayField]) ? [...(settings[arrayField] as any[])] : []
    newArray.push(item)
    setSettings({ ...settings, [arrayField]: newArray })
  }

  const removeArrayItem = (arrayField: keyof SiteSettings, index: number) => {
    if (!settings) return
    const newArray = Array.isArray(settings[arrayField]) ? [...(settings[arrayField] as any[])] : []
    newArray.splice(index, 1)
    setSettings({ ...settings, [arrayField]: newArray })
  }

  // 🔹 Update a root key inside testimonialsPage (bannerImage)
const updateTestimonialsPage = (key: string, value: any) => {
  setSettings((prev) => ({
    ...prev!,
    testimonialsPage: {
      ...prev!.testimonialsPage,
      [key]: value,
    },
  }));
};

// 🔹 Update a testimonial inside the array
const updateTestimonial = (index: number, key: string, value: any) => {
  setSettings((prev) => {
    const arr = [...(prev!.testimonialsPage.testimonials || [])];
    arr[index] = { ...arr[index], [key]: value };

    return {
      ...prev!,
      testimonialsPage: {
        ...prev!.testimonialsPage,
        testimonials: arr,
      },
    };
  });
};

// 🔹 Add new testimonial
const addTestimonial = () => {
  setSettings((prev) => ({
    ...prev!,
    testimonialsPage: {
      ...prev!.testimonialsPage,
      testimonials: [
        ...(prev!.testimonialsPage.testimonials || []),
        { name: "", role: "", image: "", description: "" },
      ],
    },
  }));
};

// 🔹 Remove testimonial
const removeTestimonial = (index: number) => {
  setSettings((prev) => ({
    ...prev!,
    testimonialsPage: {
      ...prev!.testimonialsPage,
      testimonials: prev!.testimonialsPage.testimonials.filter(
        (_, i) => i !== index
      ),
    },
  }));
};

  // ---------------------- About Us Page Handlers ----------------------

  const handleAboutUsChange = (key: string, value: any) => {
    setSettings((prev) => {
      if (!prev) return prev
      const about = prev.aboutUsPage || {
        bannerImage: "",
        pageTitle: "",
        welcomeTitle: "",
        introText: "",
        detailedDescription: "",
        visionImage: "",
        visionTitle: "",
        visionText: "",
        missionImage: "",
        missionTitle: "",
        missionText: "",
        statistics: {
          yearsExperience: "",
          partnerships: "",
          propertiesClosed: "",
          happyClients: "",
        },
        whyChooseTitle: "",
        whyChooseSubtitle: "",
        features: [],
      }

      // Handle nested keys like "statistics.happyClients"
      if (key.includes(".")) {
        const [section, field] = key.split(".")
        return {
          ...prev,
          aboutUsPage: {
            ...about,
            [section]: {
              ...(about[section as keyof typeof about] as object),
              [field]: value,
            },
          },
        }
      }

      return {
        ...prev,
        aboutUsPage: { ...about, [key]: value },
      }
    })
  }

  const handleFeatureChange = (index: number, field: "title" | "description", value: string) => {
    if (!settings) return
    const features = [...(settings.aboutUsPage?.features ?? [])]
    features[index] = { ...features[index], [field]: value }
    setSettings({
      ...settings,
      aboutUsPage: {
        bannerImage: settings.aboutUsPage?.bannerImage ?? "",
        pageTitle: settings.aboutUsPage?.pageTitle ?? "",
        welcomeTitle: settings.aboutUsPage?.welcomeTitle ?? "",
        introText: settings.aboutUsPage?.introText ?? "",
        detailedDescription: settings.aboutUsPage?.detailedDescription ?? "",
        visionImage: settings.aboutUsPage?.visionImage ?? "",
        visionTitle: settings.aboutUsPage?.visionTitle ?? "",
        visionText: settings.aboutUsPage?.visionText ?? "",
        missionImage: settings.aboutUsPage?.missionImage ?? "",
        missionTitle: settings.aboutUsPage?.missionTitle ?? "",
        missionText: settings.aboutUsPage?.missionText ?? "",
        statistics: settings.aboutUsPage?.statistics ?? {
          yearsExperience: "",
          partnerships: "",
          propertiesClosed: "",
          happyClients: "",
        },
        whyChooseTitle: settings.aboutUsPage?.whyChooseTitle ?? "",
        whyChooseSubtitle: settings.aboutUsPage?.whyChooseSubtitle ?? "",
        features,
      },
    })
  }

  const addFeature = () => {
    if (!settings) return
    const features = [...(settings.aboutUsPage?.features ?? [])]
    features.push({ title: "", description: "" })
    setSettings({
      ...settings,
      aboutUsPage: {
        bannerImage: settings.aboutUsPage?.bannerImage ?? "",
        pageTitle: settings.aboutUsPage?.pageTitle ?? "",
        welcomeTitle: settings.aboutUsPage?.welcomeTitle ?? "",
        introText: settings.aboutUsPage?.introText ?? "",
        detailedDescription: settings.aboutUsPage?.detailedDescription ?? "",
        visionImage: settings.aboutUsPage?.visionImage ?? "",
        visionTitle: settings.aboutUsPage?.visionTitle ?? "",
        visionText: settings.aboutUsPage?.visionText ?? "",
        missionImage: settings.aboutUsPage?.missionImage ?? "",
        missionTitle: settings.aboutUsPage?.missionTitle ?? "",
        missionText: settings.aboutUsPage?.missionText ?? "",
        statistics: settings.aboutUsPage?.statistics ?? {
          yearsExperience: "",
          partnerships: "",
          propertiesClosed: "",
          happyClients: "",
        },
        whyChooseTitle: settings.aboutUsPage?.whyChooseTitle ?? "",
        whyChooseSubtitle: settings.aboutUsPage?.whyChooseSubtitle ?? "",
        features,
      },
    })
  }

  const removeFeature = (index: number) => {
    if (!settings) return
    const features = [...(settings.aboutUsPage?.features ?? [])]
    features.splice(index, 1)
    setSettings({
      ...settings,
      aboutUsPage: {
        bannerImage: settings.aboutUsPage?.bannerImage ?? "",
        pageTitle: settings.aboutUsPage?.pageTitle ?? "",
        welcomeTitle: settings.aboutUsPage?.welcomeTitle ?? "",
        introText: settings.aboutUsPage?.introText ?? "",
        detailedDescription: settings.aboutUsPage?.detailedDescription ?? "",
        visionImage: settings.aboutUsPage?.visionImage ?? "",
        visionTitle: settings.aboutUsPage?.visionTitle ?? "",
        visionText: settings.aboutUsPage?.visionText ?? "",
        missionImage: settings.aboutUsPage?.missionImage ?? "",
        missionTitle: settings.aboutUsPage?.missionTitle ?? "",
        missionText: settings.aboutUsPage?.missionText ?? "",
        statistics: settings.aboutUsPage?.statistics ?? {
          yearsExperience: "",
          partnerships: "",
          propertiesClosed: "",
          happyClients: "",
        },
        whyChooseTitle: settings.aboutUsPage?.whyChooseTitle ?? "",
        whyChooseSubtitle: settings.aboutUsPage?.whyChooseSubtitle ?? "",
        features,
      },
    })
  }

  // ---------------------- Save Handler ----------------------

const handleSave = async () => {
  if (!settings) return;
  try {
    setSaving(true);

    const method = settings?._id ? "PUT" : "POST"; // 👈 auto choose POST or PUT

    const res = await fetch("/api/settings", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Settings saved successfully!");
      setSettings(result.data);
    } else {
      alert(result.error || "Failed to save settings. Please try again.");
    }
  } catch (error) {
    console.error("Save failed:", error);
    alert("Failed to save settings.");
  } finally {
    setSaving(false);
  }
};


  // ---------------------- Loading States ----------------------

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading settings...</div>
      </div>
    )

  if (!settings)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Failed to load settings</div>
      </div>
    )

  // ---------------------- Tabs ----------------------

  const tabs = [
    { id: "general", label: "General" },
    { id: "contact", label: "Contact" },
    { id: "social", label: "Social Media" },
    { id: "about", label: "About Us Page" },
    { id: "testimonials", label: "Testimonials Page" },
  ]

  // ---------------------- Render ----------------------

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings & Configuration</h1>
        <p className="text-gray-600">Manage your platform settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- General Tab ---- */}
      {activeTab === "general" && (
        <SettingsSection title="Site Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Site Name</label>
              <input
                type="text"
                value={settings.siteName || ""}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hero Title</label>
              <input
                type="text"
                value={settings.heroTitle || ""}
                onChange={(e) => handleInputChange("heroTitle", e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
<div className="mt-4">
  <label className="block text-sm font-medium mb-1">Site Description</label>
  <textarea
    value={settings.siteDescription || ""}
    onChange={(e) => handleInputChange("siteDescription", e.target.value)}
    className="w-full p-2 border rounded h-20"
  />
</div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
            <textarea
              value={settings.heroSubtitle || ""}
              onChange={(e) => handleInputChange("heroSubtitle", e.target.value)}
              className="w-full p-2 border rounded h-20"
              maxLength={30} // <-- limit to 30 characters
            />
              <p className="text-xs text-gray-500 mt-1">
    {settings.heroSubtitle?.length || 0}/30 characters
  </p>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-3">Hero Image</label>
            <FileUpload
              value={settings.heroImage || ""}
              onChange={(url) => handleInputChange("heroImage", url)}
              placeholder="Upload hero image"
            />
          </div>
        </SettingsSection>
      )}

      {activeTab === "contact" && (
        <div>
          <SettingsSection title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div>
                <label className="block text-sm font-medium mb-1">Website URL</label>
                <input
                  type="url"
                  value={settings?.websiteUrl}
                  onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
                            <div>
                <label className="block text-sm font-medium mb-1">Second Contact No.</label>
                <input
                  type="tel"
                  value={settings?.contactPhone2 || ""}
                  onChange={(e) => handleInputChange("contactPhone2", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                value={settings.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full p-2 border rounded h-20"
              />
            </div>
                                        <div>
                <label className="block text-sm font-medium mb-1">Map URL</label>
                <input
                  type="url"
                  value={settings?.mapUrl || ""}
                  onChange={(e) => handleInputChange("mapUrl", e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
                      <div className="mt-4">
            <label className="block text-sm font-medium mb-3">Contact US Banner</label>
            <FileUpload
              value={settings.contactBanner || ""}
              onChange={(url) => handleInputChange("contactBanner", url)}
              placeholder="Upload banner image"
            />
          </div>
          </SettingsSection>
        </div>
      )}

{activeTab === "social" && (
  <div>
    <SettingsSection title="Social Media Links">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Facebook */}
        <div>
          <label className="block text-sm font-medium mb-1">Facebook</label>
          <input
            type="url"
            value={settings.socialMedia?.facebook || ""}
            onChange={(e) =>
              handleInputChange("socialMedia", {
                ...settings.socialMedia,
                facebook: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
            placeholder="https://facebook.com/yourpage"
          />
        </div>

        {/* Twitter */}
        <div>
          <label className="block text-sm font-medium mb-1">Twitter</label>
          <input
            type="url"
            value={settings.socialMedia?.twitter || ""}
            onChange={(e) =>
              handleInputChange("socialMedia", {
                ...settings.socialMedia,
                twitter: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
            placeholder="https://twitter.com/yourhandle"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium mb-1">Instagram</label>
          <input
            type="url"
            value={settings.socialMedia?.instagram || ""}
            onChange={(e) =>
              handleInputChange("socialMedia", {
                ...settings.socialMedia,
                instagram: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
            placeholder="https://instagram.com/yourhandle"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium mb-1">LinkedIn</label>
          <input
            type="url"
            value={settings.socialMedia?.linkedin || ""}
            onChange={(e) =>
              handleInputChange("socialMedia", {
                ...settings.socialMedia,
                linkedin: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
            placeholder="https://linkedin.com/company/yourcompany"
          />
        </div>
      </div>
    </SettingsSection>
  </div>
)}


     {activeTab === "about" && settings?.aboutUsPage && (
  <div className="space-y-6">
    {/* Page Header */}
    <SettingsSection title="Page Header">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Banner Image</label>
          <FileUpload
            value={settings.aboutUsPage.bannerImage || ""}
            onChange={(url) => handleAboutUsChange("bannerImage", url)}
            placeholder="Upload banner image for about us page"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Page Title</label>
          <input
            type="text"
            value={settings.aboutUsPage.pageTitle || ""}
            onChange={(e) => handleAboutUsChange("pageTitle", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="About Us"
          />
        </div>
      </div>
    </SettingsSection>

    {/* Introduction Section */}
    <SettingsSection title="Introduction Section">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Welcome Title</label>
          <input
            type="text"
            value={settings.aboutUsPage.welcomeTitle || ""}
            onChange={(e) => handleAboutUsChange("welcomeTitle", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Welcome to Propmediate."
            maxLength={10}
          /><p className="text-xs text-gray-500 mt-1">
            {settings.aboutUsPage.welcomeTitle?.length || 0}/10 characters
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Introduction Text</label>
          <textarea
            value={settings.aboutUsPage.introText || ""}
            onChange={(e) => handleAboutUsChange("introText", e.target.value)}
            className="w-full p-2 border rounded h-24"
            placeholder="Brief introduction about your company..."
            maxLength={30}
          /><p className="text-xs text-gray-500 mt-1">
            {settings.aboutUsPage.introText?.length || 0}/30 characters
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Detailed Description</label>
          <textarea
            value={settings.aboutUsPage.detailedDescription || ""}
            onChange={(e) => handleAboutUsChange("detailedDescription", e.target.value)}
            className="w-full p-2 border rounded h-32"
            placeholder="Detailed description about your company..."
            maxLength={370}
          /><p className="text-xs text-gray-500 mt-1">
            {settings.aboutUsPage.detailedDescription?.length || 0}/370 characters
          </p>
        </div>
        </div>
          <div>
            <label className="block text-sm font-medium mb-1">Welcome Section Image</label>
            <FileUpload
              value={settings.aboutUsPage.welcomeImage || ""}
              onChange={(url) => handleAboutUsChange("welcomeImage", url)}
              placeholder="Upload welcome image"
              className="w-full"
            />
          </div>
      </div>
    </SettingsSection>

    {/* Statistics */}
    <SettingsSection title="Statistics">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Years of Experience</label>
          <input
            type="text"
            value={settings.aboutUsPage.statistics?.yearsExperience || ""}
            onChange={(e) => handleAboutUsChange("statistics.yearsExperience", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="7+"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Partnerships</label>
          <input
            type="text"
            value={settings.aboutUsPage.statistics?.partnerships || ""}
            onChange={(e) => handleAboutUsChange("statistics.partnerships", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="50+"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Properties Closed</label>
          <input
            type="text"
            value={settings.aboutUsPage.statistics?.propertiesClosed || ""}
            onChange={(e) => handleAboutUsChange("statistics.propertiesClosed", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="1000+"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Happy Clients</label>
          <input
            type="text"
            value={settings.aboutUsPage.statistics?.happyClients || ""}
            onChange={(e) => handleAboutUsChange("statistics.happyClients", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="500+"
          />
        </div>
                <div>
          <label className="block text-sm font-medium mb-1">Locations</label>
          <input
            type="text"
            value={settings.aboutUsPage.statistics?.locations || ""}
            onChange={(e) => handleAboutUsChange("statistics.locations", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="50+"
          />
        </div>
      </div>
    </SettingsSection>

    {/* Vision & Mission */}
    <SettingsSection title="Vision & Mission">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vision */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Vision Section</h4>
          <div>
            <label className="block text-sm font-medium mb-1">Vision Image</label>
            <FileUpload
              value={settings.aboutUsPage.visionImage || ""}
              onChange={(url) => handleAboutUsChange("visionImage", url)}
              placeholder="Upload vision image"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vision Title</label>
            <input
              type="text"
              value={settings.aboutUsPage.visionTitle || ""}
              onChange={(e) => handleAboutUsChange("visionTitle", e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Our Vision"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vision Text</label>
            <textarea
              value={settings.aboutUsPage.visionText || ""}
              onChange={(e) => handleAboutUsChange("visionText", e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder="Your company's vision statement..."
              maxLength={320}
            /><p className="text-xs text-gray-500 mt-1">
            {settings.aboutUsPage.visionText?.length || 0}/320 characters
          </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vision Highlighted Text</label>
            <textarea
              value={settings.aboutUsPage.visionText2 || ""}
              onChange={(e) => handleAboutUsChange("visionText2", e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder="Your company's vision statement..."
              maxLength={320}
            /><p className="text-xs text-gray-500 mt-1">
            {settings.aboutUsPage.visionText?.length || 0}/320 characters
          </p>
          </div>
        </div>

        {/* Mission */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Mission Section</h4>
          <div>
            <label className="block text-sm font-medium mb-1">Mission Image</label>
            <FileUpload
              value={settings.aboutUsPage.missionImage || ""}
              onChange={(url) => handleAboutUsChange("missionImage", url)}
              placeholder="Upload mission image"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mission Title</label>
            <input
              type="text"
              value={settings.aboutUsPage.missionTitle || ""}
              onChange={(e) => handleAboutUsChange("missionTitle", e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Our Mission"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mission Text</label>
            <textarea
              value={settings.aboutUsPage.missionText || ""}
              onChange={(e) => handleAboutUsChange("missionText", e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder="Your company's mission statement..."
              maxLength={320}
            /><p className="text-xs text-gray-500 mt-1">
            {settings.aboutUsPage.missionText?.length || 0}/320 characters
          </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mission Highlighted Text</label>
            <textarea
              value={settings.aboutUsPage.missionText2 || ""}
              onChange={(e) => handleAboutUsChange("missionText2", e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder="Your company's mission statement..."
              maxLength={320}
            /><p className="text-xs text-gray-500 mt-1">
            {settings.aboutUsPage.missionText?.length || 0}/320 characters
          </p>
          </div>
        </div>
      {/* Goals */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Goals Section</h4>
          <div>
            <label className="block text-sm font-medium mb-1">Goals Image</label>
            <FileUpload
              value={settings.aboutUsPage.goalImage || ""}
              onChange={(url) => handleAboutUsChange("goalImage", url)}
              placeholder="Upload goals image"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Goals Title</label>
            <input
              type="text"
              value={settings.aboutUsPage.goalTitle || ""}
              onChange={(e) => handleAboutUsChange("goalTitle", e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Our Goals"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Goals Text</label>
            <textarea
              value={settings.aboutUsPage.goalText || ""}
              onChange={(e) => handleAboutUsChange("goalText", e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder="Your company's goals statement..."
              maxLength={320}
            /><p className="text-xs text-gray-500 mt-1">
            {settings.aboutUsPage.goalText?.length || 0}/320 characters
          </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Goals Highlighted Text</label>
            <textarea
              value={settings.aboutUsPage.goalText2 || ""}
              onChange={(e) => handleAboutUsChange("goalText2", e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder="Your company's goals statement..."
              maxLength={320}
            /><p className="text-xs text-gray-500 mt-1">
            {settings.aboutUsPage.goalText?.length || 0}/320 characters
          </p>
          </div>
        </div>
      </div>
    </SettingsSection>
  </div>
)}

{activeTab === "testimonials" && (
  <div className="space-y-6">

    {/* Page Banner */}
    <SettingsSection title="Testimonials Page Banner">
      <label className="block text-sm font-medium mb-1">Banner Image</label>
      <FileUpload
        value={settings?.testimonialsPage?.bannerImage || ""}
        onChange={(url) => updateTestimonialsPage("bannerImage", url)}
        placeholder="Upload banner image"
        className="w-full"
      />
    </SettingsSection>

    {/* Testimonials */}
    <SettingsSection title="Testimonials">
      
      {/* Add Testimonial Button */}
      <div className="flex justify-end mb-4">
        <Button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
          onClick={addTestimonial}
        >
          Add Testimonial
        </Button>
      </div>

      {/* Testimonial Cards */}
      {settings?.testimonialsPage?.testimonials?.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 bg-gray-50 mb-4">

          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">
              Testimonial {index + 1}
            </h4>
            <Button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs"
              onClick={() => removeTestimonial(index)}
            >
              Remove
            </Button>
          </div>

          {/* Name */}
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateTestimonial(index, "name", e.target.value)}
            className="w-full p-2 border rounded mb-1"
            placeholder="Customer Name"
            maxLength={40}
          />
          <p className="text-xs text-gray-500">{item.name.length}/40</p>

          {/* Role */}
          <label className="block text-sm font-medium mt-3 mb-1">Role</label>
          <input
            type="text"
            value={item.role}
            onChange={(e) => updateTestimonial(index, "role", e.target.value)}
            className="w-full p-2 border rounded mb-1"
            placeholder="Home Buyer / Investor"
            maxLength={40}
          />
          <p className="text-xs text-gray-500">{item.role.length}/40</p>

          {/* Image */}
          <label className="block text-sm font-medium mt-3 mb-1">Profile Image</label>
          <FileUpload
            value={item.image}
            onChange={(url) => updateTestimonial(index, "image", url)}
            className="w-full"
          />

          {/* Description */}
          <label className="block text-sm font-medium mt-3 mb-1">Description</label>
          <textarea
            value={item.description}
            onChange={(e) =>
              updateTestimonial(index, "description", e.target.value)
            }
            className="w-full p-2 border rounded h-24"
            placeholder="Customer review..."
            maxLength={250}
          />
          <p className="text-xs text-gray-500">{item.description.length}/250</p>
        </div>
      ))}

    </SettingsSection>
  </div>
)}



  {/* ---- Save Buttons ---- */}
      <div className="flex justify-end space-x-4">
        {/* <Button variant="outline" onClick={fetchSettings} disabled={saving}>
          Reset Changes
        </Button> */}
        <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}