"use client";

import { useEffect, useState } from "react";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

function initialsFromName(name: string) {
  const parts = name.replace(/\./g, "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [active, items.length]);

  if (!current) return null;

  return (
    <div className="hp-testimonial" data-reveal="up">
      <div key={current.name} className="hp-testimonial-slide">
        <div className="hp-testimonial-avatar" aria-hidden>
          <span className="hp-testimonial-initials font-barlow-cond">
            {initialsFromName(current.name)}
          </span>
        </div>
        <blockquote className="hp-testimonial-quote font-barlow">
          “{current.quote}”
        </blockquote>
        <p className="hp-testimonial-name font-barlow-cond">{current.name}</p>
        <p className="hp-testimonial-role font-barlow">{current.role}</p>
      </div>

      {items.length > 1 ? (
        <div className="hp-testimonial-dots" role="tablist" aria-label="Testimonial slides">
          {items.map((item, i) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show testimonial from ${item.name}`}
              className={`hp-testimonial-dot${i === active ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
