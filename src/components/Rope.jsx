// src/components/Rope.jsx
import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
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
    { id: "paper-1", text: "Spaghetti", attachedTo: "monday" },
    { id: "paper-2", text: "Chicken Curry", attachedTo: "tuesday" },
    { id: "paper-3", text: "Tacos", attachedTo: "wednesday" },
    { id: "paper-4", text: "Pizza", attachedTo: "thursday" },
    { id: "paper-5", text: "Salmon", attachedTo: "friday" },
    { id: "paper-6", text: "Stir Fry", attachedTo: "saturday" },
    { id: "paper-7", text: "Roast Beef", attachedTo: "sunday" },
  ]);

  // Quadratic Bezier y for the rope path: (0,10) -> (50,25) -> (100,10)
  const getY = (xPercent) => {
    const t = xPercent / 100;
    return (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 25 + t * t * 10;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
    
      setPapers(papers.map(paper => 
        paper.id === active.id ? { ...paper, attachedTo: over.id } : paper
      ));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="w-full flex justify-center items-start relative">
        {/* Rope SVG curve */}
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-20 z-10">
          <path d="M 0 10 Q 50 25 100 10" stroke="#8B5E3C" strokeWidth="4" fill="transparent" />
        </svg>

        {/* Clips + papers placed along the rope (10%–90%) */}
        {days.map((d, i) => {
          const x = 10 + (i / 6) * 80;     // 10% → 90%
          const y = getY(x) * 2;           // match the svg height scaling
          
          // Find papers attached to this day
          const attachedPapers = papers.filter(paper => paper.attachedTo === d.id);
          
          return (
            <Clip key={d.id} id={d.id} label={d.label} text={d.text} x={x} y={y}>
              {attachedPapers.map(paper => (
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