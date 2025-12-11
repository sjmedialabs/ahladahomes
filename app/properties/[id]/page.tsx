"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { api } from "@/hooks/use-api";
import type { Property } from "@/lib/types";

// Components
import HeroSection from "@/components/properties/property-details/HeroSection";
import ProjectHeader from "@/components/properties/property-details/ProjectHeader";
import TabsNavigation from "@/components/properties/property-details/TabsNavigation";
import OverviewSection from "@/components/properties/property-details/OverviewSection";
import FloorPlanSection from "@/components/properties/property-details/FloorPlanSection";
import AmenitiesSection from "@/components/properties/property-details/AmenitiesSection";
import SpecificationsSection from "@/components/properties/property-details/SpecificationsSection";
import ConnectivitySection from "@/components/properties/property-details/ConnectivitySection";
import GallerySection from "@/components/properties/property-details/GallerySection";
import WalkthroughSection from "@/components/properties/property-details/WalkthroughSection";
import BrochureSection from "@/components/properties/property-details/BrochureSection";
import ApartmentDetails from "@/components/properties/forms/ApartmentDetailsStep";
import ContactPopup from "@/components/contact-popup";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
const [SelectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [SelectedImage,setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [settings, setSettings] = useState<any>(null);
const [showContact, setShowContact] = useState(false);

const onContact = () => {
  setShowContact(true);
};

  useEffect(() => {
    fetchProperty();
    fetchSettings();
  }, [params.id]);

  // -------------------------------------
  // FETCH PROPERTY DETAILS
  // -------------------------------------
  const fetchProperty = async () => {
    if (!params.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${params.id}`);
      const result = await response.json();
      if (result.success && result.data) {
        setProperty(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch property:", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------
  // FETCH SITE SETTINGS
  // -------------------------------------
  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  if (loading) {
    return (
      <div className="h-[400px] flex justify-center items-center">
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="h-[400px] flex justify-center items-center text-red-500">
        Property not found
      </div>
    );
  }
// Check if property is created within last 30 days
const isLatestProperty = (() => {
  if (!property.createdAt) return false;

  const created = new Date(property.createdAt);
  const now = new Date();

  const diffInDays =
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

  return diffInDays <= 30; // last 30 days = latest property
})();

  // ------------------------------------
  // MAP PROPERTY TO UI FORMAT
  // ------------------------------------

  const mapped = {
    id: property._id,
    title: property.title,
    location: property.location,
    area: property.area,
    developerName: property.developerName || "Unknown Developer",
    type: property.type,
    status:
      property.status === "for-sale"
        ? "For Sale"
        : property.status === "for-rent"
        ? "For Rent"
        : property.status === "sold"
        ? "Sold"
        : "Rented",
    possession: property.possession,
    priceRange:
      property.status === "for-sale"
        ? `₹${(property.price / 100000).toFixed(2)} Cr`
        : `₹${property.price.toLocaleString()}/month`,

    pricePerSqft: `₹${Math.round(property.price / property.area)} /sqft`,

    images: property.images?.length ? property.images : ["/placeholder.svg"],
    videos: property.videos || [],

    highlights: property.highlights || [],
    amenities: property.amenities || [],
    amenitiesImages: property.gallery || [],
    locationMap: property.locationMap || "",
    masterPlan: property.masterPlan || "",
    description: property.description,
    hasTowers: property.hasTowers,
    supportsFloorPlans: property.supportsFloorPlans,
    towers: property.towers || [],
    floorPlans: property.floorPlans || [],
    apartmentDetails: property.apartmentDetails || null,
    villaDetails: property.villaDetails || null,
    commercialDetails: property.commercialDetails || null,
    plotDetails: property.plotDetails || null,
    farmLandDetails: property.farmLandDetails || null,
    specifications: {
      apartment: property.apartmentDetails?.specifications || null,
      villa: property.villaDetails?.specifications || null,
      commercial: property.commercialDetails?.specifications || null,
    },
    reraNo: property.reraNumber || "",
    connectivity: property.locationDetails || {},

    gallery: property.images || [],

    walkthroughVideos: property.videos,

    brochure: property.broucher || {},

    featured: property.featured,
    isLatest: isLatestProperty,
  };

  // ------------------------------------
  // DEFINE TABS BASED ON PROPERTY TYPE
  // ------------------------------------

  const tabs = [
    "Overview",
    ...(property.supportsFloorPlans ? ["Floor Plan"] : []),
    "Amenities",
    "Specifications",
    "Location Advantages",
    "Gallery",
    "Walkthrough",
    "Brochure",
  ];

  return (
    <div className="">
      {/* ⭐ HERO BANNER */}
      <HeroSection bannerImage={settings?.heroImage || mapped.images[0]} />
{/* Breadcrumb Navigation */} 
<div className="p-4">
   <div className="max-w-md lg:max-w-7xl mx-auto px-4">
     <nav className="text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px" }}>
       <span>Home</span>
        <span className="mx-2">/</span>
         <span>Properties</span>
          <span className="mx-2">/</span>
           <span className="text-gray-700">{mapped.title}</span>
            </nav>
             </div>
              </div>
      {/* ⭐ PROJECT HEADER */}
      <ProjectHeader data={mapped} onContact={onContact} />

      {/* ⭐ TABS */}
      <TabsNavigation tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* ⭐ TAB CONTENT */}
      <div className="">

        {activeTab === "Overview" && (
          <OverviewSection data={mapped} className="max-w-7xl mx-auto"/>
        )}

        {activeTab === "Floor Plan" && (
          property.supportsFloorPlans &&(
          <FloorPlanSection data={mapped} className="max-w-7xl mx-auto"/>)
        )}

        {activeTab === "Amenities" && (
          <AmenitiesSection amenities={mapped.amenities}/>
        )}

        {activeTab === "Specifications" && (
          <SpecificationsSection property={mapped}/>
        )}

        {activeTab === "Location Advantages" && (
          <ConnectivitySection locationDetails={mapped.connectivity}/>
        )}

        {activeTab === "Gallery" && (
          <GallerySection images={mapped.gallery} onOpenModal={(img) => setSelectedImage(img)}/>
        )}

        {activeTab === "Walkthrough" && (
          <WalkthroughSection   videos={mapped.videos}
  onOpenVideo={(url) => setSelectedVideo(url)} />
        )}

        {activeTab === "Brochure" && (
          <BrochureSection broucher={mapped.brochure} />
        )}
      {/* ⭐ IMAGE MODAL FOR GALLERY */}
{SelectedImage && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <div className="relative max-w-4xl w-full px-4">
      <img
        src={SelectedImage}
        className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
        alt="Selected"
      />

      {/* Close Button */}
      <button
        className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedImage(null);
        }}
      >
        ✕
      </button>
    </div>
  </div>
)}
{/* ⭐ VIDEO MODAL */}
{SelectedVideo && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    onClick={() => setSelectedVideo(null)}
  >
    <div className="relative max-w-4xl w-full px-4">
      <div className="w-full h-[70vh] bg-black rounded-lg overflow-hidden">
        {/* If MP4 file */}
        {SelectedVideo.endsWith(".mp4") ? (
          <video src={SelectedVideo} controls autoPlay className="w-full h-full" />
        ) : (
          <iframe
            src={SelectedVideo}
            className="w-full h-full"
            allowFullScreen
          />
        )}
      </div>

      {/* Close Button */}
      <button
        className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedVideo(null);
        }}
      >
        ✕
      </button>
    </div>
  </div>
)}

      </div>
<ContactPopup
  isOpen={showContact}
  onClose={() => setShowContact(false)}
  projectTitle={property?.title}
  propertyId={property?._id}
/>

    </div>
  );
}
