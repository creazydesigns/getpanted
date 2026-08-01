"use client";

import Image from "next/image";
import Link from "next/link";
import { useShop } from "../context/shop-context";
import { PageFooter } from "../components/page-footer";
import { StorefrontHeader } from "../components/storefront-header";
import "../storefront.css";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, addToCart } = useShop();

  return (
    <main className="hp-page font-barlow overflow-x-hidden" style={{ minHeight: "100vh" }}>
      <StorefrontHeader
        eyebrow="Saved Pieces"
        title={
          <>
            Your Wishlist{" "}
            {wishlistItems.length > 0 && (
              <span style={{ color: "var(--hp-muted)" }}>({wishlistItems.length})</span>
            )}
          </>
        }
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Wishlist" },
        ]}
        actions={
          <Link
            href="/collections"
            className="font-barlow-cond font-bold uppercase transition-colors hover:text-[var(--hp-accent)]"
            style={{ fontSize: "11px", letterSpacing: "0.14em", color: "var(--hp-muted)" }}
          >
            Browse Collections
          </Link>
        }
      />

      <section className="hp-section py-14 md:py-16">
        <div className="max-w-[1400px] mx-auto">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-24" style={{ borderTop: "1px solid var(--hp-border)" }}>
              <p
                className="font-barlow-cond font-bold uppercase mb-4"
                style={{ fontSize: "20px", color: "var(--hp-muted)" }}
              >
                No saved items yet
              </p>
              <p className="hp-body mb-8">Browse collections and heart the pieces you love.</p>
              <Link href="/collections" className="btn-hp-primary">
                Browse Collections
              </Link>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="group">
                    <div className="hp-product-media mb-0">
                      <Link
                        href={`/products/${item.id}`}
                        className="absolute inset-0 z-[1]"
                        aria-label={`View ${item.name}`}
                      />
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover object-top pointer-events-none"
                        />
                      ) : (
                        <div className="hp-placeholder absolute inset-0 pointer-events-none">
                          Product
                        </div>
                      )}
                    </div>
                    <div className="pt-4 pb-2">
                      <Link href={`/products/${item.id}`} className="block">
                        <p
                          className="font-barlow-cond font-bold uppercase"
                          style={{ fontSize: "14px", letterSpacing: "0.06em", color: "var(--hp-ink)" }}
                        >
                          {item.name}
                        </p>
                        <p className="font-barlow mt-2" style={{ fontSize: "14px", color: "var(--hp-ink)" }}>
                          {item.price}
                        </p>
                      </Link>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() =>
                            addToCart({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                            })
                          }
                          className="btn-hp-primary"
                          style={{ padding: "10px 18px", fontSize: "11px" }}
                        >
                          Add to Bag
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleWishlist({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                            })
                          }
                          className="font-barlow-cond font-bold uppercase transition-colors hover:text-[var(--hp-ink)]"
                          style={{ fontSize: "10px", letterSpacing: "0.14em", color: "var(--hp-muted)" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-10">
                <button
                  type="button"
                  onClick={() =>
                    wishlistItems.forEach((item) =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    )
                  }
                  className="btn-hp-dark"
                >
                  Add All to Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
