// src/components/Rope.jsx
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Clip from "./Clip.jsx";
import Paper from "./Paper.jsx";

export default function Rope() {
  const days = [
    { id: "monday", label: "M", text: "Monday" },
    { id: "tuesday", label: "T", text: "Tuesday" },
    { id: "wednesday", label: "W", text: "Wednesday" },
    { id: "thursday", label: "Th", text: "Thursday" },
    { id: "friday", label: "F", text: "Friday" },
    { id: "saturday", label: "S", text: "Saturday" },
    { id: "sunday", label: "Su", text: "Sunday" },
  ];

  // Initial paper assignments
  const [papers, setPapers] = useState([
    { id: "paper-1", text: "", attachedTo: "monday" },
    { id: "paper-2", text: "", attachedTo: "tuesday" },
    { id: "paper-3", text: "", attachedTo: "wednesday" },
    { id: "paper-4", text: "", attachedTo: "thursday" },
    { id: "paper-5", text: "", attachedTo: "friday" },
    { id: "paper-6", text: "", attachedTo: "saturday" },
    { id: "paper-7", text: "", attachedTo: "sunday" },
  ]);

  // 🟢 Enable both mouse + touch dragging
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 75, // less hold delay
        tolerance: 3, // smaller movement required
      },
    }),

    useSensor(KeyboardSensor)
  );

  // Quadratic Bezier y for the rope path
  const getY = (xPercent) => {
    const t = xPercent / 100;
    return (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 25 + t * t * 10;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPapers((papers) =>
        papers.map((paper) =>
          paper.id === active.id ? { ...paper, attachedTo: over.id } : paper
        )
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      measuring={{ droppable: { strategy: "always" } }} // ⚡ smoother measuring
    >
      <div className="w-full flex justify-center items-start relative">
        {/* Rope SVG curve */}
        <svg
          viewBox="0 0 100 30"
          preserveAspectRatio="none"
          className="w-full h-20 z-10"
        >
          <path
            d="M 0 10 Q 50 25 100 10"
            stroke="#8B5E3C"
            strokeWidth="4"
            fill="transparent"
          />
        </svg>

        {/* Clips + papers */}
        {days.map((d, i) => {
          const x = 10 + (i / 6) * 80;
          const y = getY(x) * 2;

          const attachedPapers = papers.filter(
            (paper) => paper.attachedTo === d.id
          );

          return (
            <Clip
              key={d.id}
              id={d.id}
              label={d.label}
              text={d.text}
              x={x}
              y={y}
            >
              {attachedPapers.map((paper) => (
                <Paper
                  key={paper.id}
                  id={paper.id}
                  text={paper.text}
                  attachedTo={paper.attachedTo}
                />
              ))}
            </Clip>
          );
        })}
      </div>
    </DndContext>
  );
}
