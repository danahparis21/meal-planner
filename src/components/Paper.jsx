// src/components/Paper.jsx
import { useDraggable } from "@dnd-kit/core";
import { useMemo } from "react";

export default function Paper({ id, text }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  // Fixed random tilt when mounted
  const rotation = useMemo(() => Math.random() * 10 - 5, []);

  // Smooth GPU-accelerated dragging
  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${
      transform?.y ?? 0
    }px, 0) rotate(${rotation}deg)`,
    zIndex: transform ? 1000 : 1,
    transition: transform ? "none" : "transform 0.2s ease-out",
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="
        w-72 h-96   /* bigger paper */
        bg-white border-2 border-pink-200
        shadow-lg rounded-xl
        flex items-center justify-center
        cursor-grab active:cursor-grabbing
        select-none
      "
    >
      <span className="text-xl text-gray-700 font-medium p-4 text-center">
        {text}
      </span>
    </div>
  );
}
