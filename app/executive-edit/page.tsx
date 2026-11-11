import Image from "next/image";
import Link from "next/link";
import {
  EE_FAQS,
  EE_HERO_IMAGE,
  EE_HERO_IMAGE_MOBILE,
  EE_PACKAGES,
  EE_PREORDER,
  EE_STRAIGHT_STYLES,
} from "@/lib/executive-edit/constants";
import "./executive-edit.css";
import "@/app/storefront.css";

export const metadata = {
  title: "Curated Collection Pre-Order | GetPanted",
  description:
    "A curated collection of five trousers for women who dress with intention. Pre-order open 1–15 November 2026.",
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
    body: "Five pieces that mix and match so you get more outfits than pairs in the collection.",
  },
  {
    title: "Curation",
    body: "You choose the colours and sizes. We handle the editing so your wardrobe feels intentional, not accidental.",
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
      <section className="ee-hero-bleed" id="top" aria-label="GetPanted curated collection">
        <div className="ee-hero-media ee-hero-media-desktop">
          <Image
            src={EE_HERO_IMAGE}
            alt="GetPanted curated collection"
            fill
            priority
            className="ee-hero-bleed-img object-cover"
            sizes="100vw"
          />
        </div>
        <div className="ee-hero-media ee-hero-media-mobile">
          <Image
            src={EE_HERO_IMAGE_MOBILE}
            alt="GetPanted curated collection"
            fill
            priority
            className="ee-hero-bleed-img object-cover"
            sizes="100vw"
          />
        </div>
        <div className="ee-hero-veil ee-hero-veil-subtle" aria-hidden />
        <div className="ee-hero-copy ee-hero-copy-headlines ee-reveal">
          <p className="ee-brand">GetPanted</p>
          <h1 className="ee-h1 ee-h1-on-dark">Five trousers. One intentional wardrobe.</h1>
          <div className="ee-hero-cta">
            <a href="#boxes" className="ee-btn-hero">
              Order Now
            </a>
          </div>
        </div>
      </section>

      <section className="ee-section ee-section-idea" id="idea">
        <div className="ee-wrap ee-split">
          <div className="ee-reveal">
            <p className="ee-eyebrow">The idea</p>
            <h2 className="ee-h2">Your wardrobe deserves more intention.</h2>
          </div>
          <div className="ee-reveal ee-reveal-delay">
            <p className="ee-body ee-body-lg">
              Most workwear shopping ends in one more pair that almost works. This curated
              collection is different: five trousers chosen by you, styled as a set, so getting
              dressed for work feels simpler — and sharper.
            </p>
            <p className="ee-body" style={{ marginTop: "1.25rem" }}>
              Pre-order locks your selections into our November production run. You pay in full now;
              we deliver from the {EE_PREORDER.deliveryLabel}.
            </p>
          </div>
        </div>
      </section>

      <section className="ee-section ee-section-boxes" id="boxes">
        <div className="ee-wrap">
          <div className="ee-section-head ee-reveal">
            <p className="ee-eyebrow">Choose your collection</p>
            <h2 className="ee-h2">Classic or Signature</h2>
            <p className="ee-lead">
              Both collections include five pieces, your size for each, a styling guide, and
              delivery.
            </p>
          </div>
          <div className="ee-packages">
            {Object.values(EE_PACKAGES).map((pkg, i) => (
              <article
                key={pkg.id}
                className={`ee-package ee-reveal${i === 1 ? " ee-package-featured" : ""}`}
                style={{ animationDelay: `${0.08 + i * 0.08}s` }}
              >
                <div className="ee-package-top">
                  <p className="ee-eyebrow" style={{ marginBottom: 0 }}>
                    {pkg.shortName}
                  </p>
                  {i === 1 && <span className="ee-package-tag">Most range</span>}
                </div>
                <p className="ee-package-price">{pkg.priceLabel}</p>
                <p className="ee-body" style={{ marginBottom: "1.25rem", fontSize: "0.95rem" }}>
                  {pkg.description}
                </p>
                <ul>
                  {pkg.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link
                  href={`/executive-edit/checkout?package=${pkg.id}`}
                  className={i === 1 ? "ee-btn-primary" : "ee-btn-secondary"}
                >
                  {pkg.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ee-section ee-section-pillars" id="different">
        <div className="ee-wrap">
          <div className="ee-section-head ee-reveal">
            <p className="ee-eyebrow">What makes this different</p>
            <h2 className="ee-h2">Built for how you actually dress</h2>
          </div>
          <div className="ee-pillars">
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                className="ee-pillar ee-reveal"
                style={{ animationDelay: `${0.06 + i * 0.07}s` }}
              >
                <span className="ee-pillar-index">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p className="ee-body" style={{ fontSize: "0.95rem" }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ee-section ee-section-gallery" id="gallery">
        <div className="ee-wrap">
          <div className="ee-section-head ee-reveal">
            <p className="ee-eyebrow">See the possibilities</p>
            <h2 className="ee-h2">Straight Pants colourways</h2>
            <p className="ee-lead">
              Classic is five from these colourways. Signature starts here and expands as new
              silhouettes launch.
            </p>
          </div>
          <div className="ee-gallery">
            {EE_STRAIGHT_STYLES.map((style, i) => (
              <figure
                key={style.slug}
                className="ee-gallery-item ee-reveal"
                style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              >
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

      <section className="ee-section ee-section-faq" id="faq">
        <div className="ee-wrap ee-faq-wrap">
          <div className="ee-section-head ee-reveal">
            <p className="ee-eyebrow">FAQs</p>
            <h2 className="ee-h2">Before you order</h2>
          </div>
          <div className="ee-faq ee-reveal ee-reveal-delay">
            {EE_FAQS.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ee-section ee-final" id="cta">
        <div className="ee-final-glow" aria-hidden />
        <div className="ee-wrap ee-final-inner ee-reveal">
          <p className="ee-eyebrow ee-eyebrow-on-dark">Pre-order closes 15 November 2026</p>
          <p className="ee-brand ee-brand-sm">GetPanted</p>
          <h2 className="ee-h2 ee-h2-on-dark">Secure your curated collection</h2>
          <p className="ee-lead ee-lead-on-dark" style={{ marginTop: "1rem" }}>
            Full payment now. Delivery from the {EE_PREORDER.deliveryLabel}. Choose Classic or
            Signature and build your five.
          </p>
          <div className="ee-hero-actions" style={{ justifyContent: "center" }}>
            <Link href="/executive-edit/checkout?package=classic" className="ee-btn-primary">
              Choose Classic
            </Link>
            <Link href="/executive-edit/checkout?package=signature" className="ee-btn-ghost">
              Choose Signature
            </Link>
          </div>
          <p className="ee-hero-meta ee-hero-meta-on-dark">
            Delivery included · Pay securely with Paystack
          </p>
        </div>
      </section>
    </main>
  );
}
