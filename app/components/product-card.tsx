"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useShop } from "../context/shop-context";
import type { StoreProduct } from "@/lib/products/types";

const COLOR_FALLBACKS = ["#1A1A1A", "#5C2D8F", "#C4B5A0", "#E8E8E8"];

type ProductCardProps = {
  product: StoreProduct;
  /** Show hover size tray + add to bag (collections) */
  quickAdd?: boolean;
};

export function ProductCard({ product, quickAdd = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const wishlisted = isWishlisted(product.id);
  const productHref = `/products/${product.id}`;
  const swatches = (product.colors?.length ? product.colors : COLOR_FALLBACKS).slice(0, 4);

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="hp-product-media">
        <Link href={productHref} className="absolute inset-0 z-[1]" aria-label={`View ${product.name}`} />
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-top pointer-events-none"
          />
        ) : (
          <div className="hp-placeholder absolute inset-0 pointer-events-none">Product</div>
        )}

        {product.badge && (
          <span
            className="absolute top-3 left-3 z-[2] font-barlow-cond font-bold uppercase text-white px-2.5 py-1 pointer-events-none"
            style={{ fontSize: "10px", letterSpacing: "0.15em", background: "#1A1A1A" }}
          >
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label="Toggle wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            });
          }}
          className="absolute top-3 right-3 z-[2] w-8 h-8 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: "rgba(255,255,255,0.92)", color: wishlisted ? "#5C2D8F" : "#1A1A1A" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#5C2D8F" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {quickAdd && (
          <div
            className="absolute bottom-0 left-0 right-0 z-[2] px-4 py-4 transition-transform duration-300"
            style={{
              background: "rgba(10,10,10,0.94)",
              transform: hovered ? "translateY(0)" : "translateY(100%)",
              pointerEvents: hovered ? "auto" : "none",
            }}
          >
            <div className="flex gap-1.5 flex-wrap mb-3">
              {product.sizes.slice(0, 5).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(s === selectedSize ? null : s);
                  }}
                  className="font-barlow-cond font-bold uppercase px-2 py-1 transition-colors"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                    border: `1px solid ${selectedSize === s ? "#8B52CC" : "rgba(255,255,255,0.2)"}`,
                    color: selectedSize === s ? "#8B52CC" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  ...(selectedSize ? { size: selectedSize } : {}),
                });
              }}
              className="w-full font-barlow-cond font-bold uppercase text-white transition-opacity hover:opacity-80"
              style={{ fontSize: "11px", letterSpacing: "0.14em", padding: "10px", background: "#5C2D8F" }}
            >
              {selectedSize ? `Add ${selectedSize} to Bag` : "Add to Bag"}
            </button>
          </div>
        )}
      </div>

      <div className="pt-4 pb-2">
        <Link href={productHref} className="block">
          <p
            className="font-barlow-cond font-bold uppercase"
            style={{ fontSize: "14px", letterSpacing: "0.06em", color: "#1A1A1A" }}
          >
            {product.name}
          </p>
          <p className="hp-body-sm mt-1 line-clamp-1">
            {product.description || product.category || "Elevated trousers"}
          </p>
          <p className="font-barlow mt-2" style={{ fontSize: "14px", color: "#1A1A1A" }}>
            {product.price}
          </p>
        </Link>
        <div className="flex gap-1.5 mt-3">
          {swatches.map((c, i) => (
            <span
              key={`${product.id}-swatch-${i}`}
              className="hp-swatch"
              style={{ background: c.startsWith("#") ? c : COLOR_FALLBACKS[i % COLOR_FALLBACKS.length] }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
