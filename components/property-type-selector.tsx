"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PropertyTypeSelectorProps {
  onSelect: (type: "apartment" | "villa" | "open-plot" | "commercial" | "farm-land") => void
  onCancel: () => void
}

export default function PropertyTypeSelector({ onSelect, onCancel }: PropertyTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<string>("")

  const propertyTypes = [
    {
      id: "apartment",
      title: "Apartment",
      description: "Residential apartments with BHK configurations, floor plans, and building amenities",
      icon: "🏢",
      features: ["BHK Configurations", "Floor Plans", "Building Amenities", "Specifications"],
    },
    {
      id: "villa",
      title: "Villa",
      description: "Independent villas with plot area, garden space, and premium amenities",
      icon: "🏡",
      features: ["Plot Area", "Garden Space", "Multiple Floors", "Premium Amenities"],
    },
    {
      id: "open-plot",
      title: "Open Plot",
      description: "Land plots with dimensions, soil type, and development potential",
      icon: "🏞️",
      features: ["Plot Dimensions", "Soil Analysis", "Approvals", "Development Potential"],
    },
    {
      id: "commercial",
      title: "Commercial",
      description: "Commercial properties with business-specific features and amenities",
      icon: "🏢",
      features: ["Business Setup", "Commercial Amenities", "Location Benefits", "Investment Potential"],
    },
    {
      id: "farm-land",
      title: "Farm Land",
      description: "Agricultural land with soil type, irrigation details, and crop potential",
      icon: "�",
      features: ["Soil Type", "Irrigation", "Crop Potential", "Land Use"],
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Select Property Type</h2>
              <p className="text-gray-600">Choose the type of property you want to add</p>
            </div>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {propertyTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedType === type.id ? "ring-2 ring-red-500 bg-red-50" : ""
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{type.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900">{type.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 text-center">{type.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm">Key Features:</h4>
                    <ul className="space-y-1">
                      {type.features.map((feature, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center">
                          <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between space-x-4 sticky bottom-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedType && onSelect(selectedType as any)}
              disabled={!selectedType}
              className="bg-red-500 hover:bg-red-600"
            >
              Continue with {selectedType ? propertyTypes.find((t) => t.id === selectedType)?.title : "Selection"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
