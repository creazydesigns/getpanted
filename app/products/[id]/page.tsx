"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useShop } from "@/app/context/shop-context";
import { PageFooter } from "@/app/components/page-footer";
import { Navbar } from "@/app/components/navbar";

// ── Shared product catalog (matches collections page & DB seed) ────────────────
const CATALOG = [
  { id: "1",  name: "Royal Pleat",       price: "₦45,000", priceRaw: 45000, image: "/images/gp-royal-pleat.png",       category: "solid", badge: "Bestseller", sizes: ["XS","S","M","L","XL","2XL"],      colors: ["#6B2D8B"],  description: "A regal silhouette with deep front pleats and a wide-leg cut. Crafted from premium suiting fabric for an authoritative presence." },
  { id: "2",  name: "Onyx Statement",    price: "₦38,000", priceRaw: 38000, image: "/images/gp-onyx-statement.png",    category: "solid", badge: "New",        sizes: ["XS","S","M","L","XL","2XL","3XL"], colors: ["#1a1a1a"],  description: "Polished and powerful. The Onyx Statement is a solid black trouser designed to command every room you walk into." },
  { id: "3",  name: "Ivory Sovereign",   price: "₦42,000", priceRaw: 42000, image: "/images/gp-ivory-sovereign.png",   category: "solid", badge: "New",        sizes: ["S","M","L","XL"],                  colors: ["#E8E8E8"],  description: "Clean ivory tones meet architectural tailoring. A piece for those who understand that restraint is its own form of power." },
  { id: "4",  name: "Sahara Wide",       price: "₦36,000", priceRaw: 36000, image: "/images/gp-sahara-wide.png",       category: "solid", badge: "New",        sizes: ["XS","S","M","L","XL","2XL"],       colors: ["#c4a882"],  description: "Earth-toned and effortlessly wide. The Sahara draws from the desert's palette for a grounded, confident stance." },
  { id: "5",  name: "Petal Pleat",       price: "₦40,000", priceRaw: 40000, image: "/images/gp-petal-pleat.png",       category: "solid", badge: "New",        sizes: ["XS","S","M","L","XL","2XL"],       colors: ["#f4a7b9"],  description: "Soft pleats in a delicate blush. The Petal brings femininity to power dressing without compromise." },
  { id: "6",  name: "Eden Wide",         price: "₦40,000", priceRaw: 40000, image: "/images/gp-eden-wide.png",         category: "solid", badge: "New",        sizes: ["S","M","L","XL","2XL"],            colors: ["#4CAF50"],  description: "A lush, botanical green in a generous wide-leg cut. Dress the power of nature." },
  { id: "7",  name: "Solar Statement",   price: "₦38,000", priceRaw: 38000, image: "/images/gp-solar-statement.png",   category: "solid", badge: "New",        sizes: ["XS","S","M","L","XL"],             colors: ["#FFC107"],  description: "Bold amber meets structured tailoring. Wear the sun." },
  { id: "8",  name: "Nude Palazzo",      price: "₦44,000", priceRaw: 44000, image: "/images/gp-nude-palazzo.png",      category: "solid",                      sizes: ["S","M","L","XL","2XL"],            colors: ["#d4b896"],  description: "The ultimate understated power. Wide palazzo legs in a nude tone that pairs with everything." },
  { id: "9",  name: "Cacao Wide",        price: "₦44,000", priceRaw: 44000, image: "/images/gp-cacao-wide.png",        category: "solid",                      sizes: ["XS","S","M","L","XL"],             colors: ["#3E1C0D"],  description: "Deep cacao brown in a wide silhouette. Rich, grounded, and undeniably powerful." },
  { id: "10", name: "Blush Ultra Wide",  price: "₦41,000", priceRaw: 41000, image: "/images/gp-blush-ultra-wide.png",  category: "solid", badge: "New",        sizes: ["XS","S","M","L","XL","2XL"],       colors: ["#f2b8c6"],  description: "An ultra-wide silhouette in a soft blush. Maximum volume, maximum intention." },
  { id: "11", name: "Lemon Luxe",        price: "₦39,000", priceRaw: 39000, image: "/images/gp-lemon-luxe.png",        category: "solid", badge: "New",        sizes: ["S","M","L","XL","2XL"],            colors: ["#f5e642"],  description: "Sunshine yellow tailored for confidence. The Lemon Luxe is summer power dressing." },
  { id: "12", name: "Peach Sovereign",   price: "₦43,000", priceRaw: 43000, image: "/images/gp-peach-sovereign.png",   category: "solid", badge: "New",        sizes: ["XS","S","M","L","XL"],             colors: ["#f4a07a"],  description: "Warm peach tones elevated into a sovereign silhouette. Regal from every angle." },
];

