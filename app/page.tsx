"use client";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import type { Property, SiteSettings, User } from "@/lib/types";
import Link from "next/dist/client/link";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MapPin } from "lucide-react";
import { SuccessStory } from "@/components/success-story";
interface Props {
  filteredProperties: Property[];
  popularSearchTab: string;
  setPopularSearchTab: (tab: string) => void;
}
export default function HomePage({ }: Props) {

  // --- States ---
  const [activeTab, setActiveTab] = useState("for-sale");
  const [popularSearchTab, setPopularSearchTab] = useState("View All");
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<User[]>([]);
  // Search bar states
  const [propertyType, setPropertyType] = useState("villa");
  const [propertyName, setPropertyName] = useState("");
  const [location, setLocation] = useState("");
  // --- State for filtered properties ---
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  // --- Fetch data on mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes] = await Promise.all([
          fetch("/api/properties").then((res) => res.json()),
        ]);

        if (propertiesRes.success) {
          const allProperties = propertiesRes.data || [];

          // Sort all properties by latest createdAt first
          const sortedProperties = allProperties.sort(
            (a: Property, b: Property) =>
              new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
          );

          // Featured properties: featured === true and sorted by createdAt (latest first)
          const featured = sortedProperties.filter((p: Property) => p.featured);

          setProperties(sortedProperties);
          setFilteredProperties(sortedProperties.slice(0, 4)); // default for popular search
          setFeaturedProperties(featured);
        }
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/settings", { method: "GET" })
      if (!res.ok) throw new Error("Failed to fetch settings")
      const data: SiteSettings = await res.json()
      console.log("Fetched settings:", data)
      setSiteSettings(data)
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      setSiteSettings(null)
    } finally {
      setLoading(false)
    }
  }

  const sliderSettings = {
    dots: false,
    infinite: filteredProperties.length > 4, // infinite only if more than 4 slides
    speed: 500,
    slidesToShow: 4, // default (xl)
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1028, // < 1028px (below lg)
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // < 768px (below md)
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 430, // < 430px (below md)
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // --- Update filteredProperties when popularSearchTab changes ---
  useEffect(() => {
    let filtered = [...properties];

    if (popularSearchTab !== "View All") {
      filtered = filtered.filter((property) => {
        switch (popularSearchTab) {
          case "Apartments/Villas":
            return property.type === "apartment" || property.type === "villa";
          case "Commercial":
            return property.type === "commercial";
          case "Open Plots":
            return property.type === "open-plot";
          case "Farm Lands":
            return property.type === "farm-land";
          default:
            return true;
        }
      });
    }

    setFilteredProperties(filtered);
  }, [popularSearchTab, properties]);
  console.log("settings response: out of fetch ", siteSettings);
  // --- Search Handler ---
  const router = useRouter();

  // Map property type to route
  const propertyTypeRoutes: Record<string, string> = {
    residential: "residential",
    openplots: "open-plots",
    farmland: "farm-lands",
    commercial: "commercial",
  };

  const handleSearch = () => {
    // Determine Buy/Rent


    // Base route based on property type
    const baseRoute = `/${propertyTypeRoutes[propertyType] || "residential"}`;

    // Build query params
    const queryParams = new URLSearchParams({
      location,
      name: propertyName,
    }).toString();

    // Redirect to the correct property listing page
    router.push(`${baseRoute}?${queryParams}`);
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <div>
        {/* Hero Section */}
        <section
          className="relative h-screen flex flex-col"
          style={{
            backgroundImage: siteSettings?.heroImage
              ? `url('${siteSettings.heroImage}')`
              : "url('/images/banner.png')", // fallback image
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0"></div>

          <div className="relative z-10 flex flex-col items-center justify-between pt-20 mt-20 h-full">
            <div className="xl:max-w-4xl mx-auto px-4 text-center text-white">
              {/* Hero Title */}
              <h1
                className="text-3xl md:text-5xl xl:text-6xl font-black leading-tight mb-4"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, lineHeight: 1}}
              >
                <span className="">
                  {siteSettings?.heroTitle} {/* fallback */}
                </span>
              </h1>
              <p
                className=" text-lg font-black mb-8  "
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, }}
              >
                {siteSettings?.siteDescription || "START YOUR PROPERTY SEARCH"} {/* fallback */}
              </p>

              {/* Search Form */}
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col items-center gap-4">
                  {/* Buy/Rent Tabs */}
                  <div className="flex gap-2">
                    <button
                      className="px-6 py-3 rounded-xl border-4 border-amber-200 font-medium transition-colors bg-white text-black"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                      onClick={() =>router.push("/about-company")}
                    >
                      Know More
                    </button>
                  </div>



                </div>
              </div>
            </div>
            {/* Search Inputs */}
            <div className=" bg-white w-full shadow-xl ">
              <div className=" px-4 py-1 md:px-6 md:py-4 flex flex-col md:flex-row items-center gap-2 md:gap-6 max-w-7xl mx-auto">
                <div className="flex flex-1 items-center gap-4 md:gap-6">
                  {/* Property Type */}
                  <div className="px-4">
                    <label
                      htmlFor="propertyType"
                      className="block text-left font-medium text-gray-700 mb-1 text-xs md:text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Select Category<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="propertyType"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full border-none outline-none text-gray-700 bg-transparent text-xs md:text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      <option value="residential">Residential</option>
                      <option value="openplots">Open Plot</option>
                      <option value="farmland">Farm Lands</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>

                  <div className="w-px md:h-20 h-14 bg-gray-300"></div>

                  {/* Property Name */}
                  <div className="xl:min-w-[200px] px-4">
                    <label
                      htmlFor="propertyName"
                      className="block text-left font-medium text-gray-700 mb-1 text-xs md:text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Search by<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="propertyName"
                      type="text"
                      placeholder="Property Name"
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      className="w-full border-none outline-none text-gray-700 bg-transparent placeholder-gray-400 text-xs md:text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                  </div>

                  <div className="w-px h-14 md:h-20 bg-gray-300"></div>

                  {/* Location */}
                  <div className="xl:min-w-[140px] px-4">
                    <label
                      htmlFor="location"
                      className="block text-left font-medium text-gray-700 mb-1 text-xs md:text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Select location
                    </label>
                    <input
                      id="location"
                      type="text"
                      placeholder="Hyderabad"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border-none outline-none text-gray-700 bg-transparent placeholder-gray-400 text-xs md:text-sm"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    />
                  </div>
                </div>
                {/* Search Button */}
                <button
                  onClick={handleSearch} // <-- Add your search handler
                  className="bg-gold3 text-white px-4 py-3 mr-18 md:px-8 md:py-3 rounded-xl hover:bg-gold1 transition-colors font-medium flex items-center gap-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 bg-gray-50">
          <div className="xl:max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className=" text-sm font-semibold mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Rent Property</p>
              <h3 className="text-4xl mb-8 uppercase text-gold3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: "300" }}>Featured Projects</h3>
            </div>
            {/* Slider */}
            {filteredProperties.length > 0 ? (
              <Slider {...sliderSettings}>
                {filteredProperties.filter((property) => property.status === "for-rent").map((property) => (
                  <div className="p-2 flex justify-center items-center" key={property._id}>
                    <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                      <img
                        src={property.images?.[0] || "/placeholder.svg?height=400&width=600"}
                        alt={property?.title || "Featured Property"}
                        className="w-full h-120 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0"></div>
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-6 text-white bg-black/60">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-left">
                            <h4 className="text-xl font-semibold line-clamp-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                              {property?.title || "-"}
                            </h4>
                            <p className="text-lg opacity-90" style={{ fontFamily: "Poppins, sans-serif" }}>
                              {/* Map agentId to agent name */}
                              By {(property?.developerName) ?? (agents.find(a => a.assignedProperties?.[0] === featuredProperties[0]?._id)?.name) ?? "-"}
                            </p>
                            <p className="text-sm opacity-80 flex flex-row gap-1"><MapPin className="w-5 h-5" /><span>{property?.location || "-"}</span></p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                            {property.type === "apartment" || property.type === "villa" ? (
                              <>
                                {property.apartmentDetails?.bhkType || "-"} BHK, {property.apartmentDetails?.totalUnits || "-"} Bath
                              </>
                            ) : property.type === "open-plot" || property.type === "farm-land" ? (
                              <>
                                {property.plotDetails?.plotDimensions?.length ||
                                  property.farmLandDetails?.landDimensions?.length ||
                                  "-"}{" "}
                                ft x{" "}
                                {property.plotDetails?.plotDimensions?.width ||
                                  property.farmLandDetails?.landDimensions?.width ||
                                  "-"}{" "}
                                ft
                              </>
                            ) : property.type === "commercial" ? (
                              <>
                                {property.area ? `${featuredProperties[0].area} sqft` : "-"}
                              </>
                            ) : (
                              "-"
                            )}
                          </p>

                          <p className="text-sm text-right" style={{ fontFamily: "Poppins, sans-serif" }}>
                            {property.area || "-"} sqft
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-center text-gray-500">No featured properties found.</p> // Added fallback
            )}
            {/* View All Properties Button */}
            <div className="text-center mt-12">
              <Link href="/residential">
                <button className="bg-gold3 text-white px-8 py-3 rounded-lg hover:bg-gold1 transition-colors font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>
                  View All Properties
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Buy property Section */}
        <section className="py-16 bg-gold4">
          <div className="max-w-7xl mx-auto px-4">
            {/* Title */}
            <div className="text-center mb-8">
              <p className="text-sm font-semibold mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                Buy properties
              </p>
              <h3 className="text-4xl mb-4 uppercase text-gold3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: "300" }}>
                Latest Launch
              </h3>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex flex-wrap gap-2 items-center justify-center">
                {["View All", "Apartments/Villas", "Commercial", "Open Plots", "Farm Lands"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setPopularSearchTab(tab)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${popularSearchTab === tab ? "bg-gold3 text-white" : "bg-white text-gray-700 hover:bg-gray-300"
                      }`}
                    style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider */}
            {filteredProperties.length > 0 ? (
              <Slider {...sliderSettings}>
                {filteredProperties.filter((property) => property.status === "for-sale").map((property) => (
                  <div key={property._id} className="p-2 flex justify-center items-center">
                    <div className="bg-white rounded-2xl  shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      {/* Property Image */}
                      <div className="relative">
                        <img
                          src={property.images?.[0] || "/placeholder.svg?height=200&width=300"}
                          alt={property.title || "Property"}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="bg-white  px-3 py-1 rounded-full font-medium shadow-sm" style={{ fontFamily: "Poppins, sans-serif", fontSize: "10px" }}>
                            {property.status === "for-sale" ? "For Sale" : "For Rent"}
                          </span>
                          {property.featured && (
                            <span className="bg-gold1 text-white px-3 py-1 rounded-full font-medium shadow-sm" style={{ fontFamily: "Poppins, sans-serif", fontSize: "10px" }}>
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Details */}
                      <div >
                        <div className="p-4">
                        <h4 className="font-semibold mb-2 line-clamp-1 text-greenTheme" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "16px" }}>
                          {property.title || "-"}
                        </h4>
                        <div className="flex items-center mb-3" style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px" }}>
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {property.location || "-"}
                        </div>
                        <div className="flex justify-between items-center text-gray-600 mb-3" style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px" }}>
                          <span className="text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                            {property?.type === "apartment" || property?.type === "villa" ? (
                              <>
                                {property?.apartmentDetails?.bhkType || "-"} BHK, {property?.apartmentDetails?.totalUnits || "-"} Units
                              </>
                            ) : property?.type === "open-plot" || property?.type === "farm-land" ? (
                              <>
                                {property?.plotDetails?.plotDimensions?.length ||
                                  property?.farmLandDetails?.landDimensions?.length ||
                                  "-"}{" "}
                                ft x{" "}
                                {property?.plotDetails?.plotDimensions?.width ||
                                  property?.farmLandDetails?.landDimensions?.width ||
                                  "-"}{" "}
                                ft
                              </>
                            ) : property?.type === "commercial" ? (
                              <>
                                {property?.area ? `${property.area} sqft` : "-"}
                              </>
                            ) : (
                              "-"
                            )}
                          </span>

                          <span>{property.area || "-"} sq ft</span>
                        </div>
                        <div className="w-full h-px bg-gray-200 mb-3"></div>
                        <div className="flex flex-row justify-between items-center">
                          <div className="flex flex-col justify-between items-center">
                            <p className="font-bold" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
                              ₹{property.price?.toLocaleString() || "-"}
                            </p>
                            {/* <p className="text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontSize: "10px" }}>
                              {property.area || "-"} sq ft
                            </p> */}
                        </div>
                        <div className="flex items-center" style={{ fontFamily: "Poppins, sans-serif", fontSize: "10px" }}>
                        <p>Average Price: ₹{property.pricePerSqft.toLocaleString() || "-"}/sq ft</p>
                        </div>
                        </div>
                        </div>
                        <Link href={`/properties/${property._id}`}>
                          <button className="w-full text-white py-3 hover:opacity-90 transition-opacity font-medium bg-gold3" style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px"}}>
                            View More Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p className="text-center text-gray-500">No properties found.</p>
            )}
          </div>
        </section>
      </div>



      {/* ... Rental properties sections ... */}
      <section className="py-16">
        <div className="xl:max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p
              className="text-center mb-2"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "12px",
                lineHeight: "22px",
              }}
            >
              Success Stories
            </p>
            <h3
              className="text-4xl mb-8 uppercase text-gold3"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 300,
              }}
            >
              Client Success Stories
            </h3>
          </div>

              {/* testimonials */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            { siteSettings?.testimonialsPage?.testimonials && siteSettings?.testimonialsPage?.testimonials.map((testimonial, index) => (
            <div className="" key={index}>
              <SuccessStory
                message={testimonial?.description}
                name={testimonial?.name}
                role={testimonial?.role}
                image={testimonial?.image}
              />
            </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/testimonials">
              <button className="bg-gold3 text-white px-8 py-3 rounded-lg hover:bg-gold1 transition-colors font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>
                View All Testimonials
              </button>
            </Link>
          </div>
        </div>
      </section>
      {/* ... existing footer ... */}

    </div>
  );
}

// Custom Next Arrow
function NextArrow({ onClick }: any) {
  return (
    <button
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg"
      onClick={onClick}
    >
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

// Custom Prev Arrow
function PrevArrow({ onClick }: any) {
  return (
    <button
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg"
      onClick={onClick}
    >
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}