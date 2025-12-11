"use client";

import React from "react";
import { Property } from "@/lib/types";
import FileUpload from "@/components/file-upload";

interface ApartmentDetailsProps {
  formData: Property;
  update: (data: Partial<Property>) => void;
  errors?: Record<string, string>;
}

export default function ApartmentDetails({ formData, update, errors = {} }: ApartmentDetailsProps) {
  const apt = formData.apartmentDetails ?? {};

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Apartment Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* BHK Type */}
        <Field label="BHK Type" error={errors.bhkType}>
          <select
            value={apt.bhkType ?? ""}
            onChange={(e) =>
              update({
                apartmentDetails: {
                  ...apt,
                  bhkType: e.target.value as any,
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.bhkType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select BHK Type</option>
            {[
              "studio",
              "1bhk",
              "2bhk",
              "3bhk",
              "4bhk",
              "5+bhk",
              "penthouse",
            ].map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
        </Field>

        {/* Towers */}
        <Field label="Number of Towers (optional)">
          <input
            type="number"
            value={apt.towers ?? ""}
            onChange={(e) =>
              update({
                apartmentDetails: {
                  ...apt,
                  towers: Number(e.target.value),
                },
              })
            }
            className="w-full p-3 border rounded-lg"
            min={0}
          />
        </Field>

        {/* Bedrooms */}
        <Field label="Number of Rooms" error={errors.bedrooms}>
          <input
            type="number"
            value={apt.bedrooms ?? ""}
            onChange={(e) =>
              update({
                apartmentDetails: {
                  ...apt,
                  bedrooms: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.bedrooms ? "border-red-500" : "border-gray-300"
            }`}
            min={0}
          />
        </Field>

        {/* Bathrooms */}
        <Field label="Number of Bathrooms">
          <input
            type="number"
            value={apt.bathrooms ?? ""}
            onChange={(e) =>
              update({
                apartmentDetails: {
                  ...apt,
                  bathrooms: Number(e.target.value),
                },
              })
            }
            className="w-full p-3 border rounded-lg"
            min={0}
          />
        </Field>

        {/* Balconies */}
        <Field label="Number of Balconies">
          <input
            type="number"
            value={apt.balconies ?? ""}
            onChange={(e) =>
              update({
                apartmentDetails: {
                  ...apt,
                  balconies: Number(e.target.value),
                },
              })
            }
            className="w-full p-3 border rounded-lg"
            min={0}
          />
        </Field>

        {/* Floors Per Tower */}
        <Field label="Floors Per Tower">
          <input
            type="number"
            value={apt.floorsPerTower ?? ""}
            onChange={(e) =>
              update({
                apartmentDetails: {
                  ...apt,
                  floorsPerTower: Number(e.target.value),
                },
              })
            }
            className="w-full p-3 border rounded-lg"
            min={0}
          />
        </Field>

        {/* Total Units */}
        <Field label="Total Units">
          <input
            type="number"
            value={apt.totalUnits ?? ""}
            onChange={(e) =>
              update({
                apartmentDetails: {
                  ...apt,
                  totalUnits: Number(e.target.value),
                },
              })
            }
            className="w-full p-3 border rounded-lg"
            min={0}
          />
        </Field>

        {/* Possession Date */}
        <Field label="Possession Date">
          <input
            type="text"
            value={apt.possessionDate ?? ""}
            onChange={(e) =>
              update({
                apartmentDetails: {
                  ...apt,
                  possessionDate: e.target.value,
                },
              })
            }
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Dec 2026"
          />
        </Field>

        {/* RERA Number */}
        <Field label="RERA Number">
          <input
            type="text"
            value={formData.reraNumber ?? ""}
            onChange={(e) => update({ reraNumber: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., P02400003069"
          />
        </Field>

        {/* Furnished */}
        <Field label="Furnished Status">
          <select
            value={formData.furnished ?? ""}
            onChange={(e) => update({ furnished: e.target.value as any })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="furnished">Fully Furnished</option>
          </select>
        </Field>
      </div>

      {/* Floor Plan Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Floor Plan</label>
        <FileUpload
          value={formData.floorPlans?.[0] ?? ""}
          onChange={(url) => update({ floorPlans: [url] })}
          placeholder="Upload floor plan"
          accept="image/*"
        />
      </div>

      {/* Specifications */}
      <div>
        <h4 className="font-medium mb-3">Specifications</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSpec("Flooring", "flooring", apt, update)}
          {renderSpec("Kitchen", "kitchen", apt, update)}
          {renderSpec("Bathroom", "bathroom", apt, update)}
          {renderSpec("Doors", "doors", apt, update)}
          {renderSpec("Windows", "windows", apt, update)}
          {renderSpec("Electrical", "electrical", apt, update)}
          {renderSpec("Walls", "walls", apt, update)}
        </div>
      </div>
    </div>
  );
}

/* ---------------- FIELD WITH ERROR SUPPORT ---------------- */
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

/* ---------------- SPECIFICATION FIELD ---------------- */
function renderSpec(label: string, key: string, apt: any, update: any) {
  return (
    <Field label={label}>
      <input
        type="text"
        value={apt.specifications?.[key] ?? ""}
        onChange={(e) =>
          update({
            apartmentDetails: {
              ...apt,
              specifications: {
                ...apt.specifications,
                [key]: e.target.value,
              },
            },
          })
        }
        className="w-full p-2 border rounded"
        placeholder={`e.g., ${label}`}
      />
    </Field>
  );
}
