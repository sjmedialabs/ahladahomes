"use client";

import React from "react";

interface GallerySectionProps {
  images: string[];
  onOpenModal?: (image: string) => void;
}

export default function GallerySection({ images, onOpenModal }: GallerySectionProps) {
  if (!images || images.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-10">
        No images available.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h3
        className="text-xl font-bold mb-8 text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Gallery / Construction Status
      </h3>

      {/* GRID VIEW (4 Columns Desktop / 2 Tablet / 1 Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => onOpenModal?.(img)}
          >
            <img
              src={img}
              alt={`gallery-${index}`}
              className="w-full h-48 object-cover rounded-lg shadow-md transition group-hover:opacity-80"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">View Image</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
