// components/icons/AmenitiesIcons.tsx
import React from "react";

export const Icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  // Building
  Elevator: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M10 20V4M14 20V4" stroke="white" strokeWidth="2" />
    </svg>
  ),
  Security: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2L2 7v5c0 5 4 9 10 11 6-2 10-6 10-11V7l-10-5z" />
    </svg>
  ),
"Power Backup": (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <polygon points="13 2 3 14 12 14 12 22 22 10 13 10" fill="currentColor" />
  </svg>
),
  "Water Supply": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2C8 8 12 14 12 20" stroke="white" strokeWidth="2" />
    </svg>
  ),
  Parking: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 2h8a4 4 0 0 1 0 8H6v12H4V2h2z" />
      <circle cx="12" cy="6" r="2" fill="white" />
    </svg>
  ),
  CCTV: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  ),

  // Recreational
  "Swimming Pool": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="2" y="10" width="20" height="6" rx="3" />
      <path d="M2 10s2-4 10-4 10 4 10 4" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  ),
  Gym: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="3" y="10" width="18" height="4" />
      <circle cx="6" cy="12" r="2" fill="white" />
      <circle cx="18" cy="12" r="2" fill="white" />
    </svg>
  ),
  Clubhouse: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="4" y="8" width="16" height="12" />
      <path d="M12 8V4" stroke="white" strokeWidth="2" />
      <path d="M8 12h8" stroke="white" strokeWidth="2" />
    </svg>
  ),
  "Sports Court": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 12h18M12 3v18" stroke="white" strokeWidth="2" />
    </svg>
  ),
  "Children's Play Area": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  ),
"Jogging Track": (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 12h16" stroke="currentColor" strokeWidth="2" />
    <path d="M12 4v16" stroke="currentColor" strokeWidth="2" />
  </svg>
),

  // Convenience
  "Shopping Center": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 12h18" stroke="white" strokeWidth="2" />
    </svg>
  ),
  ATM: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="4" y="6" width="16" height="12" />
      <path d="M8 6v12M16 6v12" stroke="white" strokeWidth="2" />
    </svg>
  ),
  Laundry: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="6" />
      <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2" />
    </svg>
  ),
  Housekeeping: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 12h16M12 4v16" stroke="white" strokeWidth="2" />
    </svg>
  ),
  Maintenance: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <polygon points="12,2 15,8 21,9 17,14 18,20 12,17 6,20 7,14 3,9 9,8" />
    </svg>
  ),
Concierge: (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
),

  // Connectivity
"Wi-Fi": (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M2 8c6-6 16-6 22 0" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M6 12c4-4 12-4 16 0" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="18" r="2" fill="currentColor" />
  </svg>
),
  Intercom: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  ),
  "Cable TV": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 12h18" stroke="white" strokeWidth="2" />
    </svg>
  ),
  "High-Speed Internet": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2v20" stroke="white" strokeWidth="2" />
    </svg>
  ),
  "Smart Home Features": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 12l9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z" />
    </svg>
  ),

  // Outdoor
  Garden: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="6" />
      <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2" />
    </svg>
  ),
  Terrace: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="4" y="4" width="16" height="4" />
      <rect x="4" y="12" width="16" height="4" />
    </svg>
  ),
  Balcony: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="4" y="10" width="16" height="8" rx="2" />
    </svg>
  ),
  Landscaping: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M2 20h20L12 4 2 20z" />
    </svg>
  ),
  "Water Features": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="6" />
      <path d="M12 6c3 6 3 12 0 12s-3-6 0-12z" fill="white" />
    </svg>
  ),
  "Outdoor Seating": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="4" y="14" width="16" height="4" />
      <rect x="6" y="10" width="12" height="4" />
    </svg>
  ),

  // Safety
  "Fire Safety": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2c-4 8-4 16 0 20 4-4 4-12 0-20z" />
    </svg>
  ),
  "Emergency Exit": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <polygon points="12,2 22,12 12,22 2,12" />
    </svg>
  ),
  "Security Guards": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c0-4 12-4 12 0H6z" />
    </svg>
  ),
  "Access Control": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  ),
  "Smoke Detectors": (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  ),
};
