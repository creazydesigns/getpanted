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
    const observed = new WeakSet<Element>();

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

    const observe = (el: Element) => {
      if (observed.has(el) || el.classList.contains("in-view")) return;
      observed.add(el);
      obs.observe(el);
    };

    document.querySelectorAll("[data-reveal]").forEach(observe);

    // Product grids load after fetch — observe [data-reveal] nodes added later.
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]")) observe(node);
          node.querySelectorAll("[data-reveal]").forEach(observe);
        });
      }
    });

    mo.observe(document.body, { childList: true, subtree: true });

    const rescan = () => {
      document.querySelectorAll("[data-reveal]:not(.in-view)").forEach(observe);
    };
    const timers = [150, 800, 2000].map((ms) => setTimeout(rescan, ms));

    return () => {
      timers.forEach(clearTimeout);
      obs.disconnect();
      mo.disconnect();
    };
  }, []);
}
