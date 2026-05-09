"use client";

import { useEffect } from "react";

/**
 * Observes every [data-reveal] element inside the document and adds the
 * "in-view" class when it crosses the viewport threshold.
 *
 * Usage:
 *   1. Call useScrollReveal() once inside any client page component.
 *   2. Add data-reveal="up|down|left|right|scale|fade" to any element.
 *   3. Optionally add data-delay="1|2|3|4|5" for staggered timing.
 */
export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<Element>("[data-reveal]");

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
