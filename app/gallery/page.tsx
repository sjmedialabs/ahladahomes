"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type PropertyGallery = {
  _id: string;
  title: string;
  images: string[];
  gallery?: string[];
  constructionStatus?: string[];
  walkthroughImages?: string[];
};

type PressRelease = {
  _id: string;
  title: string;
  image: string;
  gallery?: string[];
  date: string;
};

export default function GalleryPage() {
  /* ----------------------------------------------------
     STATE: Settings
  ---------------------------------------------------- */
  const [settings, setSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  /* ----------------------------------------------------
     STATE: Press Releases (FROM DB)
  ---------------------------------------------------- */
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loadingPress, setLoadingPress] = useState(true);

  /* ----------------------------------------------------
     STATE: Properties
  ---------------------------------------------------- */
  const [properties, setProperties] = useState<PropertyGallery[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  /* ----------------------------------------------------
     STATE: Modal
  ---------------------------------------------------- */
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeImages, setActiveImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState("");

  const [activeTab, setActiveTab] = useState<"press" | "gallery">("press");

  /* ----------------------------------------------------
     LOAD SETTINGS
  ---------------------------------------------------- */
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();
  }, []);

  /* ----------------------------------------------------
     LOAD PRESS RELEASES FROM DB
  ---------------------------------------------------- */
  useEffect(() => {
    async function loadPress() {
      try {
        setLoadingPress(true);
        const res = await fetch("/api/press-releases");
        const result = await res.json();

        if (result.success) {
          setPressReleases(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch press releases:", err);
      } finally {
        setLoadingPress(false);
      }
    }

    loadPress();
  }, []);

  /* ----------------------------------------------------
     LOAD PROPERTIES FOR GALLERY
  ---------------------------------------------------- */
  useEffect(() => {
    async function loadProps() {
      try {
        const res = await fetch("/api/properties");
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          const mapped = result.data
            .filter((p: any) => Array.isArray(p.images) && p.images.length > 0)
            .map((p: any) => ({
              _id: p._id,
              title: p.title,
              images: p.images,
              gallery: p.gallery || [],
              constructionStatus: p.constructionStatus || [],
              walkthroughImages: p.walkthroughImages || [],
            }));

          setProperties(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
      } finally {
        setLoadingProperties(false);
      }
    }

    loadProps();
  }, []);

  /* ----------------------------------------------------
     OPEN FULL GALLERY VIEW
  ---------------------------------------------------- */
  const openGallery = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}`);
      const result = await res.json();
      if (!result.success) return;

      const p = result.data;

      const allImages = [
        ...(p.images || []),
        ...(p.gallery || []),
        ...(p.constructionStatus || []),
        ...(p.walkthroughImages || []),
      ].filter(Boolean);

      setActiveImages(allImages);
      setMainImage(allImages[0]);
      setModalOpen(true);
    } catch (err) {
      console.error("Gallery open error:", err);
    }
  };

  const closeModal = () => setModalOpen(false);

  /* ----------------------------------------------------
     UI: Banner
  ---------------------------------------------------- */
  const banner = settings?.heroImage || "/images/vision.png";

  return (
    <>
      {/* --------------------------------------------------
       Banner
      -------------------------------------------------- */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url('${banner}')` }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* --------------------------------------------------
        Tabs (Press / Media Gallery)
      -------------------------------------------------- */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto flex justify-center gap-10 py-5 font-semibold">
          <button
            onClick={() => setActiveTab("press")}
            className={`px-3 pb-2 border-b-2 transition ${
              activeTab === "press"
                ? "border-red-500 text-red-500"
                : "border-transparent text-gray-600"
            }`}
          >
            Press Release
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-3 pb-2 border-b-2 transition ${
              activeTab === "gallery"
                ? "border-red-500 text-red-500"
                : "border-transparent text-gray-600"
            }`}
          >
            Media Gallery
          </button>
        </div>
      </div>

      {/* --------------------------------------------------
        Press Release Section (Dynamic)
      -------------------------------------------------- */}
      {activeTab === "press" && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            {loadingPress ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : pressReleases.length === 0 ? (
              <p className="text-center text-gray-500">No press releases found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pressReleases.map((item) => (
                  <PressCard key={item._id} image={item.image} title={item.title} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* --------------------------------------------------
        Media Gallery Section
      -------------------------------------------------- */}
      {activeTab === "gallery" && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            {loadingProperties ? (
              <p className="text-center text-gray-500">Loading gallery...</p>
            ) : properties.length === 0 ? (
              <p className="text-center text-gray-500">No images available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {properties.map((property) => (
                  <div
                    key={property._id}
                    className="cursor-pointer"
                    onClick={() => openGallery(property._id)}
                  >
                    <Image
                      src={property.images[0]}
                      width={400}
                      height={300}
                      alt={property.title}
                      className="rounded-lg shadow-lg object-cover w-full h-60"
                    />
                    <p className="text-center mt-3 font-semibold capitalize">
                      {property.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* --------------------------------------------------
        Gallery Popup Modal
      -------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-4 relative">
            <button onClick={closeModal} className="absolute right-4 top-4">
              <X size={30} className="text-black" />
            </button>

            {/* Main Image */}
            <div className="flex justify-center mb-4">
              <Image
                src={mainImage}
                width={900}
                height={600}
                alt="Main"
                className="rounded-lg object-cover w-full h-[400px]"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex justify-center gap-4 overflow-x-auto">
              {activeImages.map((thumb, idx) => (
                <Image
                  key={idx}
                  src={thumb}
                  width={150}
                  height={100}
                  alt="Thumbnail"
                  className={`cursor-pointer rounded-lg border ${
                    mainImage === thumb ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(thumb)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* --------------------------------------------------
   Press Card Component
-------------------------------------------------- */
function PressCard({
  image,
  title,
}: {
  image: string;
  title?: string;
}) {
  return (
    <div className="w-full">
      <Image
        src={image}
        width={500}
        height={400}
        alt={title || "Press"}
        className="rounded-lg shadow-sm object-cover w-full h-60"
      />
      {title && <p className="text-center mt-2 font-medium">{title}</p>}
    </div>
  );
}
