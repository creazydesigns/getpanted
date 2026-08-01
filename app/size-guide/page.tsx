"use client";

import Link from "next/link";
import { PageFooter } from "../components/page-footer";
import { StorefrontHeader } from "../components/storefront-header";
import "../storefront.css";

const SIZE_CHART = [
  { size: "XS", waist: "60–64", hips: "86–90", length: "100" },
  { size: "S", waist: "65–69", hips: "91–95", length: "101" },
  { size: "M", waist: "70–74", hips: "96–100", length: "102" },
  { size: "L", waist: "75–79", hips: "101–105", length: "103" },
  { size: "XL", waist: "80–84", hips: "106–110", length: "104" },
  { size: "2XL", waist: "85–90", hips: "111–116", length: "105" },
];

export default function SizeGuidePage() {
  return (
    <main className="hp-page font-barlow overflow-x-hidden">
      <StorefrontHeader
        eyebrow="GetPanted Size Guide"
        title="Find the fit that feels like you."
        description="Our trousers are designed with real women's bodies in mind, with attention to waist, hips, length, and movement."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Size Guide" },
        ]}
        narrow
      />

      <section className="hp-section py-8 md:py-10">
        <div className="mx-auto max-w-[900px]">
          <p className="hp-body">
            Before ordering, please compare your body measurements with the GetPanted size chart. If you are between sizes,{" "}
            <Link
              href="/contact"
              className="underline transition-colors hover:text-[var(--hp-accent)]"
              style={{ color: "var(--hp-ink)" }}
            >
              contact us
            </Link>{" "}
            and we will recommend the best fit based on your measurements.
          </p>
        </div>
      </section>

      <section className="hp-section hp-soft-band py-12 md:py-14">
        <div className="mx-auto max-w-[900px]">
          <p className="hp-eyebrow mb-3">Measurement Tip</p>
          <p className="hp-body" style={{ fontSize: "15px", lineHeight: 1.8 }}>
            Measure your waist, hips, and preferred trouser length while standing straight. For the best result, use a soft measuring tape.
          </p>
        </div>
      </section>

      <section className="hp-section py-16 md:py-24">
        <div className="mx-auto max-w-[900px] overflow-x-auto">
          <table className="w-full min-w-[560px]" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--hp-ink)" }}>
                {["Size", "Waist (cm)", "Hips (cm)", "Trouser Length (cm)"].map((heading) => (
                  <th
                    key={heading}
                    className="font-barlow-cond font-bold uppercase text-left py-4 pr-6"
                    style={{ fontSize: "11px", letterSpacing: "0.14em", color: "var(--hp-ink)" }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.size} style={{ borderBottom: "1px solid var(--hp-border)" }}>
                  <td
                    className="font-barlow-cond font-bold py-4 pr-6"
                    style={{ fontSize: "14px", color: "var(--hp-accent)" }}
                  >
                    {row.size}
                  </td>
                  <td className="hp-body-sm py-4 pr-6">{row.waist}</td>
                  <td className="hp-body-sm py-4 pr-6">{row.hips}</td>
                  <td className="hp-body-sm py-4">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hp-body-sm mt-6" style={{ color: "#AAAAAA", fontStyle: "italic" }}>
            Size chart is a guide. Final fit may vary slightly by style. Contact us if you need help choosing your size.
          </p>
        </div>
      </section>

      <section className="hp-section hp-soft-band py-20 text-center">
        <div className="mx-auto max-w-[480px]">
          <p className="hp-eyebrow mb-4">Sold Out in Your Size?</p>
          <h2
            className="font-barlow-cond font-bold mb-6"
            style={{ fontSize: "clamp(28px, 3vw, 40px)", color: "var(--hp-ink)" }}
          >
            Request made to order.
          </h2>
          <Link href="/made-to-order" className="btn-hp-primary">
            Made to Order
          </Link>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
