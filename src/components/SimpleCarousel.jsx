"use client";
import React, { useState, useEffect, useRef } from "react";

export default function SimpleCarousel({ slides = [], interval = 4000 }) {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearTimeout(timeoutRef.current);
  }, [current, slides.length, interval]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative h-80 md:h-96 w-full overflow-hidden rounded-lg shadow-lg">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img
            src={slide.img}
            alt={slide.text || `slide-${idx + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
          {slide.text && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-white">{slide.text}</h3>
            </div>
          )}
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-white" : "bg-gray-400"}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
