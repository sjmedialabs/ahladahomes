"use client";

import React, { useState, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Select } from "@/components/ui/select";

export default function FloorPlanSection({ data }: any) {
  if (!data.supportsFloorPlans) return null;

  const hasTowers = data.hasTowers;
  const towers = data.towers || [];
  const floorPlans = data.floorPlans || [];

  const masterPlan = data.masterPlan || "";
  const locationMap = data.locationMap || "";
  const bhkType = data.apartmentDetails?.bhkType || "BHK";
  const [initialized, setInitialized] = useState(false);
  /* -------------------------------
        TOP LEVEL TABS
  -------------------------------- */
  const TABS = ["Master Plan", "Location Map", bhkType + " Plans"];
  const [activeTab, setActiveTab] = useState(TABS[2]);

// Properly controlled tower + facing state
const [selectedTower, setSelectedTower] = useState<string>("");
const [selectedFacing, setSelectedFacing] = useState<string>("");

/* -------------------------------
   COMPUTED FILTER OPTIONS
-------------------------------- */

// Tower names
const towerNames = hasTowers
  ? towers.map((t: any) => t.name)
  : ["Tower 1"];

// Facing list
const facingOptions = hasTowers
  ? Array.from(new Set(towers.map((t: any) => t.facing).filter(Boolean)))
  : data.facing
  ? [data.facing]
  : [];


React.useEffect(() => {
  if (!initialized) {
    if (towerNames.length > 0) {
      setSelectedTower(""); // Default to ALL TOWERS
    }
    if (facingOptions.length > 0) {
      setSelectedFacing(""); // Default to ALL FACINGS
    }
    setInitialized(true);
  }
}, [initialized, towerNames, facingOptions]);

/* -------------------------------
   GET ACTIVE FLOOR PLANS (FIXED)
-------------------------------- */

// When "All Towers" is selected → merge all tower floorPlans
const allTowerPlans = hasTowers
  ? towers.flatMap((t: any) =>
      (t.floorPlans || []).map((p: any) => ({
        url: typeof p === "string" ? p : p.url,
        facing: t.facing || "",   // attach tower facing
        tower: t.name
      }))
    )
  : floorPlans.map((p: any) => ({
      url: typeof p === "string" ? p : p.url,
      facing: data.facing || "",
    }));


// Pick active tower OR all towers
const activeTowerPlans = selectedTower === ""
  ? allTowerPlans
  : (towers.find((t: any) => t.name === selectedTower)?.floorPlans || []).map(
      (p: any) => ({
        url: typeof p === "string" ? p : p.url,
        facing: towers.find((t: any) => t.name === selectedTower)?.facing || "",
        tower: selectedTower
      })
    );

// Now apply facing filter
const filteredFloorPlans = useMemo(() => {
  if (selectedFacing === "") return activeTowerPlans;

  return activeTowerPlans.filter((plan: any) => plan.facing === selectedFacing);
}, [activeTowerPlans, selectedFacing]);


  /* -------------------------------
        SLIDER SETTINGS
  -------------------------------- */
  const sliderSettings = {
    dots: false,
    infinite: filteredFloorPlans.length > 4,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: filteredFloorPlans.length > 4,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-[#0E2B5C] py-12">
      <h3 className="text-center text-white text-2xl font-semibold mb-8">
        Floor Plan
      </h3>

      {/* ===================================================
            TOP LEVEL FILTER BUTTONS (TABS)
      =================================================== */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 rounded-lg text-sm font-medium transition ${
              activeTab === tab
              ?"bg-white text-black"
                : "bg-green-700 text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ===================================================
            TAB 1 — MASTER PLAN
      =================================================== */}
      {activeTab === "Master Plan" && (
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center">
          {masterPlan ? (
            <img
              src={masterPlan}
              className="h-[300px] rounded-lg shadow-lg bg-white p-4 object-contain"
            />
          ) : (
            <p className="text-center text-gray-300">No master plan uploaded.</p>
          )}
        </div>
      )}

      {/* ===================================================
            TAB 2 — LOCATION MAP
      =================================================== */}
      {activeTab === "Location Map" && (
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center">
          {locationMap ? (
            <img
              src={locationMap}
              className="h-[300px] rounded-lg shadow-lg bg-white p-4 object-contain"
            />
          ) : (
            <p className="text-center text-gray-300">No location map uploaded.</p>
          )}
        </div>
      )}

      {/* ===================================================
            TAB 3 — BHK / FLOOR PLANS
      =================================================== */}
{activeTab === bhkType + " Plans" && (
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-row gap-8 justify-center">
    {/* ----------- Tower Dropdown ----------- */}
    <div className="flex justify-center mb-6">
      <select
        value={selectedTower}
        onChange={(e) => setSelectedTower(e.target.value)}
        className="px-4 py-2 rounded-full bg-transparent text-gray-400 font-medium border border-gray-300"
      >
        <option value="" className="" style={{backgroundColor: "transparent"}}>All Towers</option>
        {towerNames.map((name: string) => (
          <option key={name} value={name} style={{backgroundColor: "transparent"}}>
            {name}
          </option>
        ))}
      </select>
    </div>

    {/* ----------- Facing Dropdown ----------- */}
    {facingOptions.length > 0 && (
      <div className="flex justify-center mb-6">
        <select
          value={selectedFacing}
          onChange={(e) => setSelectedFacing(e.target.value)}
          className="px-4 py-2 rounded-full !bg-transparent text-gray-400 font-medium border border-gray-300"
        >
          <option value="" className="bg-transparent">All Facings</option>
          {facingOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
    )}
   </div>
    {/* ----------- SLIDER ----------- */}
    {filteredFloorPlans.length > 0 ? (
      <Slider {...sliderSettings}>
        {filteredFloorPlans.map((img: any, idx: number) => (
          <div key={idx} className="p-2">
            <div className="bg-white p-3 rounded-lg shadow-md">
              <img
                src={typeof img === "string" ? img : img.url}
                className="w-full h-56 object-contain"
              />
              <p className="mt-2 text-center text-black font-medium">
                Plan {idx + 1}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    ) : (
      <p className="text-center text-gray-300">No floor plans available.</p>
    )}
  </div>
)}

    </div>
  );
}
