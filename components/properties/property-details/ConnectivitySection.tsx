"use client";

import React from "react";
import Image from "next/image";

interface LocationDetailsProps {
  locationDetails?: {
    nearbyLandmarksUrl?: string;
    nearbyLandmarks?: {
      hospitals?: string[];
      schoolCollage?: string[];
      itHub?: string[];
      roadConnectivity?: string[];
    };
  };
}

export default function ConnectivitySection({
  locationDetails,
}: LocationDetailsProps) {
  const mapUrl = locationDetails?.nearbyLandmarksUrl;

  const hospitals = locationDetails?.nearbyLandmarks?.hospitals || [];
  const schools = locationDetails?.nearbyLandmarks?.schoolCollage || [];
  const itHub = locationDetails?.nearbyLandmarks?.itHub || [];
  const roadConnectivity =
    locationDetails?.nearbyLandmarks?.roadConnectivity || [];

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      {/* Title */}
      <h3
        className="text-2xl md:text-3xl font-bold text-center mb-10"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Near By Landmarks & Connectivity
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-1 items-start">
        {/* LEFT SECTION — TEXT LISTS */}
        <div className="space-y-6 col-span-1 pl-4">
          {/* Hospitals */}
          {hospitals.length > 0 && (
            <div>
              <h4 className="text-[#2F5596] font-semibold mb-2 text-lg">
                Hospitals
              </h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                {hospitals.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Schools & Colleges */}
          {schools.length > 0 && (
            <div>
              <h4 className="text-[#2F5596] font-semibold mb-2 text-lg">
                Schools & Colleges
              </h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                {schools.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* IT & Business Hubs */}
          {itHub.length > 0 && (
            <div>
              <h4 className="text-[#2F5596] font-semibold mb-2 text-lg">
                IT & Business Hubs
              </h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                {itHub.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Road Connectivity */}
          {roadConnectivity.length > 0 && (
            <div>
              <h4 className="text-[#2F5596] font-semibold mb-2 text-lg">
                Road Connectivity
              </h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                {roadConnectivity.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT SECTION — MAP IMAGE */}
        <div className="rounded-xl overflow-hidden shadow-md border col-span-3 items-center">
          {mapUrl ? (
            <iframe
              className="w-full h-100 rounded-xl"
              src={mapUrl}
              loading="lazy"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center bg-gray-100 h-64 text-gray-400">
              No map available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
