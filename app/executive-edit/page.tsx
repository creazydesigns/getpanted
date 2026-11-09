import Image from "next/image";
import Link from "next/link";
import { PageFooter } from "@/app/components/page-footer";
import {
  EE_CONTACT,
  EE_FAQS,
  EE_HERO_IMAGE,
  EE_PACKAGES,
  EE_PREORDER,
  EE_STRAIGHT_STYLES,
} from "@/lib/executive-edit/constants";
import "./executive-edit.css";
import "@/app/storefront.css";

export const metadata = {
  title: "The Executive Edit — Pre-Order | GetPanted",
  description:
    "A curated box of five trousers for women who dress with intention. Pre-order open 1–15 November 2026.",
};

const PILLARS = [
  {
    title: "Fabric",
    body: "Thoughtfully chosen cloth that holds its shape through the workday and still feels good to wear.",
  },
  {
    title: "Fit",
    body: "Clean lines cut for real bodies — polished enough for the office, easy enough for everything after.",
  },
  {
    title: "Versatility",
    body: "Five pieces that mix and match so you get more outfits than pairs in the box.",
  },
  {
    title: "Curation",
    body: "You choose the colours and sizes. We handle the editing so your wardrobe feels intentional, not accidental.",
  },
];

const STEPS = [
  {
    title: "Choose your box",
    body: "Classic or Signature — pick the edit that matches how you dress.",
  },
  {
    title: "Build your five",
    body: "Select five styles and a size for each from the available colourways.",
  },
  {
    title: "Pay in full",
    body: "Secure your place in the November production run with full payment via Paystack.",
  },
  {
    title: "Receive your edit",
    body: `Delivery begins in the ${EE_PREORDER.deliveryLabel}. Updates by email and WhatsApp.`,
  },
];

const GALLERY_CAPTIONS = [
  "Beige — soft neutral for boardrooms and brunch",
  "Coffee Brown — grounded colour that elevates basics",
  "White — crisp contrast under blazers and knits",
  "Army Green — unexpected polish for midweek looks",
  "Black — the forever staple, five ways",
];

