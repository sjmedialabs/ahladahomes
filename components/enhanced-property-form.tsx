"use client"

import type React from "react"
import FileUpload from "@/components/file-upload"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { EnhancedPropertyFormData, Property } from "@/lib/types"

interface EnhancedPropertyFormProps {
  propertyType: "apartment" | "villa" | "open-plot" | "commercial" | "farm-land"
  property?: EnhancedPropertyFormData
  propertyId?: string
  onSave: (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export default function EnhancedPropertyForm({
  propertyType,
  propertyId,
  property,
  onSave,
  onCancel,
}: EnhancedPropertyFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [, setLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadType, setUploadType] = useState<"image" | "video" | "brochure">("image");
  const [formData, setFormData] = useState<Property>({
    _id: "",
    title: "",
    description: "",
    price: 0,
    location: "",
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    type: propertyType,
    status: "for-sale",
    images: [""],
    videos: [],
    features: [""],
    featured: false,
    facing: "",
    floorNumber: 0,
    totalFloors: 0,
    furnished: "unfurnished",
    possession: "",
    reraNumber: "",
    developerName: "",
    brochureLink: "",
    createdAt: "",
    updatedAt: "",
    pricePerSqft: 0,
    apartmentDetails: {
      bhkType: "2bhk",
      floorPlans: "",
      buildingAmenities: [],
      specifications: {
        flooring: "",
        kitchen: "",
        bathroom: "",
        doors: "",
        windows: "",
        electrical: "",
        safety: [],
      },
    },
    villaDetails: {
      plotArea: 0,
      builtUpArea: 0,
      numberOfFloors: 1,
      floorPlans: "",
      gardenArea: 0,
      parkingSpaces: 1,
      villaType: "independent",
      gatedCommunity: false,
    },
    plotDetails: {
      plotDimensions: { length: 0, width: 0 },
      soilType: "",
      roadWidth: 0,
      cornerPlot: false,
      plotType: "residential",
      approvals: [],
      developmentPotential: "",
    },
    farmLandDetails: {
      landDimensions: { length: 0, width: 0 },
      soilType: "",
      roadWidth: 0,
      cornerPlot: false,
      approvals: [],
      developmentPotential: "",
    },
    amenitiesStructured: {
      building: [],
      recreational: [],
      convenience: [],
      connectivity: [],
      outdoor: [],
      safety: [],
    },
    locationDetails: {
      nearbyLandmarks: [],
      connectivity: { metro: [], bus: [], highway: [] },
    },
  })

  const steps = getStepsForPropertyType(propertyType)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (property || propertyId) {
          const data: Property =
            property || (await fetch(`/api/properties/${propertyId}`).then((res) => res.json()))
          setFormData((prev) => ({ ...prev, ...data }))
        }
      } catch (err) {
        console.error("Failed to prefill property:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [property, propertyId])

  // ✅ Validation logic
  const validateBasicInfo = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "Property title is required"
    if (!formData.price || formData.price <= 0) newErrors.price = "Enter a valid price"
    if (!formData.area || formData.area <= 0) newErrors.area = "Enter a valid area"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.facing.trim()) newErrors.facing = "Select a facing direction"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateBasicInfo()) {
      alert("Please fill in all the required fields before submitting.")
      return
    }
    if (currentStep === 1 && !validateBasicInfo()) return
    setCurrentStep((prev) => prev + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Step 1: Validate Basic Info
    if (!validateBasicInfo()) {
      return alert("Please fill in all the required fields before submitting.")
    }

    // ✅ Step 2: Validate images
    const hasValidImages = formData.images?.some((img: string) => img && img.trim() !== "")
    if (!hasValidImages) {
      return alert("Please upload at least one property image.")
    }

    // ✅ Step 3: Auto-calculate price per sqft
    const pricePerSqft =
      Number(formData.area) > 0
        ? Math.round(Number(formData.price) / Number(formData.area))
        : 0

    // ✅ Step 4: Construct the property payload
    const propertyData = {
      title: formData.title.trim(),
      description: formData.description?.trim() || "",
      price: Number(formData.price),
      pricePerSqft,
      location: formData.location.trim(),
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      area: Number(formData.area),
      type: formData.type,
      status: formData.status || "available",
      images: formData.images.filter((img) => img && img.trim() !== ""), // remove blanks
      videos: formData.videos?.filter((vid) => vid.videoUrl && vid.thumbnailUrl) || [],
      features: formData.features || [],
      featured: formData.featured || false,
      facing: formData.facing || "",
      floorNumber: Number(formData.floorNumber) || 0,
      totalFloors: Number(formData.totalFloors) || 0,
      furnished: formData.furnished || "unfurnished",
      possession: formData.possession || "",
      reraNumber: formData.reraNumber || "",
      developerName: formData.developerName || "",
      brochureLink: formData.brochureLink || "",
      apartmentDetails: formData.type === "apartment" ? formData.apartmentDetails : undefined,
      villaDetails: formData.type === "villa" ? formData.villaDetails : undefined,
      plotDetails: formData.type === "open-plot" ? formData.plotDetails : undefined,
      farmLandDetails: formData.type === "farm-land" ? formData.farmLandDetails : undefined,
      amenitiesStructured: formData.amenitiesStructured || {},
      locationDetails: formData.locationDetails || {},
    }

    try {
      let response: Response

      if (propertyId) {
        // ✅ Update property
        response = await fetch(`/api/properties/${propertyId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(propertyData),
        })
        if (!response.ok) throw new Error("Failed to update property")
        alert("Property updated successfully!")
      } else {
        // ✅ Create new property
        response = await fetch(`/api/properties`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(propertyData),
        })
        if (!response.ok) throw new Error("Failed to create property")
        alert("Property created successfully!")
      }

      const result = await response.json()
      onSave(result)
    } catch (err) {
      console.error("❌ Property save failed:", err)
      alert("Something went wrong. Please try again.")
    }
  }


  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderBasicInformation()
      case 2: return renderPropertySpecificDetails()
      case 3: return renderAmenitiesAndFeatures()
      case 4: return renderImagesAndMedia()
      default: return null
    }
  }

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Property Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Levonor Esquire"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        {/* Developer */}
        <div>
          <label className="block text-sm font-medium mb-1">Developer Name</label>
          <input
            type="text"
            value={formData.developerName}
            onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., ABC Developers"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full p-3 border rounded-lg"
            placeholder="5000000"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-medium mb-1">Area (sq ft)</label>
          <input
            type="number"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
            className="w-full p-3 border rounded-lg"
            placeholder="1200"
          />
          {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Banjara Hills, Hyderabad"
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </div>

        {/* Facing */}
        <div>
          <label className="block text-sm font-medium mb-1">Facing Direction</label>
          <select
            value={formData.facing}
            onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Facing</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="North-East">North-East</option>
            <option value="North-West">North-West</option>
            <option value="South-East">South-East</option>
            <option value="South-West">South-West</option>
          </select>
          {errors.facing && <p className="text-red-500 text-sm">{errors.facing}</p>}
        </div>
              <div>
        <label className="block text-sm font-medium mb-1">Possession</label>
        <input
          type="text"
          value={formData.possession}
          onChange={(e) => setFormData({ ...formData, possession: e.target.value })}
          className="w-full p-3 border rounded-lg"
          placeholder="e.g., Dec 2026"
        />
      </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => {
            const value = e.target.value
            if (value.length <= 600) setFormData({ ...formData, description: value })
          }}
          className="w-full p-3 border rounded-lg h-24"
          placeholder="Detailed property description..."
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          {errors.description && <p className="text-red-500">{errors.description}</p>}
          <p>{formData.description.length}/600 characters</p>
        </div>
      </div> 

      {/* Features */}
      <div>
        <label className="block text-sm font-medium mb-2">Features</label>
        <div className="space-y-2">
          {formData.features?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...formData.features]
                  newFeatures[index] = e.target.value
                  setFormData({ ...formData, features: newFeatures })
                }}
                className="w-full p-2 border rounded-lg"
                placeholder={`Feature ${index + 1}`}
              />
              {formData.features.length > 1 && (
                <button
                  type="button"
                  className="text-red-600 hover:text-red-700 font-medium"
                  onClick={() => {
                    const newFeatures = formData.features.filter((_, i) => i !== index)
                    setFormData({ ...formData, features: newFeatures })
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-3 py-1 border rounded-lg text-blue-600 hover:text-blue-700"
            onClick={() =>
              setFormData({ ...formData, features: [...(formData.features || []), ""] })
            }
          >
            Add Feature
          </button>
        </div>
      </div>
    </div>
  )


  const renderPropertySpecificDetails = () => {
    switch (propertyType) {
      case "apartment":
        return renderApartmentDetails()
      case "villa":
        return renderVillaDetails()
      case "open-plot":
        return renderPlotDetails()
      case "farm-land":
        return renderFarmLandDetails()
      default:
        return <div>Commercial property details coming soon...</div>
    }
  }

  const renderApartmentDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Apartment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BHK Type */}
        <div>
          <label className="block text-sm font-medium mb-1">BHK Type</label>
          <select
            value={formData.apartmentDetails?.bhkType}
            onChange={(e) =>
              setFormData({
                ...formData,
                apartmentDetails: { ...formData.apartmentDetails, bhkType: e.target.value as any },
              })
            }
            className="w-full p-3 border rounded-lg"
          >
            <option value="studio">Studio</option>
            <option value="1bhk">1 BHK</option>
            <option value="2bhk">2 BHK</option>
            <option value="3bhk">3 BHK</option>
            <option value="4bhk">4 BHK</option>
            <option value="5bhk">5+ BHK</option>
            <option value="penthouse">Penthouse</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bedrooms</label>
          <input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
            className="w-full p-3 border rounded-lg"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bathrooms</label>
          <input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
            className="w-full p-3 border rounded-lg"
            min="0"
          />
        </div>
        {/* Floor Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Floor Number</label>
          <input
            type="number"
            value={formData.floorNumber}
            onChange={(e) => setFormData({ ...formData, floorNumber: Number(e.target.value) })}
            className="w-full p-3 border rounded-lg"
            min="0"
          />
        </div>

        {/* Total Floors */}
        <div>
          <label className="block text-sm font-medium mb-1">Total Floors</label>
          <input
            type="number"
            value={formData.totalFloors}
            onChange={(e) => setFormData({ ...formData, totalFloors: Number(e.target.value) })}
            className="w-full p-3 border rounded-lg"
            min="1"
          />
        </div>

        {/* Furnished Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Furnished Status</label>
          <select
            value={formData.furnished}
            onChange={(e) => setFormData({ ...formData, furnished: e.target.value as any })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="furnished">Fully Furnished</option>
          </select>
        </div>

        {/* RERA Number */}
        <div>
          <label className="block text-sm font-medium mb-1">RERA Number</label>
          <input
            type="text"
            value={formData.reraNumber}
            onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., P02400003069"
          />
        </div>
      </div>

      {/* Floor Plan Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Floor Plan</label>
        <FileUpload
          value={formData.apartmentDetails?.floorPlans ? String(formData.apartmentDetails?.floorPlans) : ""}
          onChange={(url) =>
            setFormData({
              ...formData,
              apartmentDetails: { ...formData.apartmentDetails, floorPlans: url },
            })
          }
          placeholder="Upload floor plan image"
        />
      </div>

      {/* Specifications */}
      <div>
        <h4 className="font-medium mb-3">Specifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Flooring</label>
            <input
              type="text"
              value={formData.apartmentDetails?.specifications?.flooring}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  apartmentDetails: {
                    ...formData.apartmentDetails,
                    specifications: { ...formData.apartmentDetails?.specifications, flooring: e.target.value },
                  },
                })
              }
              className="w-full p-2 border rounded"
              placeholder="e.g., Vitrified tiles"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kitchen</label>
            <input
              type="text"
              value={formData.apartmentDetails?.specifications?.kitchen}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  apartmentDetails: {
                    ...formData.apartmentDetails,
                    specifications: { ...formData.apartmentDetails?.specifications, kitchen: e.target.value },
                  },
                })
              }
              className="w-full p-2 border rounded"
              placeholder="e.g., Modular kitchen"
            />
          </div>
        </div>
      </div>
    </div>
  )
  const renderVillaDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Villa Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Plot Area (sq ft)</label>
          <input
            type="number"
            value={formData.villaDetails?.plotArea}
            onChange={(e) =>
              setFormData({ ...formData, villaDetails: { ...formData.villaDetails, plotArea: Number(e.target.value) } })
            }
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Built-up Area (sq ft)</label>
          <input
            type="number"
            value={formData.villaDetails?.builtUpArea}
            onChange={(e) =>
              setFormData({ ...formData, villaDetails: { ...formData.villaDetails, builtUpArea: Number(e.target.value) } })
            }
            className="w-full p-3 border rounded-lg"
          />
        </div>
                <div>
          <label className="block text-sm font-medium mb-1">Bedrooms</label>
          <input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
            className="w-full p-3 border rounded-lg"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bathrooms</label>
          <input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
            className="w-full p-3 border rounded-lg"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Floors</label>
          <input
            type="number"
            value={formData.villaDetails?.numberOfFloors}
            onChange={(e) =>
              setFormData({ ...formData, villaDetails: { ...formData.villaDetails, numberOfFloors: Number(e.target.value) } })
            }
            className="w-full p-3 border rounded-lg"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Garden Area (sq ft)</label>
          <input
            type="number"
            value={formData.villaDetails?.gardenArea}
            onChange={(e) =>
              setFormData({ ...formData, villaDetails: { ...formData.villaDetails, gardenArea: Number(e.target.value) } })
            }
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Parking Spaces</label>
          <input
            type="number"
            value={formData.villaDetails?.parkingSpaces}
            onChange={(e) =>
              setFormData({ ...formData, villaDetails: { ...formData.villaDetails, parkingSpaces: Number(e.target.value) } })
            }
            className="w-full p-3 border rounded-lg"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Villa Type</label>
          <select
            value={formData.villaDetails?.villaType}
            onChange={(e) =>
              setFormData({ ...formData, villaDetails: { ...formData.villaDetails, villaType: e.target.value as any } })
            }
            className="w-full p-3 border rounded-lg"
          >
            <option value="independent">Independent Villa</option>
            <option value="row-house">Row House</option>
            <option value="duplex">Duplex</option>
            <option value="triplex">Triplex</option>
          </select>
        </div>
      </div>

      {/* Gated Community */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.villaDetails?.gatedCommunity}
            onChange={(e) =>
              setFormData({ ...formData, villaDetails: { ...formData.villaDetails, gatedCommunity: e.target.checked } })
            }
            className="rounded"
          />
          <span className="text-sm font-medium">Gated Community</span>
        </label>
      </div>

      {/* Floor Plan Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Floor Plan</label>
        <FileUpload
          value={formData.villaDetails?.floorPlans ? String(formData.villaDetails?.floorPlans) : ""}
          onChange={(url) =>
            setFormData({ ...formData, villaDetails: { ...formData.villaDetails, floorPlans: url } })
          }
          placeholder="Upload floor plan image"
        />
      </div>
    </div>
  )


  const renderPlotDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Plot Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Plot Length (ft)</label>
          <input
            type="number"
            value={formData.plotDetails?.plotDimensions.length}
            onChange={(e) =>
              setFormData({
                ...formData,
                plotDetails: {
                  ...formData.plotDetails,
                  plotDimensions: { ...formData.plotDetails?.plotDimensions, length: Number(e.target.value) },
                },
              })
            }
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Plot Width (ft)</label>
          <input
            type="number"
            value={formData.plotDetails?.plotDimensions.width}
            onChange={(e) =>
              setFormData({
                ...formData,
                plotDetails: {
                  ...formData.plotDetails,
                  plotDimensions: { ...formData.plotDetails?.plotDimensions, width: Number(e.target.value) },
                },
              })
            }
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Road Width (ft)</label>
          <input
            type="number"
            value={formData.plotDetails?.roadWidth}
            onChange={(e) =>
              setFormData({
                ...formData,
                plotDetails: { ...formData.plotDetails, roadWidth: Number(e.target.value) },
              })
            }
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Plot Type</label>
          <select
            value={formData.plotDetails?.plotType}
            onChange={(e) =>
              setFormData({
                ...formData,
                plotDetails: { ...formData.plotDetails, plotType: e.target.value as any },
              })
            }
            className="w-full p-3 border rounded-lg"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="agricultural">Agricultural</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Soil Type</label>
          <input
            type="text"
            value={formData.plotDetails?.soilType}
            onChange={(e) =>
              setFormData({
                ...formData,
                plotDetails: { ...formData.plotDetails, soilType: e.target.value },
              })
            }
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Red soil, Black cotton soil"
          />
        </div>
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.plotDetails?.cornerPlot}
            onChange={(e) =>
              setFormData({
                ...formData,
                plotDetails: { ...formData.plotDetails, cornerPlot: e.target.checked },
              })
            }
            className="rounded"
          />
          <span className="text-sm font-medium">Corner Plot</span>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Development Potential</label>
        <textarea
          value={formData.plotDetails?.developmentPotential}
          onChange={(e) =>
            setFormData({
              ...formData,
              plotDetails: { ...formData.plotDetails, developmentPotential: e.target.value },
            })
          }
          className="w-full p-3 border rounded-lg h-20"
          placeholder="Describe the development potential of this plot..."
        />
      </div>
    </div>
  )

  const renderFarmLandDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Farm Land Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Land Length (ft)</label>
          <input
            type="number"
            value={formData.farmLandDetails?.landDimensions?.length}
            onChange={(e) =>
              setFormData({
                ...formData,
                farmLandDetails: {
                  ...formData.farmLandDetails,
                  landDimensions: { ...formData.farmLandDetails?.landDimensions, length: Number(e.target.value) },
                },
              })
            }
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Land Width (ft)</label>
          <input
            type="number"
            value={formData.farmLandDetails?.landDimensions?.width}
            onChange={(e) =>
              setFormData({
                ...formData,
                farmLandDetails: {
                  ...formData.farmLandDetails,
                  landDimensions: { ...formData.farmLandDetails?.landDimensions, width: Number(e.target.value) },
                },
              })
            }
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Road Width (ft)</label>
          <input
            type="number"
            value={formData.farmLandDetails?.roadWidth}
            onChange={(e) =>
              setFormData({
                ...formData,
                farmLandDetails: { ...formData.farmLandDetails, roadWidth: Number(e.target.value) },
              })
            }
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Soil Type</label>
          <input
            type="text"
            value={formData.farmLandDetails?.soilType}
            onChange={(e) =>
              setFormData({
                ...formData,
                farmLandDetails: { ...formData.farmLandDetails, soilType: e.target.value },
              })
            }
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Red soil, Black cotton soil"
          />
        </div>
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.farmLandDetails?.cornerPlot}
            onChange={(e) =>
              setFormData({
                ...formData,
                farmLandDetails: { ...formData.farmLandDetails, cornerPlot: e.target.checked },
              })
            }
            className="rounded"
          />
          <span className="text-sm font-medium">Corner Plot</span>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Working Potential</label>
        <textarea
          value={formData.farmLandDetails?.developmentPotential}
          onChange={(e) =>
            setFormData({
              ...formData,
              farmLandDetails: { ...formData.farmLandDetails, developmentPotential: e.target.value },
            })
          }
          className="w-full p-3 border rounded-lg h-20"
          placeholder="Describe the development potential of this plot..."
        />
      </div>
    </div>
  )

  const renderAmenitiesAndFeatures = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Amenities & Features</h3>

      {Object.entries(amenitiesOptions).map(([category, options]) => (
        <div key={category}>
          <h4 className="font-medium mb-3 capitalize">{category.replace(/([A-Z])/g, " $1").trim()}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {options.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={
                    formData.amenitiesStructured[category as keyof typeof formData.amenitiesStructured]?.includes(
                      amenity,
                    ) || false
                  }
                  onChange={(e) => {
                    const currentAmenities =
                      formData.amenitiesStructured[category as keyof typeof formData.amenitiesStructured] || []
                    const updatedAmenities = e.target.checked
                      ? [...currentAmenities, amenity]
                      : currentAmenities.filter((a: string) => a !== amenity)

                    setFormData({
                      ...formData,
                      amenitiesStructured: {
                        ...formData.amenitiesStructured,
                        [category]: updatedAmenities,
                      },
                    })
                  }}
                  className="rounded"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const renderImagesAndMedia = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Images & Media</h3>

        {/* Toggle Buttons */}
        <div className="flex space-x-4 mb-4">
          <Button
            type="button"
            variant={uploadType === "image" ? "default" : "outline"}
            onClick={() => setUploadType("image")}
          >
            Upload Images
          </Button>
          <Button
            type="button"
            variant={uploadType === "video" ? "default" : "outline"}
            onClick={() => setUploadType("video")}
          >
            Upload Videos
          </Button>
          <Button
            type="button"
            variant={uploadType === "brochure" ? "default" : "outline"}
            onClick={() => setUploadType("brochure")}
          >
            Upload Brochure
          </Button>
        </div>

        {/* Image Upload Section */}
        {uploadType === "image" && (
          <div>
            <label className="block text-sm font-medium mb-3">Property Images</label>
            <div className="space-y-4 flex flex-wrap gap-4">
              {formData.images.map((image: string | undefined, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Image {index + 1}</span>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_: any, i: number) => i !== index)
                          setFormData({ ...formData, images: newImages })
                        }}
                        className="text-red-600 hover:text-red-700 p-1 rounded-full"
                        title="Remove Image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                    )}
                  </div>
                  <FileUpload
                    value={image}
                    onChange={(url) => {
                      const newImages = [...formData.images]
                      newImages[index] = url
                      setFormData({ ...formData, images: newImages })
                    }}
                    placeholder={`Upload property image ${index + 1}`}
                    accept="image/*"
                    className="w-60"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ ...formData, images: [...formData.images, ""] })}
                className="w-full"
              >
                Add Another Image
              </Button>
            </div>
          </div>
        )}

        {/* Video Upload Section */}
        {uploadType === "video" && (
          <div>
            <label className="block text-sm font-medium mb-3">Property Videos</label>
            <div className="space-y-4">
              {formData.videos?.map((video: any, index: number) => (
                <div key={index} className="space-y-2 border p-4 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Video {index + 1}</span>
                    {formData.videos && formData.videos.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newVideos = formData.videos?.filter((_: any, i: number) => i !== index)
                          setFormData({ ...formData, videos: newVideos })
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove Video
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    {/* Video File Upload */}
                    <FileUpload
                      value={video.videoUrl}
                      onChange={(url) => {
                        const newVideos = [...formData.videos || []]
                        newVideos[index] = { ...newVideos[index], videoUrl: url }
                        setFormData({ ...formData, videos: newVideos })
                      }}
                      placeholder={`Upload video file`}
                      accept="video/*"
                      className="w-full"
                    />

                    {/* Thumbnail Upload */}
                    <FileUpload
                      value={video.thumbnailUrl}
                      onChange={(url) => {
                        const newVideos = [...formData.videos || []]
                        newVideos[index] = { ...newVideos[index], thumbnailUrl: url }
                        setFormData({ ...formData, videos: newVideos })
                      }}
                      placeholder={`Upload video thumbnail`}
                      accept="image/*"
                      className="w-full"
                    /></div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormData({
                    ...formData,
                    videos: [...formData.videos || [], { videoUrl: "", thumbnailUrl: "" }],
                  })
                }
                className="w-full"
              >
                Add Another Video
              </Button>
            </div>
          </div>
        )}
        {/* Brochure Upload Section */}
{uploadType === "brochure" && (
  <div>
    <label className="block text-sm font-medium mb-3">Property Brochure (PDF)</label>
    <div className="space-y-4">
      <FileUpload
        value={String(formData.brochureLink ?? "")}
        onChange={(url) => setFormData({ ...formData, brochureLink: url })}
        placeholder="Upload brochure PDF"
        accept="application/pdf"
        multiple={false} // only single file
        className="w-full"
      />
    </div>
  </div>
)}


        {/* Featured Property Checkbox */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium">Featured Property</span>
          </label>
        </div>
      </div>
    )
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {propertyId ? "Edit" : "Add"}{" "}
                {propertyType.charAt(0).toUpperCase() + propertyType.slice(1).replace("-", " ")}
              </h2>
              <p className="text-gray-600">
                Step {currentStep} of {steps.length}
              </p>
            </div>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index + 1 <= currentStep ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${index + 1 <= currentStep ? "text-red-500" : "text-gray-600"}`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${index + 1 < currentStep ? "bg-red-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : onCancel())}
              >
                {currentStep > 1 ? "Previous" : "Cancel"}
              </Button>

              {currentStep < steps.length ? (

                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Next
                </Button>
              ) : (
                <div className="flex gap-2">
                  {/* <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                    Back to Location
                  </Button> */}
                  <Button type="submit" className="bg-red-500 hover:bg-red-600">
                    {propertyId ? "Update Property" : "Save Property"}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


// Steps
function getStepsForPropertyType(type: string) {
  return ["Basic Info", "Property Details", "Amenities", "Images"]
}

// Amenities options (keep as-is)
const amenitiesOptions = {
  building: ["Elevator", "Security", "Power Backup", "Water Supply", "Parking", "CCTV"],
  recreational: ["Swimming Pool", "Gym", "Clubhouse", "Sports Court", "Children's Play Area", "Jogging Track"],
  convenience: ["Shopping Center", "ATM", "Laundry", "Housekeeping", "Maintenance", "Concierge"],
  connectivity: ["Wi-Fi", "Intercom", "Cable TV", "High-Speed Internet", "Smart Home Features"],
  outdoor: ["Garden", "Terrace", "Balcony", "Landscaping", "Water Features", "Outdoor Seating"],
  safety: ["Fire Safety", "Emergency Exit", "Security Guards", "Access Control", "Smoke Detectors"],
}
