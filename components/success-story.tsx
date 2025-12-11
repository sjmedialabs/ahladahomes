"use client";

import Image from "next/image";
import { Quote } from "lucide-react";

interface SuccessStoryProps {
  message: string;
  name: string;
  role: string;
  image: string;
}

export function SuccessStory({ message, name, role, image }: SuccessStoryProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border-2 border-gray-200 shadow-lg px-8 py-6 text-center relative">

      {/* Quote Icon */}
      <div className="flex justify-center mb-6">
        <Quote className="w-12 h-12 text-gray-300 fill-current" />
      </div>

      {/* Message */}
      <p className=" text-xs leading-relaxed max-w-3xl mx-auto">
        {message}
      </p>

      {/* Profile */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            width={56}
            height={56}
            className="object-cover"
          />
        </div>

        <h3 className="mt-3 text-lg font-semibold">
          {name}
        </h3>

        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}