export default function ExecutiveEditPage() {
  return (
    <main className="ee-page font-barlow overflow-x-hidden min-h-screen">
      <section className="ee-section ee-hero ee-wrap" id="top">
        <div>
          <p className="ee-eyebrow">The Executive Edit</p>
          <h1 className="ee-h1">Five trousers. One intentional wardrobe.</h1>
          <p className="ee-lead" style={{ marginTop: "1.25rem" }}>
            A curated pre-order box for professional women who want fewer pieces and more ways to
            wear them. You choose the colours and sizes. Delivery is included.
          </p>
          <div className="ee-hero-actions">
            <a href="#boxes" className="btn-hp-dark">
              Choose your box
            </a>
            <a href="#how" className="btn-hp-outline">
              How pre-ordering works
            </a>
          </div>
          <p className="ee-hero-meta">
            Pre-order {EE_PREORDER.windowLabel} · Delivery from {EE_PREORDER.deliveryLabel}
          </p>
        </div>
        <div className="ee-hero-media">
          <Image
            src={EE_HERO_IMAGE}
            alt="GetPanted The Executive Edit"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="ee-section ee-surface" id="idea">
        <div className="ee-wrap ee-split">
          <div>
            <p className="ee-eyebrow">The idea</p>
            <h2 className="ee-h2">Your wardrobe deserves more intention.</h2>
          </div>
          <div>
            <p className="ee-body">
              Most workwear shopping ends in one more pair that almost works. The Executive Edit is
              different: five trousers chosen by you, styled as a set, so getting dressed for work
              feels simpler — and sharper.
            </p>
            <p className="ee-body" style={{ marginTop: "1rem" }}>
              Pre-order locks your selections into our November production run. You pay in full now;
              we deliver from the {EE_PREORDER.deliveryLabel}.
            </p>
          </div>
        </div>
      </section>

      <section className="ee-section" id="boxes">
        <div className="ee-wrap">
          <p className="ee-eyebrow">Choose your box</p>
          <h2 className="ee-h2" style={{ marginBottom: "0.75rem" }}>
            Classic or Signature
          </h2>
          <p className="ee-lead" style={{ marginBottom: "2rem" }}>
            Both boxes include five pieces, your size for each, a styling guide, and delivery.
          </p>
          <div className="ee-packages">
            {Object.values(EE_PACKAGES).map((pkg) => (
              <article key={pkg.id} className="ee-package">
                <p className="ee-eyebrow" style={{ marginBottom: 0 }}>
                  {pkg.shortName}
                </p>
                <p className="ee-package-price">{pkg.priceLabel}</p>
                <p className="ee-body" style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
                  {pkg.description}
                </p>
                <ul>
                  {pkg.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link href={`/executive-edit/checkout?package=${pkg.id}`} className="btn-hp-dark">
                  {pkg.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ee-section ee-surface" id="different">
        <div className="ee-wrap">
          <p className="ee-eyebrow">What makes this different</p>
          <h2 className="ee-h2" style={{ marginBottom: "2rem" }}>
            Built for how you actually dress
          </h2>
          <div className="ee-pillars">
            {PILLARS.map((p) => (
              <div key={p.title} className="ee-pillar">
                <h3>{p.title}</h3>
                <p className="ee-body" style={{ fontSize: "0.95rem" }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ee-section" id="gallery">
        <div className="ee-wrap">
          <p className="ee-eyebrow">See the possibilities</p>
          <h2 className="ee-h2" style={{ marginBottom: "0.75rem" }}>
            Straight Pants colourways
          </h2>
          <p className="ee-lead" style={{ marginBottom: "2rem" }}>
            Classic is five from these colourways. Signature starts here and expands as new
            silhouettes launch.
          </p>
          <div className="ee-gallery">
            {EE_STRAIGHT_STYLES.map((style, i) => (
              <figure key={style.slug} className="ee-gallery-item">
                <div className="ee-gallery-media">
                  <Image
                    src={style.image}
                    alt={style.name}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <figcaption className="ee-gallery-caption">
                  <strong>{style.colorName}</strong>
                  <span className="ee-body" style={{ fontSize: 13 }}>
                    {GALLERY_CAPTIONS[i] ?? style.name}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="ee-section ee-surface" id="how">
        <div className="ee-wrap">
          <p className="ee-eyebrow">How pre-ordering works</p>
          <h2 className="ee-h2" style={{ marginBottom: "0.75rem" }}>
            Four clear steps
          </h2>
          <p className="ee-lead" style={{ marginBottom: "2rem" }}>
            Window: {EE_PREORDER.windowLabel}. Delivery from {EE_PREORDER.deliveryLabel}. Shipping
            included in the package price.
          </p>
          <div className="ee-steps">
            {STEPS.map((step) => (
              <div key={step.title} className="ee-step">
                <h3>{step.title}</h3>
                <p className="ee-body" style={{ fontSize: "0.9rem" }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ee-section" id="faq">
        <div className="ee-wrap" style={{ maxWidth: 720 }}>
          <p className="ee-eyebrow">FAQs</p>
          <h2 className="ee-h2" style={{ marginBottom: "1.5rem" }}>
            Before you order
          </h2>
          <div className="ee-faq">
            {EE_FAQS.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <p className="ee-body" style={{ marginTop: "1.5rem", fontSize: 14 }}>
            Questions?{" "}
            <a href={EE_CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>{" "}
            or{" "}
            <a href={EE_CONTACT.instagram} target="_blank" rel="noopener noreferrer">
              Instagram {EE_CONTACT.instagramHandle}
            </a>
            . We use your details only for fulfilment and updates.
          </p>
        </div>
      </section>

      <section className="ee-section ee-final" id="cta">
        <div className="ee-wrap">
          <p className="ee-eyebrow" style={{ color: "var(--ee-beige)" }}>
            Pre-order closes 15 November 2026
          </p>
          <h2 className="ee-h2">Secure your Executive Edit</h2>
          <p className="ee-lead" style={{ marginTop: "1rem" }}>
            Full payment now. Delivery from the {EE_PREORDER.deliveryLabel}. Choose Classic or
            Signature and build your five.
          </p>
          <div className="ee-hero-actions" style={{ justifyContent: "center" }}>
            <Link href="/executive-edit/checkout?package=classic" className="btn-hp-dark">
              Choose Classic
            </Link>
            <Link href="/executive-edit/checkout?package=signature" className="btn-hp-outline">
              Choose Signature
            </Link>
          </div>
          <p className="ee-hero-meta">Delivery included · Pay securely with Paystack</p>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
