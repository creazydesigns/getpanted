import fs from "fs";
import path from "path";

const reps = [
  ["bg-[#0a0a0a]/95", "bg-[var(--gp-header)]"],
  ["bg-[#0a0a0a]", "bg-[var(--gp-canvas)]"],
  ["text-[#f5f0e8]", "text-[var(--gp-fg)]"],
  ["bg-[#060606]", "bg-[var(--gp-deep)]"],
  ["bg-[#111]", "bg-[var(--gp-elevated)]"],
  ["bg-[#161616]", "bg-[var(--gp-card)]"],
  ["bg-[#151515]", "bg-[var(--gp-card)]"],
  ["bg-[#0f0f0f]", "bg-[var(--gp-marquee)]"],
  ["bg-[#0d0d0d]", "bg-[var(--gp-deep)]"],
  ["text-[#0a0a0a]", "text-[var(--gp-accent-ink)]"],
  ["hover:text-[#f5f0e8]", "hover:text-[var(--gp-fg)]"],
  ["bg-[#c9a96e]", "bg-[var(--gp-accent)]"],
  ["text-[#c9a96e]", "text-[var(--gp-accent)]"],
  ["border-[#c9a96e]", "border-[var(--gp-accent)]"],
  ["hover:border-[#c9a96e]", "hover:border-[var(--gp-accent)]"],
  ["hover:text-[#c9a96e]", "hover:text-[var(--gp-accent)]"],
  ["hover:bg-[#e0c08a]", "hover:bg-[var(--gp-accent-hover)]"],
  ['fill="#c9a96e"', 'fill="var(--gp-accent)"'],
  ['stroke="#c9a96e"', 'stroke="var(--gp-accent)"'],
];

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".tsx")) {
      let t = fs.readFileSync(p, "utf8");
      let n = t;
      for (const [a, b] of reps) n = n.split(a).join(b);
      if (n !== t) fs.writeFileSync(p, n);
    }
  }
}

walk(path.join(process.cwd(), "app"));
