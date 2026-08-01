"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useShop } from "@/app/context/shop-context";
import { useProduct, useProducts } from "@/hooks/use-products";
import { PageFooter } from "@/app/components/page-footer";
import { ProductCard } from "@/app/components/product-card";
import "@/app/storefront.css";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { product, loading } = useProduct(id);
  const { products } = useProducts();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { isWishlisted, toggleWishlist } = useShop();

  const suggested = product
    ? products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
    : [];

  useEffect(() => {
    if (product && product.colors.length > 0) setSelectedColor(product.colors[0]);
    if (product && product.sizes.length > 0) setSelectedSize(product.sizes[2] ?? product.sizes[0]);
  }, [product]);

  if (loading) {
    return (
      <div className="hp-page font-barlow min-h-screen flex items-center justify-center overflow-x-hidden">
        <p className="hp-body">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="hp-page font-barlow min-h-screen flex flex-col items-center justify-center overflow-x-hidden gap-6">
        <p className="hp-eyebrow">Product not found.</p>
        <Link href="/collections" className="btn-hp-primary">
          Browse Collections
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToBag = () => {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceRaw: product.priceRaw,
      size: selectedSize,
      image: product.image,
      quantity,
    });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize ?? undefined,
    });
  };

  return (
    <div className="hp-page font-barlow overflow-x-hidden min-h-screen">
      <section className="hp-section pt-10 md:pt-14 pb-0">
        <div className="max-w-[1400px] mx-auto">
          <nav className="hp-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/collections">Collections</Link>
            <span>/</span>
            <span style={{ color: "var(--hp-ink)" }}>{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-20 md:mb-28">
            {/* Gallery */}
            <div className="hp-product-media">
              {product.badge && (
                <span
                  className="absolute top-4 left-4 z-10 font-barlow-cond font-bold uppercase text-white px-2.5 py-1"
                  style={{ fontSize: "10px", letterSpacing: "0.16em", background: "var(--hp-accent)" }}
                >
                  {product.badge}
                </span>
              )}
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="hp-placeholder absolute inset-0">Product</div>
              )}
            </div>

            {/* Buy box */}
            <div className="flex flex-col justify-center">
              <p className="hp-eyebrow mb-3">{product.category || "GetPanted"}</p>
              <h1
                className="font-barlow-cond font-bold uppercase mb-3"
                style={{
                  fontSize: "clamp(28px, 4vw, 44px)",
                  letterSpacing: "-0.01em",
                  color: "var(--hp-ink)",
                  lineHeight: 1,
                }}
              >
                {product.name}
              </h1>

              <p
                className="font-barlow-cond font-bold mb-6"
                style={{ fontSize: "22px", color: "var(--hp-accent)" }}
              >
                {product.price}
              </p>

              <p className="hp-body mb-6">{product.description}</p>

              <div className="mb-8 p-5" style={{ background: "var(--hp-soft-2)", border: "1px solid var(--hp-border)" }}>
                <p className="hp-eyebrow mb-3" style={{ fontSize: "10px" }}>
                  Fit Note
                </p>
                <p className="hp-body-sm mb-4">
                  This piece is designed to sit comfortably at the waist and fall cleanly through the leg. Please check the{" "}
                  <Link href="/size-guide" className="underline hover:text-[var(--hp-accent)]">
                    GetPanted size guide
                  </Link>{" "}
                  before ordering.
                </p>
                <ul className="hp-body-sm space-y-1">
                  <li>• Comfortable waist and hip allowance</li>
                  <li>• Designed for movement</li>
                  <li>• Limited ready-to-wear pieces</li>
                  <li>• Made-to-order option may be available when sold out</li>
                </ul>
              </div>

              {product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="hp-label">Colour</p>
                  <div className="flex gap-2">
                    {product.colors.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setSelectedColor(hex)}
                        title={hex}
                        aria-label={`Colour ${hex}`}
                        style={{
                          width: "28px",
                          height: "28px",
                          background: hex,
                          border: selectedColor === hex ? "2px solid var(--hp-accent)" : "2px solid transparent",
                          outline: selectedColor === hex ? "1px solid var(--hp-accent)" : "1px solid var(--hp-border)",
                          outlineOffset: "2px",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="hp-label" style={{ marginBottom: 0 }}>
                    Size
                  </p>
                  <Link href="/size-guide" className="hp-body-sm underline hover:text-[var(--hp-accent)]">
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`hp-chip${selectedSize === size ? " is-active" : ""}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="font-barlow mt-2 text-[12px]" style={{ color: "#E53935" }}>
                    Please select a size
                  </p>
                )}
              </div>

              <div className="mb-8">
                <p className="hp-label">Quantity</p>
                <div
                  className="flex items-center gap-0"
                  style={{ border: "1px solid var(--hp-border)", width: "fit-content" }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex items-center justify-center transition-colors hover:bg-[var(--hp-soft-2)]"
                    style={{
                      width: "40px",
                      height: "40px",
                      color: "var(--hp-ink)",
                      fontSize: "18px",
                      borderRight: "1px solid var(--hp-border)",
                    }}
                  >
                    −
                  </button>
                  <span
                    className="font-barlow-cond font-bold text-center"
                    style={{ width: "48px", fontSize: "14px", color: "var(--hp-ink)" }}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex items-center justify-center transition-colors hover:bg-[var(--hp-soft-2)]"
                    style={{
                      width: "40px",
                      height: "40px",
                      color: "var(--hp-ink)",
                      fontSize: "18px",
                      borderLeft: "1px solid var(--hp-border)",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToBag}
                  disabled={!selectedSize}
                  className="btn-hp-primary flex-1 disabled:opacity-40"
                  style={{ cursor: selectedSize ? "pointer" : "not-allowed" }}
                >
                  {added ? "Added to Bag ✓" : "Add to Bag"}
                </button>
                <button
                  type="button"
                  onClick={handleWishlist}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className="flex items-center justify-center transition-all"
                  style={{
                    width: "52px",
                    border: `1px solid ${wishlisted ? "var(--hp-accent)" : "var(--hp-border)"}`,
                    color: wishlisted ? "var(--hp-accent)" : "var(--hp-ink)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={wishlisted ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              <div className="mt-8 pt-8" style={{ borderTop: "1px solid var(--hp-border)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hp-accent)" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" />
                    <path d="M16 8h4l3 5v3h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <span className="hp-body-sm">Delivery timeline confirmed at checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hp-accent)" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="hp-body-sm">
                    Sold out in your size?{" "}
                    <Link href="/made-to-order" className="underline hover:text-[var(--hp-accent)]">
                      Request made to order
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {suggested.length > 0 && (
            <section className="mb-20 md:mb-28">
              <p className="hp-eyebrow mb-3">More to Explore</p>
              <h2
                className="font-barlow-cond font-bold uppercase mb-10"
                style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "var(--hp-ink)", letterSpacing: "-0.01em" }}
              >
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {suggested.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
