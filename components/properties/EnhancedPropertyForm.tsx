"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types";

// Steps
import StepperHeader from "./forms/StepperHeader";
import BasicInfoStep from "./forms/BasicInfoStep";
import ApartmentStep from "./forms/ApartmentDetailsStep";
import VillaStep from "./forms/VillaDetailsStep";
import PlotStep from "./forms/PlotDetailsStep";
import FarmLandStep from "./forms/FarmLandDetailsStep";
import CommercialStep from "./forms/CommercialDetailsStep";
import AmenitiesStep from "./forms/AmenitiesStep";
import ImagesMediaStep from "./forms/ImagesMediaStep";

type PropertyType = Property["type"];

interface Props {
  propertyType: PropertyType;
  property?: Property;
  propertyId?: string;
  onCancel: () => void;
  onSave: (prop: any) => void;
}

export default function EnhancedPropertyForm({
  propertyType,
  propertyId,
  property,
  onCancel,
  onSave,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* =============================
      DEFAULT EMPTY FORM DATA
  ============================= */
  const [formData, setFormData] = useState<Property>({
    title: "",
    subtitle: "",
    description: "",
    price: 0,
    pricePerSqft: 0,
    location: "",
    city: "",
    area: 0,
    type: propertyType,
    status: "for-sale",
    images: [],
    videos: [],
    broucher: undefined,
    facing: "",
    totalFloors: 0,
    furnished: "unfurnished",
    possession: "",
    reraNumber: "",
    developerName: "",
    featured: false,
    highlights: [],
    amenities: [],
    supportsFloorPlans: false,
    hasTowers: false,
    locationMap: "",
    masterPlan: "",
    towers: [],
    floorPlans: [],
    apartmentDetails: undefined,
    villaDetails: undefined,
    plotDetails: undefined,
    farmLandDetails: undefined,
    commercialDetails: undefined,
    locationDetails: {
      nearbyLandmarksUrl: "",
      nearbyLandmarks: { hospitals: [], schoolCollage: [], itHub: [], roadConnectivity: [] },
    },
    gallery: [],
    constructionStatus: [],
    walkthroughImages: [],
    walkthroughVideo: "",
  });

  /* =============================
      LOAD EXISTING PROPERTY (EDIT MODE)
  ============================= */
  useEffect(() => {
    const init = () => {
      if (propertyId && property) {
        setFormData((prev) => ({
          ...prev,
          ...property,

          apartmentDetails: { ...(prev.apartmentDetails || {}), ...(property.apartmentDetails || {}) },
          villaDetails: { ...(prev.villaDetails || {}), ...(property.villaDetails || {}) },
          plotDetails: { ...(prev.plotDetails || {}), ...(property.plotDetails || {}) },
          farmLandDetails: { ...(prev.farmLandDetails || {}), ...(property.farmLandDetails || {}) },
          commercialDetails: { ...(prev.commercialDetails || {}), ...(property.commercialDetails || {}) },
          amenities: property.amenities ?? prev.amenities,
          locationDetails: property.locationDetails ?? prev.locationDetails,
          images: property.images ?? [],
          videos: property.videos ?? [],
          gallery: property.gallery ?? [],
          constructionStatus: property.constructionStatus ?? [],
          walkthroughImages: property.walkthroughImages ?? [],
          towers: property.towers ?? [],
          floorPlans: property.floorPlans ?? [],
        }));

        setLoading(false);
        return;
      }

      // Default values for create mode
      if (propertyType === "villa") {
        setFormData((prev) => ({
          ...prev,
          villaDetails: {
            villaType: "independent",
            plotArea: 0,
            builtUpArea: 0,
            numberOfFloors: 0,
            gardenArea: 0,
            parkingSpaces: 0,
            gatedCommunity: false,
            belconies: 0,
            bedrooms: 0,
            bathrooms: 0,
            specifications: {
              structure: "",
              doors: "",
              windows: "",
              kitchen: "",
              bathroom: "",
              staircase: "",
              electrical: "",
            },
          },
        }));
      }

      setLoading(false);
    };

    init();
  }, [propertyId, property, propertyType]);

  /* =============================
      Update Helper
  ============================= */
  const update = (patch: Partial<Property>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  /* =============================
      STEP VALIDATIONS
  ============================= */

  // STEP 1 — BASIC INFO
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.price <= 0) newErrors.price = "Valid price is required";
    if (formData.area <= 0) newErrors.area = "Valid area is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // STEP 2 — TYPE-SPECIFIC VALIDATIONS
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (propertyType === "villa") {
      const v = formData.villaDetails;
      if (!v?.villaType) newErrors.villaType = "Villa type required";
      if (!v?.plotArea) newErrors.plotArea = "Plot area required";
      if (!v?.builtUpArea) newErrors.builtUpArea = "Built-up area required";
      if (!v?.bedrooms) newErrors.bedrooms = "Bedrooms required";
      if (!v?.bathrooms) newErrors.bathrooms = "Bathrooms required";
    }

    if (propertyType === "apartment") {
      const a = formData.apartmentDetails;
      if (!a?.bhkType) newErrors.bhkType = "BHK type required";
      if (!a?.bedrooms) newErrors.bedrooms = "Bedrooms required";
    }

    if (propertyType === "open-plot") {
      const p = formData.plotDetails;
      if (!p?.plotSize) newErrors.plotSize = "Plot size required";
      if (!p?.plotType) newErrors.plotType = "Plot type required";
    }

    if (propertyType === "commercial") {
      const c = formData.commercialDetails;
      if (!c?.propertyUsage) newErrors.propertyUsage = "Property usage required";
      if (!c?.carpetArea) newErrors.carpetArea = "Carpet area required";
    }

    if (propertyType === "farm-land") {
      const f = formData.farmLandDetails;
      if (!f?.totalArea) newErrors.totalArea = "Total area required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // STEP 3 — AMENITIES
  const validateStep3 = () => {
    if (formData.amenities.length === 0) {
      alert("Please select at least one amenity");
      return false;
    }
    return true;
  };

  // STEP 4 — IMAGES
  const validateStep4 = () => {
    if (formData.images.length === 0) {
      alert("Upload at least one image");
      return false;
    }
    return true;
  };

  /* =============================
      SAVE REQUEST
  ============================= */
  const handleSave = async () => {
    const payload = {
      ...formData,
      pricePerSqft: formData.area > 0 ? Math.round(formData.price / formData.area) : 0,
    };

    try {
      const res = await fetch(
        propertyId ? `/api/properties/${propertyId}` : `/api/properties`,
        {
          method: propertyId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (json.success){ onSave(json.data);
        alert("Save successful");
      }
      else alert("Save failed, please add atleast one image and try again.");
    } catch (err) {
      console.error(err);
    }
  };

  /* =============================
      STEP LOGIC
  ============================= */
  const goNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep === 4 && !validateStep4()) return;

    setCurrentStep((prev) => prev + 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} errors={errors} update={update} />;
      case 2:
        switch (propertyType) {
          case "apartment":
            return <ApartmentStep formData={formData} update={update} errors={errors} />;
          case "villa":
            return <VillaStep formData={formData} update={update} errors={errors} />;
          case "open-plot":
            return <PlotStep formData={formData} update={update} errors={errors} />;
          case "farm-land":
            return <FarmLandStep formData={formData} update={update} errors={errors} />;
          case "commercial":
            return <CommercialStep formData={formData} update={update} errors={errors} />;
          default:
            return null;
        }

      case 3:
        return <AmenitiesStep formData={formData} update={update} />;

      case 4:
        return <ImagesMediaStep formData={formData} update={update} />;

      default:
        return null;
    }
  };

  const steps = ["Basic Info", "Property Details", "Amenities", "Images"];

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-scroll no-scrollbar p-6 relative">

        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <StepperHeader steps={steps} currentStep={currentStep} />

        <div className="mt-6">{renderStep()}</div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white pt-4 border-t mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() =>
              currentStep > 1 ? setCurrentStep((p) => p - 1) : onCancel()
            }
          >
            {currentStep > 1 ? "Previous" : "Cancel"}
          </Button>

          {currentStep < steps.length ? (
            <Button className="bg-red-500 hover:bg-red-600" onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button className="bg-red-500 hover:bg-red-600" onClick={handleSave}>
              {propertyId ? "Update Property" : "Save Property"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
