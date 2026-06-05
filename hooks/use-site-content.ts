"use client";

import { useEffect, useState } from "react";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content-defaults";

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, string>>(SITE_CONTENT_DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/site-content")
      .then((r) => r.json())
      .then((d) => {
        if (d.content) setContent({ ...SITE_CONTENT_DEFAULTS, ...d.content });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return { content, loaded, get: (key: string) => content[key] ?? SITE_CONTENT_DEFAULTS[key] ?? "" };
}
