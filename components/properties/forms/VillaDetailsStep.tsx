"use client";

import React from "react";
import { Property } from "@/lib/types";
import FileUpload from "@/components/file-upload";

interface VillaDetailsStepProps {
  formData: Property;
  update: (data: Partial<Property>) => void;
  errors?: Record<string, string>;
}

export default function VillaDetailsStep({
  formData,
  update,
  errors = {},
}: VillaDetailsStepProps) {
  const villa = formData.villaDetails ?? {};

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Villa Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Villa Type */}
        <Field label="Villa Type" error={errors.villaType}>
          <select
            value={villa.villaType ?? ""}
            onChange={(e) =>
              update({
                villaDetails: {
                  ...villa,
                  villaType: e.target.value,
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.villaType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Villa Type</option>
            <option value="independent">Independent</option>
            <option value="row-house">Row House</option>
            <option value="duplex">Duplex</option>
            <option value="triplex">Triplex</option>
          </select>
        </Field>

        {/* Plot Area */}
        <Field label="Plot Area (sq ft)" error={errors.plotArea}>
          <input
            type="number"
            value={villa.plotArea ?? ""}
            onChange={(e) =>
              update({
                villaDetails: {
                  ...villa,
                  plotArea: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.plotArea ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Built-up Area */}
        <Field label="Built-up Area (sq ft)" error={errors.builtUpArea}>
          <input
            type="number"
            value={villa.builtUpArea ?? ""}
            onChange={(e) =>
              update({
                villaDetails: {
                  ...villa,
                  builtUpArea: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.builtUpArea ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Floors */}
        <Field label="Number of Floors" error={errors.numberOfFloors}>
          <input
            type="number"
            value={villa.numberOfFloors ?? ""}
            min={1}
            onChange={(e) =>
              update({
                villaDetails: {
                  ...villa,
                  numberOfFloors: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.numberOfFloors ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Bedrooms */}
        <Field label="Number of Bedrooms" error={errors.bedrooms}>
          <input
            type="number"
            value={villa.bedrooms ?? ""}
            onChange={(e) =>
              update({
                villaDetails: {
                  ...villa,
                  bedrooms: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.bedrooms ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Bathrooms */}
        <Field label="Number of Bathrooms" error={errors.bathrooms}>
          <input
            type="number"
            value={villa.bathrooms ?? ""}
            onChange={(e) =>
              update({
                villaDetails: {
                  ...villa,
                  bathrooms: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.bathrooms ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Balconies */}
        <Field label="Number of Balconies" error={errors.belconies}>
          <input
            type="number"
            value={villa.belconies ?? ""}
            onChange={(e) =>
              update({
                villaDetails: {
                  ...villa,
                  belconies: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.belconies ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Garden Area */}
        <Field label="Garden Area (sq ft)" error={errors.gardenArea}>
          <input
            type="number"
            value={villa.gardenArea ?? ""}
            onChange={(e) =>
              update({
                villaDetails: {
                  ...villa,
                  gardenArea: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.gardenArea ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Parking */}
        <Field label="Parking Spaces" error={errors.parkingSpaces}>
          <input
            type="number"
            min={0}
            value={villa.parkingSpaces ?? ""}
            onChange={(e) =>
              update({
                villaDetails: {
                  ...villa,
                  parkingSpaces: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.parkingSpaces ? "border-red-500" : "border-gray-300"
            }`}
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

        {/* RERA */}
        <Field label="RERA Number">
          <input
            type="text"
            value={formData.reraNumber ?? ""}
            onChange={(e) => update({ reraNumber: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., P02400000000"
          />
        </Field>
      </div>

      {/* Floor Plan */}
      <div>
        <label className="block text-sm font-medium mb-2">Floor Plan</label>
        <FileUpload
          value={formData.floorPlans?.[0] ?? ""}
          onChange={(url) => update({ floorPlans: [url] })}
          accept="image/*"
        />
      </div>

      {/* Specifications */}
      <div>
        <h4 className="font-medium mb-3">Specifications</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSpec("Structure", "structure", villa, update)}
          {renderSpec("Doors", "doors", villa, update)}
          {renderSpec("Windows", "windows", villa, update)}
          {renderSpec("Kitchen", "kitchen", villa, update)}
          {renderSpec("Bathroom", "bathroom", villa, update)}
          {renderSpec("Staircase", "staircase", villa, update)}
          {renderSpec("Electrical", "electrical", villa, update)}
        </div>
      </div>
    </div>
  );
}

/* ---------- FIELD WITH ERROR SUPPORT ---------- */
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

/* ---------- SPEC INPUT ----------- */
function renderSpec(label: string, key: string, villa: any, update: any) {
  return (
    <Field label={label}>
      <input
        type="text"
        value={villa.specifications?.[key] ?? ""}
        onChange={(e) =>
          update({
            villaDetails: {
              ...villa,
              specifications: {
                ...villa.specifications,
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
