"use client";

import React from "react";

interface WalkthroughSectionProps {
  videos?: { videoUrl: string; thumbnailUrl: string }[];
  onOpenVideo?: (videoUrl: string) => void;
}

export default function WalkthroughSection({
  videos = [],
  onOpenVideo,
}: WalkthroughSectionProps) {
  const hasVideos = videos.length > 0;

  return (
    <div className="bg-sky-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Title */}
        <div className="flex justify-center items-center mb-8">
          <h3
            className="text-xl font-bold"
            style={{ fontFamily: "Poppins, sans-serif", color: "black" }}
          >
            Property WalkThrough
          </h3>
        </div>

        {/* ============================================================
            VIDEO GRID
        ============================================================ */}
        {hasVideos ? (
          <div
            className={`flex flex-wrap gap-6 ${
              videos.length === 1 ? "justify-center" : "justify-start"
            }`}
          >
            {videos.map((v, index) => (
              <div
                key={index}
                className="relative group cursor-pointer w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                onClick={() => onOpenVideo?.(v.videoUrl)}
              >
                {/* Thumbnail */}
                <img
                  src={v.thumbnailUrl}
                  alt="Video Thumbnail"
                  className="h-72 w-full object-cover rounded-lg shadow-md group-hover:opacity-80 transition"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-md rounded-full py-4 px-6 shadow-lg group-hover:scale-110 transition">
                    ▶
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center">
            No walkthrough available.
          </p>
        )}
      </div>
    </div>
  );
}
