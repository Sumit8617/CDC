import React, { useEffect, useRef, useState } from "react";

const ResponsiveUnderline = ({ animate }) => {
  const textRef = useRef(null);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth);
    }
  }, []);

  return (
    <span className="relative inline-block text-indigo-600" ref={textRef}>
      Weekly Aptitude
      <svg
        viewBox="0 0 600 80"
        className="absolute -bottom-6 md:-bottom-7 left-1/2 -translate-x-1/2 h-12"
        style={{
          width: `${textWidth * 1}px`,
        }}
      >
        <defs>
          <linearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f9731" />
            <stop offset="50%" stopColor="#f97315" />
            <stop offset="100%" stopColor="#f97318" />
          </linearGradient>
        </defs>
        <path
          d="M0 50 C120 0, 480 100, 600 40"
          fill="transparent"
          stroke="url(#arcGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="800"
          strokeDashoffset={animate ? "0" : "800"}
          style={{
            transition: "stroke-dashoffset 2s ease-in-out",
          }}
        />
      </svg>
    </span>
  );
};

export default ResponsiveUnderline;
