"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Icons } from "@/components/icons/AmenitiesIcons";

interface Amenity {
  _id: string;
  title: string;
  image?: string;
}

export default function AmenitiesGrid({ amenities }: { amenities: string[] }) {
  const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------
      FETCH ALL AMENITIES FROM API
  --------------------------------------- */
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch("/api/amenities");
        const result = await response.json();
        console.log("Amenities fetched:", result.data);
        if (result.success && Array.isArray(result.data)) {
          setAllAmenities(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch amenities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  /* ---------------------------------------
      FILTER AMENITIES BASED ON PROPERTY DATA
  --------------------------------------- */
  const filteredAmenities = useMemo(() => {
    if (!amenities || amenities.length === 0) return [];
    console.log("Amenities:", amenities);
    return allAmenities.filter((a) => amenities.includes(a._id));
  }, [allAmenities, amenities]);
  console.log("Filtered amenities:", filteredAmenities);
  if (loading) return <p>Loading amenities...</p>;
  if (amenities.length === 0)
    return <p className="text-gray-500">No amenities available.</p>;

  return (
    <div className="flex flex-wrap gap-2 max-w-7xl mx-auto py-8 px-12 items-center justify-center">
      {amenities.map((amenity, index) => {
        const IconComponent = Icons[amenity?.title];

        return (
          <div
            key={amenity._id + index}
            className="relative w-72 h-56 flex items-center justify-center text-center rounded-lg overflow-hidden shadow"
          >
            {/* Amenity Image as Background */}
            {amenity.image ? (
              <img
                src={amenity.image}
                alt={amenity.title}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Icon</span>
              </div>
            )}

            {/* Overlay Text */}
            <p className="absolute inset-0 flex items-center bg-black/20 justify-center text-white font-semibold text-sm px-2 drop-shadow">
              {amenity.title}
            </p>
          </div>

        );
      })}
    </div>
  );
}
