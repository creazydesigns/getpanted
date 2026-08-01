"use client";

import { useSiteContent } from "@/hooks/use-site-content";

export function AnnouncementBar() {
  const { get, loaded } = useSiteContent();

  if (!loaded) return null;

  const enabled = get("announcement.enabled").toLowerCase() === "true";
  const text = get("announcement.text");

  if (!enabled || !text) return null;

  return (
    <div
      className="font-barlow-cond font-bold uppercase text-center"
      style={{
        background: "#5C2D8F",
        color: "#FFFFFF",
        fontSize: 11,
        padding: "9px 16px",
        letterSpacing: "0.14em",
      }}
    >
      {text}
    </div>
  );
}
