"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Download } from "lucide-react";

interface BrochureData {
  brochureLink?: string;
  brochureThumbnail1?: string;
  brochureThumbnail2?: string;
  brochureThumbnail3?: string;
}

interface BrochureSectionProps {
  broucher: BrochureData | null;
}

export default function BrochureSection({ broucher }: BrochureSectionProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BrochureData | null>(null);

  useEffect(() => {
    // Simulate async data load (you can remove if not needed)
    setLoading(true);
    setTimeout(() => {
      setData(broucher);
      setLoading(false);
    }, 300);
  }, [broucher]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <p className="text-lg font-medium text-gray-500 animate-pulse">
          Loading brochure...
        </p>
      </div>
    );
  }

  const {
    brochureLink,
    brochureThumbnail1,
    brochureThumbnail2,
    brochureThumbnail3,
  } = data || {};

  const hasBrochure =
    brochureThumbnail1 || brochureThumbnail2 || brochureThumbnail3;

  if (!hasBrochure) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <h3
          className="text-2xl md:text-3xl font-bold mb-4"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Project Brochure
        </h3>
        <p className="text-gray-500 text-lg">No brochure available</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      {/* Title */}
      <h3
        className="text-2xl md:text-3xl font-bold text-center mb-10"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Project Brochure
      </h3>

      {/* Thumbnail Layout */}
      <div className="flex justify-center flex-wrap gap-6 mb-8 items-center">

        {/* Thumbnail 1 */}
        {brochureThumbnail1 && (
          <div className="overflow-hidden shadow-lg border border-gray-200 flex justify-center">
            <Image
              src={brochureThumbnail1}
              alt="Brochure Thumbnail 1"
              width={250}
              height={350}
              className="object-cover"
            />
          </div>
        )}

        {/* Thumbnail 2 */}
        {brochureThumbnail2 && (
          <div className="overflow-hidden shadow-lg border border-gray-200">
            <Image
              src={brochureThumbnail2}
              alt="Brochure Thumbnail 2"
              width={500}
              height={350}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Thumbnail 3 + Download Button */}
        {brochureThumbnail3 && (
          <div className="relative overflow-hidden shadow-lg border border-gray-200">
            <Image
              src={brochureThumbnail3}
              alt="Brochure Thumbnail 3"
              width={500}
              height={350}
              className="object-cover w-full h-full"
            />

            {brochureLink && (
              <a
                href={brochureLink}
                download
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white text-black px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-100 transition">
                  <Download size={18} />
                  Download Brochure
                </div>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
