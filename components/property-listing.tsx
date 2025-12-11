"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { Property } from "@/lib/types"
import ContactPopup from "./contact-popup"

interface PropertyListingProps {
  title: string
  propertyType: "residential" | "commercial" | "open-plot" | "farm-land"
}

export default function PropertyListing({ title, propertyType }: PropertyListingProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [filters, setFilters] = useState({
    rentBuy: "any",
    propertyType: "all",
    bhk: [] as string[],
    facing: [] as string[],
    saleType: [] as string[],
    constructionStatus: [] as string[],
    verifiedType: false,
    budget: "any",
  })

  const [sortBy, setSortBy] = useState("price-low-high")
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<any>(null);
  const locationQuery = searchParams?.get("location") || ""
  const nameQuery = searchParams?.get("name") || ""

  // --- Initialize rentBuy from URL on mount / when query changes ---
  useEffect(() => {
    const rb = searchParams?.get("rentBuy")
    if (rb === "rent" || rb === "buy" || rb === "any") {
      setFilters((prev) => ({ ...prev, rentBuy: rb }))
    }
  }, [searchParams])

  // --- Initialize propertyType from URL on mount / when query changes ---
  useEffect(() => {
    const pt = searchParams?.get("propertyType")
    if (pt === "residential" || pt === "commercial" || pt === "open-plot" || pt === "farm-land") {
      setFilters((prev) => ({ ...prev, propertyType: pt }))
    }
  }, [searchParams])
useEffect(() => {
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      const result = await res.json();

      if (result) {
        setSettings(result);
      }
      console.log("Settings fetched:", result);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSettings();
}, []);
  // --- Fetch properties once (same as before) ---
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/properties")
        const result = await response.json()
        if (result.success && result.data) {
          setProperties(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const mapApiTypeToDisplayType = (apiType: Property["type"]) => {
    switch (apiType) {
      case "apartment":
        return "apartments"
      case "villa":
        return "residential"
      case "commercial":
        return "commercial"
      case "open-plot":
        return "open-plot"
      case "farm-land":
        return "farm-land"
      default:
        return "residential"
    }
  }

const mapPropertyToDisplay = (property: Property) => {
  const bedrooms =
    property.type === "apartment"
      ? property.apartmentDetails?.bedrooms
      : property.type === "villa"
      ? property.villaDetails?.bedrooms
      : null;

  const bathrooms =
    property.type === "apartment"
      ? property.apartmentDetails?.bathrooms
      : property.type === "villa"
      ? property.villaDetails?.bathrooms
      : null;

  return {
    id: property._id,
    title: property.title,
    location: property.location,
    image: property.images?.[0] || "/placeholder.svg",
    possession: property.possession,

    featured: property.featured,  // ⭐ Needed for verified filter

    // Add construction status 
    constructionStatus: property.constructionStatus || [],

    // Add bhkType (main fix)
    bhkType: property.apartmentDetails?.bhkType || null,

    // For UI display
    bhk:
      property.apartmentDetails?.bhkType
        ? property.apartmentDetails.bhkType.toUpperCase().replace("BHK", " BHK")
        : null,

    beds:
      bedrooms ? `${bedrooms} BHK` : null,

    bathrooms: bathrooms ? `${bathrooms} Bath` : null,

    sqft: `${property.area} sq ft`,

    price:
      property.status === "for-sale"
        ? `₹${(property.price / 100000).toFixed(2)} Cr`
        : `₹${property.price.toLocaleString()}/month`,
    avgPrice: `₹${Math.round(property.price / property.area)}/sq ft`,
    priceValue: property.price,

    propertyType:
      property.type === "apartment"
        ? "apartments"
        : property.type === "villa"
        ? "residential"
        : property.type,

    rentBuy: property.status === "for-sale" ? "buy" : "rent",

    facing: property.facing || null,
  }
}

  const filteredProperties = useMemo(() => {
    if (loading) return [];

    let filtered = properties.map(mapPropertyToDisplay);

    /* ------------------------- PAGE PROPERTY TYPE FILTER ------------------------- */
    if (propertyType !== "residential") {
      filtered = filtered.filter(
        (p) => p.propertyType === propertyType
      );
    } else {
      // Residential = Apartments + Villas
      filtered = filtered.filter(
        (p) =>
          p.propertyType === "residential" ||
          p.propertyType === "apartments"
      );
    }

    /* ------------------------- LOCATION FILTER ------------------------- */
    if (locationQuery) {
      filtered = filtered.filter((p) =>
        p.location?.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    /* ------------------------- NAME FILTER ------------------------- */
    if (nameQuery) {
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(nameQuery.toLowerCase())
      );
    }

    /* ------------------------- RENT/BUY FILTER ------------------------- */
    if (filters.rentBuy !== "any") {
      filtered = filtered.filter((p) => p.rentBuy === filters.rentBuy);
    }

    /* ------------------------- SIDE FILTER: PROPERTY TYPE ------------------------- */
    if (filters.propertyType !== "all") {
      filtered = filtered.filter((p) => p.propertyType === filters.propertyType);
    }

    /* ------------------------- BHK FILTER (Apartment / Villa Only) ------------------------- */
if (filters.bhk.length > 0) {
  filtered = filtered.filter((p) =>
    filters.bhk.includes(p.bhkType || "")
  );
}


    /* ------------------------- FACING FILTER ------------------------- */
    if (filters.facing.length > 0) {
      filtered = filtered.filter((p) =>
        filters.facing.includes(p.facing || "")
      );
    }

    /* ------------------------- VERIFIED FILTER ------------------------- */
    if (filters.verifiedType) {
      filtered = filtered.filter((p) => p.featured === true);
    }

/* ------------------------- CONSTRUCTION STATUS (Using possession) ------------------------- */
if (filters.constructionStatus.length > 0) {
  filtered = filtered.filter((p) => {
    const pos = (p.possession || "").toLowerCase().trim();

    const today = new Date();

    // Try parsing year or date
    let possessionDate: Date | null = null;

    if (/\d{4}/.test(pos)) {
      // Contains a year like "2025"
      possessionDate = new Date(`${pos}-01-01`);
    } else if (!isNaN(Date.parse(pos))) {
      // Actual date string
      possessionDate = new Date(pos);
    }

    // --- READY TO MOVE LOGIC ---
    const readyToMove =
      pos.includes("ready") ||
      pos.includes("immediate") ||
      (possessionDate && possessionDate < today);

    // --- UNDER CONSTRUCTION LOGIC ---
    const underConstruction =
      pos.includes("under") ||
      (possessionDate && possessionDate > today);

    // Apply filter based on selected checkboxes
    if (filters.constructionStatus.includes("Ready to move") && readyToMove)
      return true;

    if (filters.constructionStatus.includes("Under Construction") && underConstruction)
      return true;

    return false;
  });
}


    /* ------------------------- BUDGET FILTER ------------------------- */
    if (filters.budget === "no-budget") {
      filtered = filtered.filter((p) => p.priceValue === 0);
    }

    return filtered;
  }, [properties, propertyType, filters, loading, locationQuery, nameQuery]);


  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties]

    switch (sortBy) {
      case "price-low-high":
        return sorted.sort((a, b) => a.priceValue - b.priceValue)
      case "price-high-low":
        return sorted.sort((a, b) => b.priceValue - a.priceValue)
      default:
        return sorted
    }
  }, [filteredProperties, sortBy])

  // --- Enhanced handleFilterChange: also sync rentBuy to URL ---
  const handleFilterChange = (filterType: string, value: string, checked?: boolean) => {
    // If changing rentBuy, update filter AND update URL param so hero or any other link can set it
    if (filterType === "rentBuy") {
      const next = value
      setFilters((prev) => ({ ...prev, rentBuy: next }))
      // update URL query param (preserve pathname)
      const qp = new URLSearchParams()
      qp.set("rentBuy", next)
      router.replace(`${pathname}?${qp.toString()}`, { scroll: false })
      return
    }

    setFilters((prev) => {
      if (
        filterType === "bhk" ||
        filterType === "facing" ||
        filterType === "saleType" ||
        filterType === "constructionStatus"
      ) {
        const currentArray = prev[filterType as keyof typeof prev] as string[]
        if (checked) {
          return { ...prev, [filterType]: [...currentArray, value] }
        } else {
          return { ...prev, [filterType]: currentArray.filter((item) => item !== value) }
        }
      } else if (filterType === "verifiedType") {
        return { ...prev, [filterType]: checked || false }
      } else {
        return { ...prev, [filterType]: value }
      }
    })
  }

  useEffect(() => {
    if (locationQuery) setFilters(prev => ({ ...prev, location: locationQuery }))
    if (nameQuery) setFilters(prev => ({ ...prev, name: nameQuery }))
  }, [locationQuery, nameQuery])

  // const router = useRouter()

  const handleViewMore = (propertyId: number | string) => {
    router.push(`/properties/${propertyId}`)
  }




  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative z-20">
          <Navbar />
        </div>
        <div className="flex items-center justify-center h-64 mt-[380px]">
          <div className="text-lg">Loading properties...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="">
      {/* Banner Section - Full width, behind navbar */}
      <div
        className=" top-0 left-0 w-full h-[400px] bg-cover bg-center bg-no-repeat z-[30]"
        style={{
          backgroundImage: `url(${settings?.heroImage || ""})`,
        }}
      >
      </div>
      {/* Main Content */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <div className="lg:w-1/4 bg-white p-8">
              <div className="space-y-6 flex lg:flex-col flex-wrap justify-around gap-4">
                {/* Rent/Buy Filter */}
                <div className="border-1 border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Rent / Buy
                  </h3>
                  <div className="h-[1px] bg-gray-200"></div>
                  <div className="space-y-2">
                    {[
                      { value: "any", label: "Any" },
                      { value: "rent", label: "Rent" },
                      { value: "buy", label: "Buy" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="rentBuy"
                          value={option.value}
                          checked={filters.rentBuy === option.value}
                          className="mr-2 text-green-500"
                          onChange={(e) => handleFilterChange("rentBuy", e.target.value)}
                        />
                        <span className="text-sm text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Property Type Filter */}
                <div className="border-1 border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Property type
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All" },
                      { value: "apartments", label: "Apartments" },
                      { value: "residential", label: "Residential" },
                      { value: "commercial", label: "Commercial" },
                      { value: "open-plots", label: "Open Plots" },
                      { value: "farm-lands", label: "Farm Lands" },
                    ].map((type) => (
                      <label key={type.value} className="flex items-center">
                        <input
                          type="radio"
                          name="propertyType"
                          value={type.value}
                          checked={filters.propertyType === type.value}
                          className="mr-2 text-green-500"
                          onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                        />
                        <span className="text-sm text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* BHK Filter */}
                <div className="border-1 border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
                    BHK
                  </h3>
                  <div className="space-y-2">
                    {["1bhk", "2bhk", "3bhk", "4bhk", "studio"].map((bhk) => (
                      <label key={bhk} className="flex items-center">
                        <input
                          type="checkbox"
                          value={bhk}
                          checked={filters.bhk.includes(bhk)}
                          className="mr-2 text-green-500"
                          onChange={(e) => handleFilterChange("bhk", e.target.value, e.target.checked)}
                        />
                        <span className="text-sm text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                          {bhk}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Facing Filter */}
                <div className="border-1 border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Facing
                  </h3>
                  <div className="space-y-2">
                    {["East", "North", "West", "South", "North-East"].map(
                      (facing) => (
                        <label key={facing} className="flex items-center">
                          <input
                            type="checkbox"
                            value={facing}
                            checked={filters.facing.includes(facing)}
                            className="mr-2 text-green-500"
                            onChange={(e) => handleFilterChange("facing", e.target.value, e.target.checked)}
                          />
                          <span className="text-sm text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                            {facing}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                {/* Sale Type Filter */}
                {/* <div className="border-1 border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Sale type
                  </h3>
                  <div className="space-y-2">
                    {["2bhk", "3bhk", "4bhk"].map((saleType) => (
                      <label key={saleType} className="flex items-center">
                        <input
                          type="checkbox"
                          value={saleType}
                          checked={filters.saleType.includes(saleType)}
                          className="mr-2 text-green-500"
                          onChange={(e) => handleFilterChange("saleType", e.target.value, e.target.checked)}
                        />
                        <span className="text-sm text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                          {saleType}
                        </span>
                      </label>
                    ))}
                  </div>
                </div> */}

                {/* Construction Status Filter */}
                <div className="border-1 border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Construction Status
                  </h3>
                  <div className="space-y-2">
                    {["Under Construction", "Ready to move"].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          value={status}
                          checked={filters.constructionStatus.includes(status)}
                          className="mr-2 text-green-500"
                          onChange={(e) => handleFilterChange("constructionStatus", e.target.value, e.target.checked)}
                        />
                        <span className="text-sm text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Verified Type Filter */}
                <div className="border-1 border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Verified type
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.verifiedType}
                        className="mr-2 text-green-500"
                        onChange={(e) => handleFilterChange("verifiedType", "verified", e.target.checked)}
                      />
                      <span className="text-sm text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Only verified properties
                      </span>
                    </label>
                  </div>
                </div>

                {/* Budget Filter */}
                <div className="border-1 border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold mb-3 text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Budget
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: "any", label: "Any Budget" },
                      { value: "no-budget", label: "No Budget" },
                    ].map((budget) => (
                      <label key={budget.value} className="flex items-center">
                        <input
                          type="radio"
                          name="budget"
                          value={budget.value}
                          checked={filters.budget === budget.value}
                          className="mr-2 text-green-500"
                          onChange={(e) => handleFilterChange("budget", e.target.value)}
                        />
                        <span className="text-sm text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                          {budget.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Property Cards */}
            <div className="lg:w-3/4">
              <div className="flex md:flex-row flex-col md:justify-between items-center py-4 ">
                <div className="mb-6 flex items-center">
                  <p className="text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Showing {sortedProperties.length} properties
                  </p>
                </div>
                {/* Filter by dropdown in top right */}
                <div className="flex items-center">
                  <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-lg">
                    <span className="text-sm text-gray-600" style={{ fontFamily: "Poppins, sans-serif" }}>
                      Filter by:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm border-none outline-none bg-transparent"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      <option value="price-low-high">Price low - high</option>
                      <option value="price-high-low">Price high - low</option>
                      {/* <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option> */}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {sortedProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex gap-4 border-1 border-gray-200 flex-col justify-center items-center md:flex-row"
                  >
                    {/* IMAGE LEFT */}
                    <div className="w-60 h-52 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="object-cover"
                      />
                    </div>

                    {/* CONTENT CENTER */}
                    <div className="flex flex-col justify-between flex-grow">

                      {/* TITLE + LOCATION */}
                      <div className="flex flex-wrap items-center gap-1 justify-center md:justify-between py-4 px-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "Poppins" }}>
                            {property.title}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            {property.location}
                          </p></div>
                        {/* RIGHT BUTTON */}
                        <div className="flex items-center">
                          <button
                            onClick={() => handleViewMore(property.id)}
                            className="bg-gold3 hover:bg-gold1 text-white px-6 py-2 rounded-lg text-sm font-medium"
                          >
                            Explore More..
                          </button>
                        </div>
                      </div>
                      <div className="h-[2px] bg-gray-200"></div>
                      {/* PRICE + SQFT + STATUS */}
                      <div className="flex md:flex-row flex-col items-center gap-6 px-2 py-4 justify-between">
                        <div className="flex flex-col items-center px-6">
                          <p className="font-bold text-lg">{property.price}</p>
                          <p className="text-gray-500 text-xs">{property.avgPrice}</p>
                        </div>

                        <div className="flex flex-col items-center px-6">
                          <p className="text-gray-900 font-semibold">{property.sqft}</p>
                          <p className="text-gray-500 text-xs">Build up Area</p>
                        </div>

                        <div className="flex flex-col items-center px-6">
                          <p className="text-gray-900 font-semibold">{(property.possession || "-")}</p>
                          <p className="text-gray-500 text-xs">Possession Date</p>
                        </div>
                      </div>
                      <div className="h-[2px] bg-gray-200"></div>
                      {/* INFORMATION ROW */}
                      <div className="flex flex-wrap gap-4 px-4 py-4 text-xs text-gray-600 justify-between">
                        {property.facing && <p>• Facing: {property.facing}</p>}
                        {property.bhk && <p>• Apartment Type: {property.bhk}</p>}
                        {property.bathrooms && <p>• {property.bathrooms}</p>}
                        {property.beds && <p>• {property.beds}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>


              {sortedProperties.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
                    No properties found matching your criteria.
                  </p>
                  <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Try adjusting your filters to see more results.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
