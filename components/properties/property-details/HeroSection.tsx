"use client";
import React from "react";

export default function HeroSection({ bannerImage }: { bannerImage: string }) {
  return (
    <div className="w-full h-[420px]">
      <img
        src={bannerImage}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
