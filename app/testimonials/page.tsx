"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { SuccessStory } from "@/components/success-story";

export default function TestimonialsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const testimonials =
    settings?.testimonialsPage?.testimonials || [];

  const banner =
    settings?.testimonialsPage?.bannerImage ||
    "/images/vision.png"; // fallback banner

  return (
    <>
      {/* Banner */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url('${banner}')` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center h-full"></div>
      </div>

      <section className="pt-20 pb-24 bg-gray-50">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-bold tracking-wide">
            Success Stories
          </p>
          <h2 className="text-3xl md:text-4xl font-light uppercase text-gray-800">
            Client Success Stories
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading testimonials...
          </p>
        )}

        {/* No Testimonials */}
        {!loading && testimonials.length === 0 && (
          <p className="text-center text-gray-500">
            No testimonials available.
          </p>
        )}

        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {testimonials.map((t: any, idx: number) => (
            <SuccessStory
              key={idx}
              name={t.name}
              role={t.role}
              image={t.image}
              message={t.description}
            />
          ))}
        </div>
      </section>
    </>
  );
}
