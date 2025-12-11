import { CheckCircle, MapPin, Phone } from "lucide-react";
import React from "react";

export default function ProjectHeader({ data, onContact }: any) {
    return (
        <div className=" py-6 border-b z-20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

                {/* LEFT SIDE */}
                <div>
                    <div className="flex flex-wrap gap-3 mb-2">
                        {data.isLatest && (
                            <span className="bg-blue-700 text-white text-xs px-3 py-1 rounded-full">
                                New Launch
                            </span>
                        )}
                        {data.reraNo && (
                            <span className="bg-gold3 text-white px-3 py-1 rounded-full text-xs flex flex-row items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-white" /> RERA NO:{data.reraNo}
                            </span>
                        )}
                        <span className="bg-greenTheme text-white px-3 py-1 rounded-full text-xs">
                            {data.status}
                        </span>
                        {data.featured && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                                Featured
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                        {data.title}
                    </h1>

                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                       <MapPin className="w-4 h-4 "/>
                        {data.location}
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="text-right flex flex-col gap-2">
                    <div className="flex items-center lg:justify-end">
                    <button
                        onClick={onContact}
                        className=" bg-gold3 text-white font-semibold flex flex-row gap-1 px-6 py-3 rounded-full hover:bg-gold1"
                    >
                       <span className="p-1 bg-white rounded-full"><Phone className="fill-gold3 h-4 w-4 font-bold"/></span> Contact Us
                    </button></div>
                    <div className="flex flex-row items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {data.priceRange}
                    </h2>
                    <div className=" h-full bg-black">.</div>
                    <p className=" text-sm font-semibold ">
                        {data.pricePerSqft}
                    </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
