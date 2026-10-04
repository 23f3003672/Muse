import React from "react";

interface LuxuryLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export default function LuxuryLoader({
  className = "",
  size = "md",
  text = "MUSE",
  fullScreen = false,
}: LuxuryLoaderProps) {
  const dimension = size === "sm" ? 36 : size === "lg" ? 64 : 48;
  const strokeWidth = size === "sm" ? 2 : 2.5;

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3.5 select-none ${className}`}>
      {/* Animated Luxury Diamond & Halo Spinner */}
      <div className="relative flex items-center justify-center" style={{ width: dimension, height: dimension }}>
        {/* Soft Golden Aura */}
        <div 
          className="absolute inset-0 rounded-full blur-md opacity-40 animate-pulse pointer-events-none"
          style={{ background: "radial-gradient(circle, #f4ccaf 0%, rgba(200, 115, 85, 0.2) 70%, transparent 100%)" }}
        />

        {/* Outer Rotating Ring */}
        <svg
          className="animate-spin text-[#c87355]"
          style={{ animationDuration: "1.8s" }}
          width={dimension}
          height={dimension}
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background track */}
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="#eee7e1"
            strokeWidth={strokeWidth}
            opacity="0.6"
          />
          {/* Active Gradient Arch */}
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="url(#luxury-loader-grad)"
            strokeWidth={strokeWidth}
            strokeDasharray="38 85"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="luxury-loader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c87355" />
              <stop offset="60%" stopColor="#f4ccaf" />
              <stop offset="100%" stopColor="#5f3f33" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner Diamond / Sparkle Gem Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            className="animate-pulse"
            style={{ animationDuration: "1.4s" }}
            width={dimension * 0.38}
            height={dimension * 0.38}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5f3f33"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Elegant 4-point jewelry star */}
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#f4ccaf" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Elegant Brand Caption */}
      {text && (
        <span className="font-serif tracking-[0.35em] text-[10px] sm:text-xs uppercase text-[#5f3f33] font-medium opacity-85 transition-opacity">
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f8f5f2]/85 backdrop-blur-[6px] transition-all duration-300">
        {content}
      </div>
    );
  }

  return content;
}
