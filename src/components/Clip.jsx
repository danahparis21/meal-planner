// src/components/Clip.jsx
import { useDroppable } from "@dnd-kit/core";
import { useState, useEffect, useRef } from "react";

const COLORS = [
  "#9CA3AF", // gray
  "#F87171", // red
  "#FBBF24", // yellow
  "#34D399", // green
  "#60A5FA", // blue
  "#A78BFA", // purple
  "#F472B6", // pink
];

const Clip = ({ label = "M", x = 0, y = 0, id, children }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  const [color, setColor] = useState(COLORS[0]);
  const [showPicker, setShowPicker] = useState(false);

  const wrapperRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col items-center absolute cursor-pointer select-none"
      style={{
        left: `${x}%`,
        top: `${y}px`,
        transform: "translateX(-50%)",
      }}
    >
      {/* Color picker ABOVE the clip */}
      <div
        className={`absolute -top-16 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 ease-out
          ${showPicker ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
          <div className="flex gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                className="w-5 h-5 rounded-full border hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                onClick={(e) => {
                  e.stopPropagation();
                  setColor(c);
                  setShowPicker(false);
                }}
                aria-label={`Set clip color ${c}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Rope attachment */}
      <div className="w-1 h-6 bg-gray-600 z-20 relative" />

      {/* Clip body */}
      <div
        className="w-8 h-10 rounded-md shadow-md flex items-center justify-center 
                   transition-all duration-200 relative z-30
                   hover:scale-110 hover:brightness-110"
        style={{
          backgroundColor: isOver ? "#F59E0B" : color,
          border: isOver ? "2px dashed #000" : "none",
        }}
        onClick={() => setShowPicker((prev) => !prev)}
      >
        <span className="text-xs font-bold text-white">{label}</span>
      </div>

      {/* Paper behind */}
      <div ref={setNodeRef} className="absolute top-10 mt-2 z-10">
        {children}
      </div>
    </div>
  );
};

export default Clip;
