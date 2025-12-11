"use client";

import React from "react";
import { Property } from "@/lib/types";
import FileUpload from "@/components/file-upload";

interface CommercialDetailsStepProps {
  formData: Property;
  update: (data: Partial<Property>) => void;
  errors?: Record<string, string>;
}

export default function CommercialDetailsStep({
  formData,
  update,
  errors = {},
}: CommercialDetailsStepProps) {
  const commercial = formData.commercialDetails ?? {};

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Commercial Property Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Property Usage */}
        <Field label="Property Usage" error={errors.propertyUsage}>
          <select
            value={commercial.propertyUsage ?? ""}
            onChange={(e) =>
              update({
                commercialDetails: {
                  ...commercial,
                  propertyUsage: e.target.value as any,
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.propertyUsage ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Usage</option>
            <option value="office">Office</option>
            <option value="shop">Shop</option>
            <option value="showroom">Showroom</option>
            <option value="coworking">Co-working Space</option>
          </select>
        </Field>

        {/* Carpet Area */}
        <Field label="Carpet Area (sq ft)" error={errors.carpetArea}>
          <input
            type="number"
            value={commercial.carpetArea ?? ""}
            onChange={(e) =>
              update({
                commercialDetails: {
                  ...commercial,
                  carpetArea: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.carpetArea ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Super Built-up */}
        <Field label="Super Built-up Area (sq ft)" error={errors.superBuiltupArea}>
          <input
            type="number"
            value={commercial.superBuiltupArea ?? ""}
            onChange={(e) =>
              update({
                commercialDetails: {
                  ...commercial,
                  superBuiltupArea: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.superBuiltupArea ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Floor Number */}
        <Field label="Floor Number" error={errors.floorNumber}>
          <input
            type="number"
            value={commercial.floorNumber ?? ""}
            onChange={(e) =>
              update({
                commercialDetails: {
                  ...commercial,
                  floorNumber: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.floorNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Parking */}
        <Field label="Parking Availability">
          <select
            value={commercial.parkingAvailable ? "yes" : "no"}
            onChange={(e) =>
              update({
                commercialDetails: {
                  ...commercial,
                  parkingAvailable: e.target.value === "yes",
                },
              })
            }
            className="w-full p-3 border rounded-lg border-gray-300"
          >
            <option value="yes">Parking Available</option>
            <option value="no">No Parking</option>
          </select>
        </Field>

        {/* Ceiling Height */}
        <Field label="Ceiling Height (ft)" error={errors.ceilingHeight}>
          <input
            type="number"
            value={commercial.ceilingHeight ?? ""}
            onChange={(e) =>
              update({
                commercialDetails: {
                  ...commercial,
                  ceilingHeight: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.ceilingHeight ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Road Width */}
        <Field label="Facing Road Width (ft)" error={errors.facingRoadWidth}>
          <input
            type="number"
            value={commercial.facingRoadWidth ?? ""}
            onChange={(e) =>
              update({
                commercialDetails: {
                  ...commercial,
                  facingRoadWidth: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.facingRoadWidth ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Furnished */}
        <Field label="Furnished Status">
          <select
            value={formData.furnished ?? ""}
            onChange={(e) => update({ furnished: e.target.value as any })}
            className="w-full p-3 border rounded-lg border-gray-300"
          >
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="furnished">Fully Furnished</option>
          </select>
        </Field>

        {/* RERA */}
        <Field label="RERA Number">
          <input
            type="text"
            value={formData.reraNumber ?? ""}
            onChange={(e) => update({ reraNumber: e.target.value })}
            className="w-full p-3 border rounded-lg border-gray-300"
            placeholder="e.g., P02400012345"
          />
        </Field>
      </div>

      {/* Specifications */}
      <div>
        <h4 className="font-medium mb-3">Specifications</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSpecField("Flooring", "flooring", commercial, update, errors)}
          {renderSpecField("HVAC", "hvac", commercial, update, errors)}
          {renderSpecField("Electrical", "electrical", commercial, update, errors)}
          {renderSpecField("Fire Safety", "fireSafety", commercial, update, errors)}
          {renderSpecField("Telecom", "telecom", commercial, update, errors)}
        </div>
      </div>
    </div>
  );
}

/* ---------------- FIELD WRAPPER WITH ERROR ---------------- */
function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* ---------------- SPEC FIELD BUILDER ---------------- */
function renderSpecField(
  label: string,
  key: string,
  commercial: any,
  update: (data: Partial<Property>) => void,
  errors: Record<string, string>
) {
  return (
    <Field label={label} error={errors[key]}>
      <input
        type="text"
        value={commercial.specifications?.[key] ?? ""}
        onChange={(e) =>
          update({
            commercialDetails: {
              ...commercial,
              specifications: {
                ...commercial.specifications,
                [key]: e.target.value,
              },
            },
          })
        }
        className={`w-full p-2 border rounded-lg ${
          errors[key] ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={`e.g., ${label}`}
      />
    </Field>
  );
}
