import { useDraggable } from "@dnd-kit/core";
import { useMemo, useEffect, useRef, useState } from "react";

export default function Paper({ id, text }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const paperRef = useRef(null);
  const textareaRef = useRef(null);

  const rotation = useMemo(() => Math.random() * 10 - 5, []);
  const [value, setValue] = useState(text || "");

  // 🔥 Apply transforms outside React's render loop
  useEffect(() => {
    if (!paperRef.current) return;

    let animationFrame;
    const el = paperRef.current;

    if (transform) {
      animationFrame = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${rotation}deg)`;
        el.style.zIndex = 1000;
        el.style.transition = "none";
      });
    } else {
      animationFrame = requestAnimationFrame(() => {
        el.style.transform = `translate3d(0px, 0px, 0) rotate(${rotation}deg)`;
        el.style.zIndex = 1;
        el.style.transition = "transform 0.2s ease-out";
      });
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [transform, rotation]);

  // 🔹 Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px"; // reset to calculate scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        paperRef.current = node;
      }}
      className="
        bg-white border-2 border-pink-200
        shadow-lg rounded-lg
        flex flex-col
        cursor-default
        select-none touch-none
        will-change-transform

        w-20 h-28
        sm:w-28 sm:h-36
        md:w-36 md:h-48
        lg:w-44 lg:h-60
        xl:w-52 xl:h-72
      "
    >
      {/* 🔹 Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="w-full h-4 bg-pink-100 rounded-t-lg cursor-grab active:cursor-grabbing"
      />

      {/* 🔹 Editable textarea container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter meal..."
          className="
            w-full max-h-full
            p-2
            text-center font-medium text-gray-700
            bg-transparent outline-none
            resize-none
            overflow-auto
          "
        />
      </div>
    </div>
  );
}
