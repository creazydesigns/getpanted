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
      style={{
        background: "#1A1A1A",
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 12,
        padding: "8px 16px",
        letterSpacing: "0.04em",
      }}
    >
      {text}
    </div>
  );
}