export default function ProductDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const id       = Array.isArray(params.id) ? params.id[0] : params.id;
  const product  = CATALOG.find((p) => p.id === id);

  const [selectedSize,  setSelectedSize]  = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity,      setQuantity]      = useState(1);
  const [added,         setAdded]         = useState(false);

  const { addItem, openCart } = useCartStore();
  const { isWishlisted, toggleWishlist } = useShop();

  // Suggested products from same category
  const suggested = product
    ? CATALOG.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
    : [];

  useEffect(() => {
    if (product && product.colors.length > 0) setSelectedColor(product.colors[0]);
    if (product && product.sizes.length > 0)  setSelectedSize(product.sizes[2] ?? product.sizes[0]);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#FFFFFF" }}>
        <Navbar />
        <p className="font-barlow-cond font-bold uppercase text-[#6B6B6B] mt-24" style={{ letterSpacing: "0.12em" }}>
          Product not found.
        </p>
        <Link href="/collections" className="mt-6 font-barlow-cond font-bold uppercase text-white text-[12px] tracking-[0.14em] px-8 py-3 transition-opacity hover:opacity-80" style={{ background: "#5C2D8F" }}>
          Browse Collections
        </Link>
      </div>
    );
  }

  const wishlisted  = isWishlisted(Number(product.id));

  const handleAddToBag = () => {
    if (!selectedSize) return;
    addItem({
      id:       product.id,
      name:     product.name,
      price:    product.price,
      priceRaw: product.priceRaw,
      size:     selectedSize,
      image:    product.image,
      quantity,
    });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    toggleWishlist({ id: Number(product.id), name: product.name, price: product.price, image: product.image, size: selectedSize ?? undefined });
  };

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto" style={{ padding: "80px 48px 0", paddingTop: "80px" }}>
        <nav className="font-barlow text-[12px] mb-10" style={{ color: "#6B6B6B", letterSpacing: "0.06em" }}>
          <Link href="/" className="hover:text-[#5C2D8F] transition-colors">Home</Link>
          <span className="mx-2">·</span>
          <Link href="/collections" className="hover:text-[#5C2D8F] transition-colors">Collections</Link>
          <span className="mx-2">·</span>
          <span style={{ color: "#1A1A1A" }}>{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-24">
          {/* Image */}
          <div className="relative" style={{ aspectRatio: "3/4", background: "#F7F7F7" }}>
            {product.badge && (
              <span
                className="absolute top-4 left-4 z-10 font-barlow-cond font-bold uppercase"
                style={{ fontSize: "10px", letterSpacing: "0.16em", padding: "4px 10px", background: "#5C2D8F", color: "#FFFFFF" }}
              >
                {product.badge}
              </span>
            )}
            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1
              className="font-barlow-cond font-bold uppercase mb-2"
              style={{ fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.01em", color: "#1A1A1A", lineHeight: 1 }}
            >
              {product.name}
            </h1>

            <p
              className="font-barlow-cond font-bold mb-8"
              style={{ fontSize: "22px", color: "#5C2D8F" }}
            >
              {product.price}
            </p>

            <p className="font-barlow mb-8" style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.7 }}>
              {product.description}
            </p>

            {/* Color swatches */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#6B6B6B" }}>
                  Colour
                </p>
                <div className="flex gap-2">
                  {product.colors.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setSelectedColor(hex)}
                      title={hex}
                      style={{
                        width: "28px",
                        height: "28px",
                        background: hex,
                        border: selectedColor === hex ? "2px solid #5C2D8F" : "2px solid transparent",
                        outline: selectedColor === hex ? "1px solid #5C2D8F" : "1px solid #E0E0E0",
                        outlineOffset: "2px",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#6B6B6B" }}>
                  Size
                </p>
                <button type="button" className="font-barlow text-[11px] underline transition-colors hover:text-[#5C2D8F]" style={{ color: "#6B6B6B" }}>
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className="font-barlow-cond font-bold uppercase transition-all"
                    style={{
                      fontSize: "12px",
                      letterSpacing: "0.1em",
                      padding: "8px 14px",
                      border: selectedSize === size ? "1.5px solid #5C2D8F" : "1.5px solid #E0E0E0",
                      color: selectedSize === size ? "#5C2D8F" : "#6B6B6B",
                      background: "#FFFFFF",
                      cursor: "pointer",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="font-barlow mt-2 text-[12px]" style={{ color: "#E53935" }}>Please select a size</p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#6B6B6B" }}>
                Quantity
              </p>
              <div className="flex items-center gap-0" style={{ border: "1.5px solid #E0E0E0", width: "fit-content" }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex items-center justify-center transition-colors hover:bg-[#F7F7F7]"
                  style={{ width: "40px", height: "40px", color: "#1A1A1A", fontSize: "18px", borderRight: "1.5px solid #E0E0E0" }}
                >
                  −
                </button>
                <span className="font-barlow-cond font-bold text-center" style={{ width: "48px", fontSize: "14px", color: "#1A1A1A" }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex items-center justify-center transition-colors hover:bg-[#F7F7F7]"
                  style={{ width: "40px", height: "40px", color: "#1A1A1A", fontSize: "18px", borderLeft: "1.5px solid #E0E0E0" }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToBag}
                disabled={!selectedSize}
                className="flex-1 font-barlow-cond font-bold uppercase text-white transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{ fontSize: "13px", letterSpacing: "0.14em", padding: "16px 24px", background: added ? "#3D1E63" : "#5C2D8F", cursor: selectedSize ? "pointer" : "not-allowed" }}
              >
                {added ? "Added to Bag ✓" : "Add to Bag"}
              </button>
              <button
                type="button"
                onClick={handleWishlist}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className="flex items-center justify-center transition-all hover:border-[#5C2D8F]"
                style={{ width: "52px", border: `1.5px solid ${wishlisted ? "#5C2D8F" : "#E0E0E0"}`, color: wishlisted ? "#5C2D8F" : "#1A1A1A" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Delivery info */}
            <div className="mt-8 pt-8" style={{ borderTop: "1px solid #F0F0F0" }}>
              <div className="flex items-center gap-3 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C2D8F" strokeWidth="1.5">
                  <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span className="font-barlow text-[13px]" style={{ color: "#6B6B6B" }}>Free delivery on orders above ₦50,000</span>
              </div>
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5C2D8F" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span className="font-barlow text-[13px]" style={{ color: "#6B6B6B" }}>Delivery in 5–7 business days</span>
              </div>
            </div>
          </div>
        </div>

        {/* You may also like */}
        {suggested.length > 0 && (
          <section className="mb-24">
            <h2
              className="font-barlow-cond font-bold uppercase mb-10"
              style={{ fontSize: "20px", letterSpacing: "-0.01em", color: "#1A1A1A" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {suggested.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-3" style={{ aspectRatio: "3/4", background: "#F7F7F7" }}>
                    {p.badge && (
                      <span
                        className="absolute top-3 left-3 z-10 font-barlow-cond font-bold uppercase"
                        style={{ fontSize: "9px", letterSpacing: "0.14em", padding: "3px 8px", background: "#5C2D8F", color: "#FFFFFF" }}
                      >
                        {p.badge}
                      </span>
                    )}
                    <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                  <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "13px", color: "#1A1A1A", letterSpacing: "0.05em" }}>{p.name}</p>
                  <p className="font-barlow-cond font-bold" style={{ fontSize: "13px", color: "#5C2D8F" }}>{p.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <PageFooter />
    </div>
  );
}
