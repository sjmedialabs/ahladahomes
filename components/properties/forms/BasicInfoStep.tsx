"use client";

import React from "react";
import { Property } from "@/lib/types";
import FileUpload from "@/components/file-upload";

interface BasicInfoStepProps {
  formData: Property;
  errors: Record<string, string>;
  update: (data: Partial<Property>) => void;
}
type LandmarkKeys = "hospitals" | "schoolCollage" | "itHub" | "roadConnectivity";

interface NearbyLandmarks {
  hospitals: string[];
  schoolCollage: string[];
  itHub: string[];
  roadConnectivity: string[];
}

export default function BasicInfoStep({ formData, errors, update }: BasicInfoStepProps) {
  /* -----------------------------------------
     Helpers for tower updates 
  ----------------------------------------- */
  const updateTower = (index: number, key: string, value: any) => {
    const towers = [...(formData.towers ?? [])];
    towers[index] = { ...towers[index], [key]: value };
    update({ towers });
  };
const updateLocation = (newData: any) => {
  update({
    locationDetails: {
      ...formData.locationDetails,
      ...newData,
    },
  });
};

// FIXED — type-safe & correct variable name
const updateLandmarkList = (key: LandmarkKeys, list: string[]) => {
  update({
    locationDetails: {
      ...formData.locationDetails,
      nearbyLandmarks: {
        ...formData.locationDetails?.nearbyLandmarks,
        [key]: list,
      },
    },
  });
};


  const addTower = () => {
    update({
      towers: [
        ...(formData.towers ?? []),
        { name: "", floors: 0, units: 0, floorPlans: [] },
      ],
    });
  };

  const removeTower = (index: number) => {
    update({
      towers: formData.towers?.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Basic Information</h3>

      {/* ---------- GRID ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <Field label="Property Title" error={errors.title}>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => update({ title: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Levonor Esquire"
          />
        </Field>

        {/* Developer */}
        <Field label="Developer Name">
          <input
            type="text"
            value={formData.developerName ?? ""}
            onChange={(e) => update({ developerName: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., ABC Developers"
          />
        </Field>

        {/* Price */}
        <Field label="Price (₹)" error={errors.price}>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => update({ price: Number(e.target.value) })}
            className="w-full p-3 border rounded-lg"
            placeholder="5000000"
          />
        </Field>

        {/* Area */}
        <Field label="Area (sq ft)" error={errors.area}>
          <input
            type="number"
            value={formData.area}
            onChange={(e) => update({ area: Number(e.target.value) })}
            className="w-full p-3 border rounded-lg"
            placeholder="1200"
          />
        </Field>

        {/* Location */}
        <Field label="Location" error={errors.location}>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => update({ location: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Banjara Hills, Hyderabad"
          />
        </Field>

        {/* Facing */}
        <Field label="Facing Direction" error={errors.facing}>
          <select
            value={formData.facing ?? ""}
            onChange={(e) => update({ facing: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Facing</option>
            {[
              "North",
              "South",
              "East",
              "West",
              "North-East",
              "North-West",
              "South-East",
              "South-West",
            ].map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>

        {/* Possession */}
        <Field label="Possession">
          <input
            type="text"
            value={formData.possession ?? ""}
            onChange={(e) => update({ possession: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Dec 2026"
          />
        </Field>
      </div>

      {/* ---------- DESCRIPTION ---------- */}
      <Field label="Description" error={errors.description}>
        <textarea
          value={formData.description}
          onChange={(e) => {
            if (e.target.value.length <= 600) {
              update({ description: e.target.value });
            }
          }}
          className="w-full p-3 border rounded-lg h-24"
          placeholder="Detailed property description..."
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <p>{errors.description}</p>
          <p>{formData.description.length}/600 characters</p>
        </div>
      </Field>

      {/* =======================================================
            FLOOR PLAN LOGIC (NEW)
      ======================================================== */}

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Floor Plan Options</h3>

        {/* supportsFloorPlans */}
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={formData.supportsFloorPlans ?? false}
            onChange={(e) =>
              update({
                supportsFloorPlans: e.target.checked,
                hasTowers: false,
              })
            }
          />
          <span>Supports Floor Plans</span>
        </label>

        {/* If supports floor plans → Show next */}
        {formData.supportsFloorPlans && (
          <>
            {/* hasTowers */}
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={formData.hasTowers ?? false}
                onChange={(e) =>
                  update({
                    hasTowers: e.target.checked,
                    towers: e.target.checked ? formData.towers ?? [] : [],
                  })
                }
              />
              <span>Property Has Towers</span>
            </label>

            {/* ============================ */}
            {/*       CASE 1: WITH TOWERS     */}
            {/* ============================ */}
            {formData.hasTowers ? (
              <div className="space-y-6">
                <h4 className="font-semibold">Towers</h4>

                {(formData.towers ?? []).map((tower, index) => (
                  <div key={index} className="border p-4 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Field label="Tower Name">
                        <input
                          type="text"
                          value={tower.name ?? ""}
                          onChange={(e) =>
                            updateTower(index, "name", e.target.value)
                          }
                          className="w-full p-2 border rounded"
                        />
                      </Field>

                      <Field label="Floors">
                        <input
                          type="number"
                          value={tower.floors ?? ""}
                          onChange={(e) =>
                            updateTower(index, "floors", Number(e.target.value))
                          }
                          className="w-full p-2 border rounded"
                        />
                      </Field>
                      {/* Facing */}
                      <Field label="Facing Direction">
                        <select
                          value={tower.facing ?? ""}
                          onChange={(e) => updateTower(index, "facing", e.target.value)}
                          className="w-full p-3 border rounded-lg"
                        >
                          <option value="">Select Facing</option>
                          {[
                            "North",
                            "South",
                            "East",
                            "West",
                            "North-East",
                            "North-West",
                            "South-East",
                            "South-West",
                          ].map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Units">
                        <input
                          type="number"
                          value={tower.units ?? ""}
                          onChange={(e) =>
                            updateTower(index, "units", Number(e.target.value))
                          }
                          className="w-full p-2 border rounded"
                        />
                      </Field>
                    </div>

                    {/* Floor Plan Upload */}
                    <div className="mt-4">
                      <Field label="Tower Floor Plan">
                        <FileUpload
                          value={tower.floorPlans?.[0] ?? ""}
                          onChange={(url) =>
                            updateTower(index, "floorPlans", [url])
                          }
                          placeholder="Upload floor plan"
                          accept="image/*"
                        />
                      </Field>
                    </div>

                    <button
                      type="button"
                      className="text-red-600 mt-2"
                      onClick={() => removeTower(index)}
                    >
                      Remove Tower
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTower}
                  className="px-3 py-2 border rounded-lg text-blue-600"
                >
                  + Add Tower
                </button>
              </div>
            ) : (
              <>{/*     CASE 2: NO TOWERS        */}
                <div className="mt-4 space-y-4">
                  <Field label="Floor Plans (Multiple Allowed)">
                    <div className="space-y-3">

                      {/* Existing Uploaded Floor Plans Preview */}
                      {(formData.floorPlans ?? []).length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          {formData?.floorPlans?.map((url, index) => (
                            <div key={index} className="relative border rounded-lg p-2">
                              <img
                                src={url}
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                                onClick={() => {
                                  const updated = [...formData.floorPlans!].filter((_, i) => i !== index);
                                  update({ floorPlans: updated });
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload New Floor Plan */}
                      <FileUpload
                        value=""
                        onChange={(url) =>
                          update({
                            floorPlans: [...(formData.floorPlans ?? []), url],
                          })
                        }
                        placeholder="Upload floor plan"
                        accept="image/*"
                      />
                    </div>
                  </Field>
                </div>
              </>
            )}
          </>
        )}
      </div>
      {/* =======================================================
      LOCATION MAP & MASTER PLAN (NEW FIELDS)
======================================================== */}

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Additional Project Media</h3>

        {/* LOCATION MAP */}
        <Field label="Location Map">
          <div className="space-y-3">

            {/* Preview if exists */}
            {/* {formData.locationMap && (
                <div className="relative w-full max-w-xs">
                  <img
                    src={formData.locationMap}
                    className="w-full h-32 object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                    onClick={() => update({ locationMap: "" })}
                  >
                    Remove
                  </button>
                </div>
              )} */}

            {/* Upload Component */}
            <FileUpload
              value={formData.locationMap ?? ""}
              onChange={(url) => update({ locationMap: url })}
              placeholder="Upload location map"
              accept="image/*"
            />
          </div>
        </Field>

        {/* MASTER PLAN */}
        <div className="mt-6">
          <Field label="Master Plan">
            <div className="space-y-3">

              {/* Preview */}
              {/* {formData.masterPlan && (
                  <div className="relative w-full max-w-xs">
                    <img
                      src={formData.masterPlan}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                      onClick={() => update({ masterPlan: "" })}
                    >
                      Remove
                    </button>
                  </div>
                )} */}

              {/* Upload */}
              <FileUpload
                value={formData.masterPlan ?? ""}
                onChange={(url) => update({ masterPlan: url })}
                placeholder="Upload master plan"
                accept="image/*"
              />
            </div>
          </Field>
        </div>
      </div>
{/* LOCATION DETAILS */}

<div className="border-t pt-6 mt-6">
  <h3 className="text-lg font-semibold mb-4">Location Details</h3>

  {/* Nearby Landmarks Map URL */}
  <Field label="Nearby Landmarks Map URL">
    <input
      type="text"
      value={formData.locationDetails?.nearbyLandmarksUrl ?? ""}
      onChange={(e) =>
        updateLocation({ nearbyLandmarksUrl: e.target.value })
      }
      className="w-full p-2 border rounded"
      placeholder="Paste Google Maps URL"
    />
  </Field>

  {(
    [
      { key: "hospitals", label: "Hospitals Nearby" },
      { key: "schoolCollage", label: "Schools & Colleges Nearby" },
      { key: "itHub", label: "IT Hubs Nearby" },
      { key: "roadConnectivity", label: "Road Connectivity" },
    ] as { key: LandmarkKeys; label: string }[]
  ).map(({ key, label }) => {

    const list = formData.locationDetails?.nearbyLandmarks?.[key] ?? [""];

    return (
      <div key={key} className="mt-6">
        <label className="block text-sm font-medium mb-2">{label}</label>

        {list.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              maxLength={50}
              value={item}
              onChange={(e) => {
                const updated = [...list];
                updated[index] = e.target.value.slice(0, 50);
                updateLandmarkList(key, updated);
              }}
              className="flex-1 p-2 border rounded"
              placeholder={`${label} ${index + 1}`}
            />

            {list.length > 1 && (
              <button
                type="button"
                className="text-red-600"
                onClick={() => {
                  updateLandmarkList(
                    key,
                    list.filter((_, i) => i !== index)
                  );
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="px-3 py-1 border rounded-lg text-blue-600"
          onClick={() => updateLandmarkList(key, [...list, ""])}
        >
          + Add {label}
        </button>
      </div>
    );
  })}
</div>


    </div>
  );
}

/* ------------------ Small Reusable Field Wrapper ------------------ */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
