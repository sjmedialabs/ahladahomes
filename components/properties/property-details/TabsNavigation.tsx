import React from "react";

export default function TabsNavigation({ tabs, active, onChange } : any) {
  return (
    <div className="border-b bg-white sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-12 flex gap-8 justify-between overflow-x-auto py-4">
        {tabs.map((tab: string) => (
            <button
                key={tab}
                onClick={() => onChange(tab)}
                className={`pb-2 border-b-2 text-base font-semibold ${active === tab
                    ? "border-gold3 text-gold3"
                    : "border-transparent text-gray-700 hover:text-gray-900"}`}
            >
                {tab}
            </button>
        ))}
      </div>
    </div>
  );
}
