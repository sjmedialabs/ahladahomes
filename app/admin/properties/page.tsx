"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import type { Property as PropertyType, PropertyManagement, Property, User } from "@/lib/types"
import PropertyTypeSelector from "@/components/property-type-selector"
import EnhancedPropertyForm from "@/components/properties/EnhancedPropertyForm"
import Image from "next/image";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast"


type PropertyCardProps = {
  property: Property
  onEdit: (property: Property) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: PropertyType["status"]) => void
  onViewDetails: (property: Property) => void
  canEdit: boolean
}

export const PropertyCard = ({
  property,
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails,
  canEdit,
}: PropertyCardProps) => {

  // COLOR TAG FOR STATUS
  const getStatusColor = (status: Property["status"]) => {
    switch (status) {
      case "for-sale": return "bg-green-100 text-green-800"
      case "for-rent": return "bg-blue-100 text-blue-800"
      case "sold": return "bg-purple-100 text-purple-800"
      case "rented": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const img = property.images?.[0] || "/placeholder.svg"

  // ========== GET BEDROOMS / BATHROOMS ==========
  const bedrooms =
    property.type === "apartment"
      ? property.apartmentDetails?.bedrooms
      : property.type === "villa"
      ? property.villaDetails?.bedrooms
      : null

  const bathrooms =
    property.type === "apartment"
      ? property.apartmentDetails?.bathrooms
      : property.type === "villa"
      ? property.villaDetails?.bathrooms
      : null

  return (
    <Card className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition">
      
      {/* IMAGE */}
      <div className="aspect-video overflow-hidden">
        <img
          src={img}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="p-4">
        
        {/* HEADER — Title + Status */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg capitalize w-4/5 truncate">
            {property.title || "-"}
          </h3>

          <span
            className={`px-2 py-1 rounded-full text-xs font-medium text-center ${getStatusColor(
              property.status
            )}`}
          >
            {property.status.replace("-", " ")}
          </span>
        </div>

        {/* PRICE */}
        <p className="text-red-600 font-bold text-xl mb-1">
          ₹{property.price.toLocaleString()}
        </p>

        {/* LOCATION */}
        <p className="text-gray-600 text-sm mb-3 truncate">
          {property.location}
        </p>

        {/* MAIN INFO GRID */}
        <div className="grid grid-cols-2 gap-6 text-xs text-gray-600 mb-4">

          {/* LEFT BLOCK: BHK/BATH OR FACING */}
          {property.type === "apartment" || property.type === "villa" ? (
            <div className="flex justify-between w-full">
              <div className="text-center flex-1">
                <div className="font-semibold text-gray-900">
                  {bedrooms ?? "-"}
                </div>
                <div>BHK</div>
              </div>

              <div className="text-center flex-1">
                <div className="font-semibold text-gray-900">
                  {bathrooms ?? "-"}
                </div>
                <div>Bath</div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {property.facing || "-"}
              </div>
              <div>Facing</div>
            </div>
          )}

          {/* AREA */}
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {property.area}
            </div>
            <div>sq ft</div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-2">
          
          <Button size="sm" onClick={() => onViewDetails(property)} className="flex-1">
            View Details
          </Button>

          {canEdit && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(property)}
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(property._id!)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Delete
              </Button>

              <select
                value={property.status}
                onChange={(e) =>
                  onStatusChange(property._id!, e.target.value as Property["status"])
                }
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </>
          )}

        </div>
      </CardContent>
    </Card>
  )
}


export const PropertyDetailsModal = ({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6 relative no-scrollbar">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold mb-6">{property.title}</h2>

        {/* ======================= ACCORDION ======================= */}
        <Accordion type="multiple" className="space-y-4">

          {/* ---------------------- OVERVIEW ---------------------- */}
          <AccordionItem value="overview">
            <AccordionTrigger className="text-lg font-semibold">Overview</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {property.images?.[0] && (
                  <Image
                    src={property.images[0]}
                    width={1200}
                    height={600}
                    alt="image"
                    className="w-full h-72 object-cover rounded-lg"
                  />
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div><b>Price:</b> ₹{property.price.toLocaleString()}</div>
                  <div><b>Type:</b> {property.type}</div>
                  <div><b>Status:</b> {property.status}</div>
                  <div><b>Area:</b> {property.area} sq ft</div>

                  {property.city && <div><b>City:</b> {property.city}</div>}
                  {property.facing && <div><b>Facing:</b> {property.facing}</div>}
                  {property.furnished && <div><b>Furnished:</b> {property.furnished}</div>}
                  {property.possession && <div><b>Possession:</b> {property.possession}</div>}
                  {property.developerName && <div><b>Developer:</b> {property.developerName}</div>}
                  {property.reraNumber && <div><b>RERA No.:</b> {property.reraNumber}</div>}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-600">{property.description}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ---------------------- AMENITIES ---------------------- */}
          {property.amenities?.length > 0 && (
            <AccordionItem value="amenities">
              <AccordionTrigger className="text-lg font-semibold">Amenities</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {property.amenities.map((a: any) => (
                    <div key={a._id} className="p-3 border rounded-lg flex items-center gap-2">
                      {a.image && (
                        <Image src={a.image} width={40} height={40} className="object-contain" alt={a.title} />
                      )}
                      <span>{a.title}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* ---------------------- APARTMENT DETAILS ---------------------- */}
          {property.type === "apartment" && property.apartmentDetails && (
            <AccordionItem value="apartment">
              <AccordionTrigger className="text-lg font-semibold">Apartment Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(property.apartmentDetails)
                    .filter(([key, val]) => key !== "specifications" && val)
                    .map(([key, val]) => (
                      <div key={key}><b>{key}:</b> {String(val)}</div>
                    ))}
                </div>

                {property.apartmentDetails.specifications && (
                  <div className="mt-4">
                    <h4 className="font-medium">Specifications</h4>
                    <ul className="list-disc ml-6">
                      {Object.entries(property.apartmentDetails.specifications)
                        .filter(([_, val]) => val)
                        .map(([key, val]) => (
                          <li key={key}><b>{key}:</b> {val as string}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* ---------------------- VILLA DETAILS ---------------------- */}
          {property.type === "villa" && property.villaDetails && (
            <AccordionItem value="villa">
              <AccordionTrigger className="text-lg font-semibold">Villa Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(property.villaDetails)
                    .filter(([key, val]) => key !== "specifications" && val !== undefined)
                    .map(([key, val]) => (
                      <div key={key}><b>{key}:</b> {String(val)}</div>
                    ))}
                </div>

                {property.villaDetails.specifications && (
                  <div className="mt-4">
                    <h4 className="font-medium">Specifications</h4>
                    <ul className="list-disc ml-6">
                      {Object.entries(property.villaDetails.specifications)
                        .filter(([_, val]) => val)
                        .map(([key, val]) => (
                          <li key={key}><b>{key}:</b> {val as string}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* ---------------------- COMMERCIAL DETAILS ---------------------- */}
          {property.type === "commercial" && property.commercialDetails && (
            <AccordionItem value="commercial">
              <AccordionTrigger className="text-lg font-semibold">Commercial Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(property.commercialDetails)
                    .filter(([key, val]) => key !== "specifications" && val)
                    .map(([key, val]) => (
                      <div key={key}><b>{key}:</b> {String(val)}</div>
                    ))}
                </div>

                {property.commercialDetails.specifications && (
                  <div className="mt-4">
                    <h4 className="font-medium">Specifications</h4>
                    <ul className="list-disc ml-6">
                      {Object.entries(property.commercialDetails.specifications)
                        .filter(([_, val]) => val)
                        .map(([key, val]) => (
                          <li key={key}><b>{key}:</b> {val as string}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* ---------------------- OPEN PLOT DETAILS ---------------------- */}
          {property.type === "open-plot" && property.plotDetails && (
            <AccordionItem value="plot">
              <AccordionTrigger className="text-lg font-semibold">Plot Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div><b>Plot Size:</b> {property.plotDetails.plotSize}</div>
                  {property.plotDetails.plotDimensions && (
                    <div>
                      <b>Dimensions:</b> {property.plotDetails.plotDimensions.length} ×{" "}
                      {property.plotDetails.plotDimensions.width} ft
                    </div>
                  )}
                  {Object.entries(property.plotDetails)
                    .filter(([key, val]) => !["plotDimensions", "specifications"].includes(key) && val)
                    .map(([key, val]) => (
                      <div key={key}><b>{key}:</b> {String(val)}</div>
                    ))}
                </div>

                {property.plotDetails.specifications && (
                  <div className="mt-4">
                    <h4 className="font-medium">Specifications</h4>
                    <ul className="list-disc ml-6">
                      {Object.entries(property.plotDetails.specifications)
                        .filter(([_, val]) => val)
                        .map(([key, val]) => (
                          <li key={key}><b>{key}:</b> {val as string}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* ---------------------- FARM LAND DETAILS ---------------------- */}
          {property.type === "farm-land" && property.farmLandDetails && (
            <AccordionItem value="farm">
              <AccordionTrigger className="text-lg font-semibold">Farm Land Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div><b>Total Area:</b> {property.farmLandDetails.totalArea}</div>

                  {property.farmLandDetails.landDimensions && (
                    <div>
                      <b>Dimensions:</b>{" "}
                      {property.farmLandDetails.landDimensions.length} ×{" "}
                      {property.farmLandDetails.landDimensions.width} ft
                    </div>
                  )}

                  {Object.entries(property.farmLandDetails)
                    .filter(([key, val]) => !["landDimensions", "specifications"].includes(key) && val)
                    .map(([key, val]) => (
                      <div key={key}><b>{key}:</b> {String(val)}</div>
                    ))}
                </div>

                {property.farmLandDetails.specifications && (
                  <div className="mt-4">
                    <h4 className="font-medium">Specifications</h4>
                    <ul className="list-disc ml-6">
                      {Object.entries(property.farmLandDetails.specifications)
                        .filter(([_, val]) => val)
                        .map(([key, val]) => (
                          <li key={key}><b>{key}:</b> {val as string}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* ---------------------- MEDIA ---------------------- */}
          <AccordionItem value="media">
            <AccordionTrigger className="text-lg font-semibold">Media Gallery</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">

                {/* Gallery */}
                {property.images?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Gallery</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {property.images.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          width={300}
                          height={200}
                          className="rounded object-cover h-32"
                          alt="gallery"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Walkthrough */}
                {property.videos && property?.videos?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Walkthrough</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {property.videos.map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          width={300}
                          height={200}
                          className="rounded object-cover h-32"
                          alt="walk"
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ---------------------- LOCATION ---------------------- */}
          <AccordionItem value="location">
            <AccordionTrigger className="text-lg font-semibold">Location Details</AccordionTrigger>
            <AccordionContent>
              {property.locationDetails && (
                <div className="space-y-2 text-sm">
                  {property.locationDetails.nearbyLandmarksUrl && (
                    <div>
                      <b>Location Map URL:</b> {property.locationDetails.nearbyLandmarksUrl}
                    </div>
                  )}

                  {Object.entries(property.locationDetails.nearbyLandmarks || {})
                    .filter(([_, arr]) => (arr as string[])?.length)
                    .map(([key, arr]) => (
                      <div key={key}>
                        <b>{key}:</b> {(arr as string[]).join(", ")}
                      </div>
                    ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

/* ===================================================================
   SUB COMPONENTS (Apartment, Villa, Plot, Media, Towers, Location...)
   =================================================================== */

// ✔ These small components keep the modal clean  
// ✔ All schema fields are displayed  
// ✔ Auto-hide missing fields  

const ApartmentDetails = ({ apartment }: any) => (
  <div className="space-y-2 text-sm">
    {Object.entries(apartment).map(([k, v]) =>
      typeof v !== "object" ? (
        <div><b>{k}:</b> {v}</div>
      ) : null
    )}

    {apartment.specifications && (
      <>
        <h4 className="font-semibold mt-2">Specifications</h4>
        <ul className="list-disc ml-6">
          {Object.entries(apartment.specifications)
            .filter(([_, v]) => v)
            .map(([k, v]) => (
              <li><b>{k}:</b> {v}</li>
            ))}
        </ul>
      </>
    )}
  </div>
);

const VillaDetails = ({ villa }: any) => (
  <div className="space-y-2 text-sm">
    {Object.entries(villa).map(([k, v]) =>
      typeof v !== "object" ? (
        <div><b>{k}:</b> {String(v)}</div>
      ) : null
    )}

    {villa.specifications && (
      <>
        <h4 className="font-semibold mt-2">Specifications</h4>
        <ul className="list-disc ml-6">
          {Object.entries(villa.specifications)
            .filter(([_, v]) => v)
            .map(([k, v]) => (
              <li><b>{k}:</b> {v}</li>
            ))}
        </ul>
      </>
    )}
  </div>
);

const CommercialDetails = ({ commercial }: any) => (
  <div className="space-y-2 text-sm">
    {Object.entries(commercial).map(([k, v]) =>
      typeof v !== "object" ? (
        <div><b>{k}:</b> {String(v)}</div>
      ) : null
    )}

    {commercial.specifications && (
      <>
        <h4 className="font-semibold mt-2">Specifications</h4>
        <ul className="list-disc ml-6">
          {Object.entries(commercial.specifications)
            .filter(([_, v]) => v)
            .map(([k, v]) => (
              <li><b>{k}:</b> {v}</li>
            ))}
        </ul>
      </>
    )}
  </div>
);

const PlotDetails = ({ plot }: any) => (
  <div className="space-y-2 text-sm">
    <div><b>Plot Size:</b> {plot.plotSize}</div>
    <div><b>Dimensions:</b> {plot.plotDimensions?.length} × {plot.plotDimensions?.width} ft</div>

    {Object.entries(plot)
      .filter(([k]) => !["plotDimensions", "specifications"].includes(k))
      .map(([k, v]) =>
        typeof v !== "object" ? <div><b>{k}:</b> {String(v)}</div> : null
      )}

    {plot.specifications && (
      <>
        <h4 className="font-semibold mt-2">Specifications</h4>
        <ul className="list-disc ml-6">
          {Object.entries(plot.specifications)
            .filter(([_, v]) => v)
            .map(([k, v]) => (
              <li><b>{k}:</b> {v}</li>
            ))}
        </ul>
      </>
    )}
  </div>
);

const FarmlandDetails = ({ farm }: any) => (
  <div className="space-y-2 text-sm">
    <div><b>Total Area:</b> {farm.totalArea}</div>
    <div><b>Dimensions:</b> {farm.landDimensions?.length} × {farm.landDimensions?.width} ft</div>

    {Object.entries(farm)
      .filter(([k]) => !["landDimensions", "specifications"].includes(k))
      .map(([k, v]) =>
        typeof v !== "object" ? <div><b>{k}:</b> {String(v)}</div> : null
      )}

    {farm.specifications && (
      <>
        <h4 className="font-semibold mt-2">Specifications</h4>
        <ul className="list-disc ml-6">
          {Object.entries(farm.specifications)
            .filter(([_, v]) => v)
            .map(([k, v]) => (
              <li><b>{k}:</b> {v}</li>
            ))}
        </ul>
      </>
    )}
  </div>
);

const TowersAndPlans = ({ property }: any) => (
  <div className="space-y-4">
    {/* Towers */}
    {property.towers?.length > 0 && (
      <div>
        <h4 className="font-semibold mb-2">Towers</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {property.towers.map((tower: any, i: number) => (
            <div key={i} className="p-3 border rounded-lg">
              <b>{tower.name}</b>
              <div>Floors: {tower.floors}</div>
              <div>Units: {tower.units}</div>
              <div>Facing: {tower.facing}</div>
              <div className="mt-2 font-medium">Floor Plans:</div>
              {tower.floorPlans?.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  className="w-full h-32 object-contain rounded mt-2"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Floor Plans */}
    {property.floorPlans?.length > 0 && (
      <div>
        <h4 className="font-semibold mb-2">Floor Plans</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {property.floorPlans.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              className="w-full h-32 object-contain rounded"
            />
          ))}
        </div>
      </div>
    )}

    {/* Master Plan */}
    {property.masterPlan && (
      <div>
        <h4 className="font-semibold mb-2">Master Plan</h4>
        <img
          src={property.masterPlan}
          className="w-full h-64 object-contain rounded"
        />
      </div>
    )}

    {/* Location Map */}
    {property.locationMap && (
      <div>
        <h4 className="font-semibold mb-2">Location Map</h4>
        <img
          src={property.locationMap}
          className="w-full h-64 object-contain rounded"
        />
      </div>
    )}
  </div>
);

const MediaSection = ({ property }: any) => (
  <div className="space-y-6">

    {/* Brochure */}
    {property.broucher && (
      <div>
        <h4 className="font-semibold mb-2">Brochure</h4>
        <div className="flex gap-4">
          {Object.values(property.broucher).map(
            (b: any, i: number) =>
              b && <img key={i} src={b} className="w-32 h-32 object-cover rounded" />
          )}
        </div>
      </div>
    )}

    {/* Videos */}
    {property.videos?.length > 0 && (
      <div>
        <h4 className="font-semibold mb-2">Videos</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {property.videos.map((v: any, i: number) => (
            <div key={i}>
              <img
                src={v.thumbnailUrl}
                className="w-full h-40 object-cover rounded"
              />
              <a
                href={v.videoUrl}
                target="_blank"
                className="block mt-1 text-blue-600 underline text-sm"
              >
                Open Video
              </a>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Gallery */}
    {property.images?.length > 0 && (
      <div>
        <h4 className="font-semibold mb-2">Gallery</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {property.gallery.map((img: string, i: number) => (
            <img key={i} src={img} className="h-32 w-full object-cover rounded" />
          ))}
        </div>
      </div>
    )}

    {/* Construction Status */}
    {property.constructionStatus?.length > 0 && (
      <div>
        <h4 className="font-semibold mb-2">Construction Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {property.constructionStatus.map((img: string, i: number) => (
            <img key={i} src={img} className="h-32 w-full object-cover rounded" />
          ))}
        </div>
      </div>
    )}

    {/* Walkthrough */}
    {property.walkthroughImages?.length > 0 && (
      <div>
        <h4 className="font-semibold mb-2">Walkthrough Images</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {property.walkthroughImages.map((img: string, i: number) => (
            <img key={i} src={img} className="h-32 w-full object-cover rounded" />
          ))}
        </div>
      </div>
    )}

    {property.walkthroughVideo && (
      <div>
        <h4 className="font-semibold mb-2">Walkthrough Video</h4>
        <a
          href={property.walkthroughVideo}
          target="_blank"
          className="text-blue-600 underline"
        >
          Watch Video
        </a>
      </div>
    )}
  </div>
);

const LocationDetails = ({ location }: any) => (
  <div className="space-y-3 text-sm">
    <div><b>Nearby Landmarks URL:</b> {location?.nearbyLandmarksUrl}</div>

    {Object.entries(location?.nearbyLandmarks || {})
      .filter(([_, arr]) => arr?.length)
      .map(([key, arr]: any) => (
        <div key={key}>
          <b>{key}:</b> {arr.join(", ")}
        </div>
      ))}
  </div>
);


export default function PropertiesPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showTypeSelector, setShowTypeSelector] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedPropertyType, setSelectedPropertyType] = useState<"apartment" | "villa" | "open-plot" | "commercial" | "farm-land">("apartment")
  const [editingProperty, setEditingProperty] = useState<Property| undefined>()
  const [selectedProperty, setSelectedProperty] = useState<Property| undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("All")
  const [filterStatus, setFilterStatus] = useState<string>("All")

  const canEditProperties = user?.role === "super_admin"

const fetchProperties = useCallback(async () => {
  if (!user) return
  try {
    setLoading(true)
    const res = await fetch("/api/properties")
    if (!res.ok) throw new Error("Failed to fetch properties")
    const data = await res.json()
    let allProperties: Property[] = data.data || []

    setProperties(allProperties)
  } catch (error) {
    console.error(error)
    alert("Failed to fetch properties")
  } finally {
    setLoading(false)
  }
}, [user])


  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

const handleAddProperty = () => {
  setEditingProperty(undefined)       // reset edit mode
  setSelectedPropertyType("apartment") // default selection
  setShowTypeSelector(true)            // open type selector
}


  const handlePropertyTypeSelect = (type: "apartment" | "villa" | "open-plot" | "commercial" | "farm-land") => {
    setSelectedPropertyType(type)
    setShowTypeSelector(false)
    setShowForm(true)
  }

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property)
    setSelectedPropertyType(property.type)
    setShowForm(true)
  }

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property)
  }

const handleSaveProperty = async (
  propertyData: Omit<Property, "_id"  | "amenities" | "utilities">) => {
    try {
      if (editingProperty) {
        const response = await fetch(`/api/properties/${editingProperty._id}`, {
        method : "PUT",  
        })
        if (response.ok){ await fetchProperties()
          alert("Property updated successfully")
        }

      } else {
        const response = await fetch("/api/properties", {
          method: "POST",
        })
        if (response){ await fetchProperties()
          alert("Property added successfully")
        }
      }
      setShowForm(false)
    } catch (error) {
      console.error("Failed to save property:", error)
      alert("Failed to save property. Please try again.")
    }
  }


  const handleDelete = async (_id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return
    try {
      await fetch(`/api/properties/${_id}`, { method: "DELETE" })
      setProperties(prev => prev.filter(p => p._id !== _id))
    } catch (error) {
      console.error(error)
      alert("Failed to delete property")
    }
  }

  const handleStatusChange = async (_id: string, status: Property["status"]) => {
    try {
      await fetch(`/api/properties/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      setProperties(prev => prev.map(p => (p._id === _id ? { ...p, status } : p)))
    } catch (error) {
      console.error(error)
      alert("Failed to update property status")
    }
  }

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? true
    const matchesType = filterType === "All" || p.type === filterType
    const matchesStatus = filterStatus === "All" || p.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  if (loading) return <div className="flex items-center justify-center h-64">Loading properties...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600">Comprehensive property management with enhanced features</p>
        </div>
        {canEditProperties && (
          <Button onClick={handleAddProperty} className="bg-red-500 hover:bg-red-600">
            Add New Property
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="p-2 border rounded">
          <option value="All">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="open-plot">Open Plot</option>
          <option value="farm-land">Farm Land</option>
          <option value="commercial">Commercial</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded">
          <option value="All">All Status</option>
          <option value="for-sale">For Sale</option>
          <option value="for-rent">For Rent</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
        </select>
      </div>

      {/* Property Cards */}
{/* Property Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
  {filteredProperties.map(property => (
    <PropertyCard
      key={property._id}
      property={property}
      canEdit={canEditProperties}
      onViewDetails={() => handleViewDetails(property)}
      onEdit={() => handleEditProperty(property)}
      onDelete={() => handleDelete(property._id)}
      onStatusChange={(_id, status) => handleStatusChange(_id, status)}
    />
  ))}
</div>


      {/* Add/Edit Property Modal */}
      {showTypeSelector && <PropertyTypeSelector onSelect={handlePropertyTypeSelect} onCancel={() => setShowTypeSelector(false)} />}
{showForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-lg">
      
      <EnhancedPropertyForm
        propertyType={selectedPropertyType}   // <-- ★ type is used for NEW properties
        propertyId={editingProperty?._id}     // <-- ★ used for EDIT
        property={editingProperty}            // <-- ★ passes full existing property
        onSave={handleSaveProperty}
        onCancel={() => setShowForm(false)}
      />

    </div>
  </div>
)}


      {/* Property Details Modal */}
      {selectedProperty && <PropertyDetailsModal property={selectedProperty} onClose={() => setSelectedProperty(undefined)} />}
    </div>
  )
}
