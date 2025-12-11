"use client";

import React from "react";
import { Property } from "@/lib/types";
import FileUpload from "@/components/file-upload";

interface PlotDetailsStepProps {
  formData: Property;
  update: (data: Partial<Property>) => void;
  errors?: Record<string, string>;
}

export default function PlotDetailsStep({
  formData,
  update,
  errors = {},
}: PlotDetailsStepProps) {
  const plot = formData.plotDetails ?? {};

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Open Plot Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Plot Size */}
        <Field label="Plot Size (sq ft)" error={errors.plotSize}>
          <input
            type="number"
            value={plot.plotSize ?? ""}
            onChange={(e) =>
              update({
                plotDetails: { ...plot, plotSize: Number(e.target.value) },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.plotSize ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Plot Length */}
        <Field label="Plot Length (ft)" error={errors.length}>
          <input
            type="number"
            value={plot.plotDimensions?.length ?? ""}
            onChange={(e) =>
              update({
                plotDetails: {
                  ...plot,
                  plotDimensions: {
                    ...plot.plotDimensions,
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

        {/* Plot Width */}
        <Field label="Plot Width (ft)" error={errors.width}>
          <input
            type="number"
            value={plot.plotDimensions?.width ?? ""}
            onChange={(e) =>
              update({
                plotDetails: {
                  ...plot,
                  plotDimensions: {
                    ...plot.plotDimensions,
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
        <Field label="Road Width (ft)" error={errors.roadWidth}>
          <input
            type="number"
            value={plot.roadWidth ?? ""}
            onChange={(e) =>
              update({
                plotDetails: { ...plot, roadWidth: Number(e.target.value) },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.roadWidth ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Plot Type */}
        <Field label="Plot Type" error={errors.plotType}>
          <select
            value={plot.plotType ?? ""}
            onChange={(e) =>
              update({
                plotDetails: { ...plot, plotType: e.target.value as any },
              })
            }
            className={`w-full p-3 border rounded-lg ${
              errors.plotType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="agricultural">Agricultural</option>
          </select>
        </Field>

        {/* Soil Type */}
        <Field label="Soil Type" error={errors.soilType}>
          <input
            type="text"
            value={plot.soilType ?? ""}
            onChange={(e) =>
              update({
                plotDetails: { ...plot, soilType: e.target.value },
              })
            }
            placeholder="e.g., Red Soil / Black Soil"
            className={`w-full p-3 border rounded-lg ${
              errors.soilType ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Layout Number */}
        <Field label="Layout Number" error={errors.layoutNumber}>
          <input
            type="text"
            value={plot.layoutNumber ?? ""}
            onChange={(e) =>
              update({
                plotDetails: { ...plot, layoutNumber: e.target.value },
              })
            }
            placeholder="e.g., LP/123/2025"
            className={`w-full p-3 border rounded-lg ${
              errors.layoutNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>
      </div>

      {/* Corner Plot */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={plot.cornerPlot ?? false}
            onChange={(e) =>
              update({
                plotDetails: { ...plot, cornerPlot: e.target.checked },
              })
            }
            className="rounded"
          />
          <span className="text-sm font-medium">Corner Plot</span>
        </label>
      </div>

      {/* Approvals */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Approvals (HMDA, DTCP, RERA…)
        </label>

        <div className="space-y-2">
          {(plot.approvals ?? []).map((approval, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={approval}
                onChange={(e) => {
                  const updated = [...(plot.approvals ?? [])];
                  updated[index] = e.target.value;

                  update({
                    plotDetails: { ...plot, approvals: updated },
                  });
                }}
                className="w-full p-2 border rounded-lg"
              />

              <button
                type="button"
                className="text-red-600"
                onClick={() =>
                  update({
                    plotDetails: {
                      ...plot,
                      approvals: (plot.approvals ?? []).filter(
                        (_, i) => i !== index
                      ),
                    },
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}

          <button
            className="px-3 py-1 border rounded-lg text-blue-600"
            type="button"
            onClick={() =>
              update({
                plotDetails: {
                  ...plot,
                  approvals: [...(plot.approvals ?? []), ""],
                },
              })
            }
          >
            Add Approval
          </button>
        </div>
      </div>

      {/* Layout Map */}
      <div>
        <label className="block text-sm font-medium mb-2">Layout Map</label>
        <FileUpload
          value={plot.layoutMap ?? ""}
          onChange={(url) =>
            update({
              plotDetails: { ...plot, layoutMap: url },
            })
          }
          accept="image/*"
        />
      </div>

      {/* Specifications */}
      <div>
        <h4 className="font-medium mb-3">Infrastructure Specifications</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSpec("Roads", "roads", plot, update)}
          {renderSpec("Drainage", "drainage", plot, update)}
          {renderSpec("Electricity", "electricity", plot, update)}
          {renderSpec("Water Lines", "waterLines", plot, update)}
        </div>
      </div>
    </div>
  );
}

/* -------------------- FIELD WRAPPER -------------------- */
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

/* -------------------- SPEC BUILDER -------------------- */
function renderSpec(
  label: string,
  key: string,
  plot: any,
  update: (data: Partial<Property>) => void
) {
  return (
    <Field label={label}>
      <input
        type="text"
        value={plot.specifications?.[key] ?? ""}
        onChange={(e) =>
          update({
            plotDetails: {
              ...plot,
              specifications: {
                ...plot.specifications,
                [key]: e.target.value,
              },
            },
          })
        }
        className="w-full p-2 border rounded"
        placeholder={label}
      />
    </Field>
  );
}
