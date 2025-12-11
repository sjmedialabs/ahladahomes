"use client"

interface StepperHeaderProps {
  steps: string[]
  currentStep: number
}

export default function StepperHeader({ steps, currentStep }: StepperHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isActive = index + 1 <= currentStep

        return (
          <div key={index} className="flex items-center">
            {/* Step Number Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all 
                ${isActive ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              {index + 1}
            </div>

            {/* Step Title */}
            <span
              className={`ml-2 text-sm transition-colors ${
                isActive ? "text-red-500 font-medium" : "text-gray-600"
              }`}
            >
              {step}
            </span>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-4 transition-colors ${
                  index + 1 < currentStep ? "bg-red-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
