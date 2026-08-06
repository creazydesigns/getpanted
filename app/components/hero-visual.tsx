"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Transparent cutouts in public/images/ — crossfade every 5s.
 */
export const HERO_CUTOUTS = [
  {
    src: "/images/gp-hero-full.png",
    alt: "Model in GetPanted full-length wide-leg trousers",
  },
  {
    src: "/images/gp-hero-2.png",
    alt: "Model in GetPanted trousers",
  },
  {
    src: "/images/gp-hero-3.png",
    alt: "Model in GetPanted trousers",
  },
  {
    src: "/images/gp-hero-4.png",
    alt: "Model in GetPanted trousers",
  },
] as const;

const INTERVAL_MS = 5_000;

export function HeroVisual() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (HERO_CUTOUTS.length < 2) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_CUTOUTS.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="hp-hero-visual">
      <div className="hp-hero-media">
        {HERO_CUTOUTS.map((image, i) => (
          <div
            key={image.src}
            className={`hp-hero-slide${i === index ? " is-active" : ""}`}
            aria-hidden={i !== index}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 900px) 100vw, 55vw"
              quality={90}
              className="hp-hero-img"
            />
          </div>
        ))}

        <div
          className={`hp-look-tags${index === 0 ? " is-active" : ""}`}
          aria-hidden={index !== 0}
        >
          <Link href="/collections" className="hp-look-tag hp-look-tag--waist">
            Pleated Waist
          </Link>
          <Link href="/collections" className="hp-look-tag hp-look-tag--leg">
            Wide-Leg Trouser
          </Link>
          <Link href="/collections" className="hp-look-tag hp-look-tag--hem">
            Full-Length Fit
          </Link>
        </div>
      </div>
    </div>
  );
}
