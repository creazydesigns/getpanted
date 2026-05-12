"use client";

import Link from "next/link";
import { useShop } from "../context/shop-context";
import { PageFooter } from "../components/page-footer";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, addToCart } = useShop();

  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 pt-28 pb-10" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1100px] mx-auto flex items-end justify-between gap-4">
          <div>
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Saved Pieces</p>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A" }}>
              Your Wishlist {wishlistItems.length > 0 && <span style={{ color: "#6B6B6B" }}>({wishlistItems.length})</span>}
            </h1>
          </div>
          <Link
            href="/collections"
            className="font-barlow-cond font-bold uppercase transition-colors hover:text-[#5C2D8F]"
            style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#6B6B6B" }}
          >
            Browse Collections
          </Link>
        </div>
      </section>

      <div className="px-5 md:px-12 py-14" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1100px] mx-auto">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-24" style={{ borderTop: "1px solid #F0F0F0" }}>
              <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "20px", color: "#6B6B6B" }}>No saved items yet</p>
              <p className="font-barlow mb-8" style={{ fontSize: "14px", color: "#6B6B6B" }}>Browse collections and heart the pieces you love.</p>
              <Link
                href="/collections"
                className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80"
                style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "14px 40px", background: "#5C2D8F" }}
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            <div>
              <div style={{ border: "1px solid #F0F0F0" }}>
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                    style={{ padding: "20px 24px", borderBottom: "1px solid #F0F0F0" }}
                  >
                    <div className="flex-1">
                      <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "14px", color: "#1A1A1A" }}>{item.name}</p>
                      <p className="font-barlow mt-1" style={{ fontSize: "13px", color: "#6B6B6B" }}>{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })}
                        className="font-barlow-cond font-bold uppercase text-white transition-opacity hover:opacity-80"
                        style={{ fontSize: "11px", letterSpacing: "0.14em", padding: "10px 24px", background: "#5C2D8F" }}
                      >
                        Add to Bag
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist({ id: item.id, name: item.name, price: item.price, image: item.image })}
                        className="font-barlow-cond font-bold uppercase transition-colors hover:text-[#1A1A1A]"
                        style={{ fontSize: "10px", letterSpacing: "0.14em", color: "#6B6B6B" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={() => wishlistItems.forEach((item) => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }))}
                  className="font-barlow-cond font-bold uppercase text-white transition-opacity hover:opacity-80"
                  style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "14px 40px", background: "#5C2D8F" }}
                >
                  Add All to Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PageFooter />
    </main>
  );
}
