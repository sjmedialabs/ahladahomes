"use client";

import React, { useState } from "react";
import type { Property } from "@/lib/types";

interface SpecificationsSectionProps {
  property: Property;
}

export default function SpecificationsSection({ property }: SpecificationsSectionProps) {
  /* --------------------------------------------------------
      STEP 1: Extract the correct specification object based
              on property.type
  -------------------------------------------------------- */

  let specs: Record<string, any> | null = null;
  let typeLabel = "";

  switch (property.type) {
    case "apartment":
      specs = property.apartmentDetails?.specifications || null;
      typeLabel = "Apartment Specifications";
      break;

    case "villa":
      specs = property.villaDetails?.specifications || null;
      typeLabel = "Villa Specifications";
      break;

    case "commercial":
      specs = property.commercialDetails?.specifications || null;
      typeLabel = "Commercial Specifications";
      break;

    case "open-plot":
      specs = property.plotDetails?.specifications || null;
      typeLabel = "Plot Specifications";
      break;

    case "farm-land":
      specs = property.farmLandDetails?.specifications || null;
      typeLabel = "Farmland Specifications";
      break;

    default:
      specs = null;
  }

  if (!specs) {
    return (
      <div className="py-10 text-center text-gray-500">
        No specifications available.
      </div>
    );
  }

  /* --------------------------------------------------------
      STEP 2: Build LEFT SIDEBAR groups dynamically based
              on fields that actually exist in schema
  -------------------------------------------------------- */

  const specGroups = Object.entries(specs)
    .filter(([key, value]) => value) // only fields with data
    .map(([key, value]) => ({
      key,
      label: formatLabel(key),
      value,
    }));

  // Helper: Convert camelCase → Proper Title
  function formatLabel(label: string) {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  // Default active section is first
  const [activeKey, setActiveKey] = useState(specGroups[0]?.key);

  const activeGroup = specGroups.find((g) => g.key === activeKey);

  return (
    <div className="bg-sky-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* ========= MAIN HEADING ========= */}
        <h3
          className="text-xl font-bold text-center mb-10"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Project Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* ---------------------------------------------- */}
          {/*                LEFT SIDEBAR                   */}
          {/* ---------------------------------------------- */}
          <div className="space-y-4 flex flex-row overflow-scroll md:overflow-hidden items-center md:flex-col gap-1 ">
            {specGroups.map((group) => (
              <button
                key={group.key}
                onClick={() => setActiveKey(group.key)}
                className={`block w-full text-left pl-4 py-2 mb-0 font-medium text-sm transition border-l-2
                  ${
                    activeKey === group.key
                      ? "border-black text-black"
                      : "border-transparent text-gray-600 hover:text-black"
                  }
                `}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {group.label}
              </button>
            ))}
          </div>

          {/* ---------------------------------------------- */}
          {/*              RIGHT CONTENT DISPLAY            */}
          {/* ---------------------------------------------- */}
          <div className="md:col-span-2">

            <h4
              className="text-lg font-semibold mb-3"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {activeGroup?.label}
            </h4>

            {/* SHOW FIELDS AS BULLET POINTS */}
            {renderSpecificationContent(activeGroup?.value)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------
      STEP 3: Dynamic Spec Renderer
-------------------------------------------------------- */
function renderSpecificationContent(value: any) {
  // CASE 1: value is a string (may contain line breaks → bullets)
  if (typeof value === "string") {
    return (
      <ul className="space-y-2 text-gray-700 text-sm">
        {value.split("\n").map((line, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="mt-1">•</span>
            <span>{line.trim()}</span>
          </li>
        ))}
      </ul>
    );
  }

  // CASE 2: value is a number / boolean → show directly
  if (typeof value === "number" || typeof value === "boolean") {
    return <p className="text-gray-700">{String(value)}</p>;
  }

  // CASE 3: value is an object (e.g., dimensions)
  if (typeof value === "object" && !Array.isArray(value)) {
    return (
      <ul className="space-y-2 text-gray-700 text-sm">
        {Object.entries(value).map(([k, v]) => (
          <li key={k} className="flex gap-2">
            <span className="mt-1">•</span>
            <span>
              <strong>{formatNestedLabel(k)}:</strong> {String(v)}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  // CASE 4: value is an array
  if (Array.isArray(value)) {
    return (
      <ul className="space-y-2 text-gray-700 text-sm">
        {value.map((item, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="mt-1">•</span>
            {typeof item === "string" ? (
              <span>{item}</span>
            ) : (
              <span>{JSON.stringify(item)}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return <p className="text-gray-500">No data available.</p>;
}

function formatNestedLabel(label: string) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
