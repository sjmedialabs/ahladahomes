"use client";

import React from "react";
import { Property } from "@/lib/types";
import FileUpload from "@/components/file-upload";

interface FarmLandDetailsStepProps {
  formData: Property;
  update: (data: Partial<Property>) => void;
  errors?: Record<string, string>;
}

export default function FarmLandDetailsStep({
  formData,
  update,
  errors = {},
}: FarmLandDetailsStepProps) {
  const farm = formData.farmLandDetails ?? {};

  return (
    <div className="space-y-6">

      <h3 className="text-lg font-semibold">Farm Land Details</h3>

      {/* --- GRID INPUTS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Total Area */}
        <Field label="Total Area (sq ft) *" error={errors.totalArea}>
          <input
            type="number"
            value={farm.totalArea ?? ""}
            placeholder="Enter total land area"
            onChange={(e) =>
              update({
                farmLandDetails: {
                  ...farm,
                  totalArea: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.totalArea ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Length */}
        <Field label="Land Length (ft) *" error={errors.length}>
          <input
            type="number"
            value={farm.landDimensions?.length ?? ""}
            placeholder="Enter land length"
            onChange={(e) =>
              update({
                farmLandDetails: {
                  ...farm,
                  landDimensions: {
                    ...farm.landDimensions,
                    length: Number(e.target.value),
                  },
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.length ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Width */}
        <Field label="Land Width (ft) *" error={errors.width}>
          <input
            type="number"
            value={farm.landDimensions?.width ?? ""}
            placeholder="Enter land width"
            onChange={(e) =>
              update({
                farmLandDetails: {
                  ...farm,
                  landDimensions: {
                    ...farm.landDimensions,
                    width: Number(e.target.value),
                  },
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.width ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Road Width */}
        <Field label="Road Width (ft) *" error={errors.roadWidth}>
          <input
            type="number"
            value={farm.roadWidth ?? ""}
            placeholder="Enter road width"
            onChange={(e) =>
              update({
                farmLandDetails: {
                  ...farm,
                  roadWidth: Number(e.target.value),
                },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.roadWidth ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Soil Type */}
        <Field label="Soil Type" error={errors.soilType}>
          <input
            type="text"
            value={farm.soilType ?? ""}
            placeholder="Black soil / Red soil"
            onChange={(e) =>
              update({
                farmLandDetails: { ...farm, soilType: e.target.value },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.soilType ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Water Source */}
        <Field label="Water Source" error={errors.waterSource}>
          <input
            type="text"
            value={farm.waterSource ?? ""}
            placeholder="Borewell / Canal"
            onChange={(e) =>
              update({
                farmLandDetails: { ...farm, waterSource: e.target.value },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.waterSource ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Irrigation */}
        <Field label="Irrigation Type" error={errors.irrigation}>
          <input
            type="text"
            value={farm.irrigation ?? ""}
            placeholder="Drip / Sprinkler"
            onChange={(e) =>
              update({
                farmLandDetails: { ...farm, irrigation: e.target.value },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.irrigation ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Plantation */}
        <Field label="Plantation Type" error={errors.plantationType}>
          <input
            type="text"
            value={farm.plantationType ?? ""}
            placeholder="Mango / Coconut / Paddy"
            onChange={(e) =>
              update({
                farmLandDetails: { ...farm, plantationType: e.target.value },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.plantationType ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Fencing */}
        <Field label="Fencing Type" error={errors.fencing}>
          <input
            type="text"
            value={farm.fencing ?? ""}
            placeholder="Barbed wire / Wall"
            onChange={(e) =>
              update({
                farmLandDetails: { ...farm, fencing: e.target.value },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.fencing ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>
      </div>

      {/* Corner Land */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={farm.cornerPlot ?? false}
            onChange={(e) =>
              update({
                farmLandDetails: {
                  ...farm,
                  cornerPlot: e.target.checked,
                },
              })
            }
            className="rounded"
          />
          <span className="text-sm font-medium">Corner Land</span>
        </label>
      </div>

      {/* -------- Specifications -------- */}
      <div className="space-y-4">
        <h4 className="font-semibold">Farm Land Specifications</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {renderSpecInput("Water Availability", "waterAvailability", farm, update, errors)}
          {renderSpecInput("Electricity Connection", "electricityConnection", farm, update, errors)}
          {renderSpecInput("Number of Trees", "treeCount", farm, update, errors)}
          {renderSpecInput("Plantation Age", "plantationAge", farm, update, errors)}
          {renderSpecInput("Crop Details", "cropDetails", farm, update, errors, true)}

        </div>
      </div>

      {/* Layout Plan */}
      <div>
        <label className="block text-sm font-medium mb-2">Layout Plan</label>
        <FileUpload
          value={farm.layoutPlan ?? ""}
          onChange={(url) =>
            update({
              farmLandDetails: { ...farm, layoutPlan: url },
            })
          }
          accept="image/*"
        />
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

/* ---------------- SPEC INPUT BUILDER ---------------- */
function renderSpecInput(
  label: string,
  key: string,
  farm: any,
  update: any,
  errors: Record<string, string>,
  isTextarea = false
) {
  const Input = isTextarea ? "textarea" : "input";

  return (
    <Field label={label} error={errors[key]}>
      <Input
        value={farm.specifications?.[key] ?? ""}
        placeholder={label}
        onChange={(e: any) =>
          update({
            farmLandDetails: {
              ...farm,
              specifications: {
                ...farm.specifications,
                [key]: e.target.value,
              },
            },
          })
        }
        className={`w-full p-3 border rounded-lg ${
          errors[key] ? "border-red-500" : "border-gray-300"
        }`}
      />
    </Field>
  );
}
