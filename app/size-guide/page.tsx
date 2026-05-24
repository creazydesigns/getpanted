"use client";

import Link from "next/link";
import { PageFooter } from "../components/page-footer";

const SIZE_CHART = [
  { size: "XS", waist: "60–64", hips: "86–90", length: "100" },
  { size: "S",  waist: "65–69", hips: "91–95", length: "101" },
  { size: "M",  waist: "70–74", hips: "96–100", length: "102" },
  { size: "L",  waist: "75–79", hips: "101–105", length: "103" },
  { size: "XL", waist: "80–84", hips: "106–110", length: "104" },
  { size: "2XL", waist: "85–90", hips: "111–116", length: "105" },
];

export default function SizeGuidePage() {
  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF" }}>
      <section className="px-5 md:px-12 pt-28 pb-16" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>
            GetPanted Size Guide
          </p>
          <h1 className="font-barlow-cond font-bold" style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1, color: "#1A1A1A" }}>
            Find the fit that feels like you.
          </h1>
          <p className="font-barlow mt-6" style={{ fontSize: "16px", color: "#6B6B6B", lineHeight: 1.75 }}>
            Our trousers are designed with real women&apos;s bodies in mind, with attention to waist, hips, length, and movement.
          </p>
          <p className="font-barlow mt-4" style={{ fontSize: "16px", color: "#6B6B6B", lineHeight: 1.75 }}>
            Before ordering, please compare your body measurements with the GetPanted size chart. If you are between sizes,{" "}
            <Link href="/contact" className="underline transition-colors hover:text-[#5C2D8F]" style={{ color: "#1A1A1A" }}>
              contact us
            </Link>{" "}
            and we will recommend the best fit based on your measurements.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-12 py-16" style={{ background: "#F7F7F7", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#5C2D8F" }}>
            Measurement Tip
          </p>
          <p className="font-barlow" style={{ fontSize: "15px", color: "#6B6B6B", lineHeight: 1.8 }}>
            Measure your waist, hips, and preferred trouser length while standing straight. For the best result, use a soft measuring tape.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-12 py-16 md:py-24" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[900px] mx-auto overflow-x-auto">
          <table className="w-full min-w-[560px]" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #1A1A1A" }}>
                {["Size", "Waist (cm)", "Hips (cm)", "Trouser Length (cm)"].map((heading) => (
                  <th
                    key={heading}
                    className="font-barlow-cond font-bold uppercase text-left py-4 pr-6"
                    style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#1A1A1A" }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.size} style={{ borderBottom: "1px solid #F0F0F0" }}>
                  <td className="font-barlow-cond font-bold py-4 pr-6" style={{ fontSize: "14px", color: "#5C2D8F" }}>{row.size}</td>
                  <td className="font-barlow py-4 pr-6" style={{ fontSize: "14px", color: "#6B6B6B" }}>{row.waist}</td>
                  <td className="font-barlow py-4 pr-6" style={{ fontSize: "14px", color: "#6B6B6B" }}>{row.hips}</td>
                  <td className="font-barlow py-4" style={{ fontSize: "14px", color: "#6B6B6B" }}>{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="font-barlow mt-6" style={{ fontSize: "13px", color: "#AAAAAA", fontStyle: "italic" }}>
            Size chart is a guide. Final fit may vary slightly by style. Contact us if you need help choosing your size.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-12 py-20 text-center" style={{ background: "#F7F7F7", borderTop: "1px solid #F0F0F0" }}>
        <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Sold Out in Your Size?</p>
        <h2 className="mx-auto mb-6 font-barlow-cond font-bold" style={{ fontSize: "clamp(28px, 3vw, 40px)", color: "#1A1A1A", maxWidth: "480px" }}>
          Request made to order.
        </h2>
        <Link
          href="/made-to-order"
          className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80"
          style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "16px 48px", background: "#5C2D8F" }}
        >
          Made to Order
        </Link>
      </section>

      <PageFooter />
    </main>
  );
}
