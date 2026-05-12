"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "../context/shop-context";

const NAV_LINKS = [
  { label: "About",        href: "/about" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Collections",  href: "/collections" },
  { label: "Bespoke",      href: "/bespoke" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, wishlistCount, openMiniCart } = useShop();
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #F0F0F0",
          height: "56px",
        }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-full" style={{ padding: "0 48px" }}>

          {/* Logo */}
          <Link
            href="/"
            className="font-playfair font-bold tracking-[0.18em] uppercase"
            style={{ fontSize: "20px", fontWeight: 700 }}
          >
            <span style={{ color: "#1A1A1A" }}>Get</span>
            <span style={{ color: "#5C2D8F" }}>Panted</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex gap-8 list-none">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="font-barlow-cond font-bold uppercase transition-colors duration-200"
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    color: pathname === item.href ? "#5C2D8F" : "#6B6B6B",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#5C2D8F")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = pathname === item.href ? "#5C2D8F" : "#6B6B6B")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <Link
              href="/collections"
              aria-label="Search products"
              className="transition-opacity duration-200 hover:opacity-60"
              style={{ color: "#1A1A1A" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative transition-opacity duration-200 hover:opacity-60"
              style={{ color: "#1A1A1A" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 text-white text-[9px] font-medium flex items-center justify-center"
                  style={{ background: "#5C2D8F" }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              type="button"
              aria-label="Cart"
              onClick={openMiniCart}
              className="relative transition-opacity duration-200 hover:opacity-60"
              style={{ color: "#1A1A1A" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 text-white text-[9px] font-medium flex items-center justify-center"
                  style={{ background: "#5C2D8F" }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 transition-opacity duration-200 hover:opacity-60"
              style={{ color: "#1A1A1A" }}
            >
              <span
                className="block h-px w-5 bg-current transition-all duration-300 origin-center"
                style={{ transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none" }}
              />
              <span
                className="block h-px w-5 bg-current transition-all duration-300"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="block h-px w-5 bg-current transition-all duration-300 origin-center"
                style={{ transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute top-0 right-0 h-full flex flex-col pt-16 px-8 pb-10"
            style={{
              width: "min(80vw, 300px)",
              background: "#FFFFFF",
              borderLeft: "1px solid #F0F0F0",
            }}
          >
            <nav>
              <ul className="space-y-1 list-none">
                {NAV_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="block py-3 font-barlow-cond font-bold uppercase transition-colors duration-200"
                      style={{
                        fontSize: "13px",
                        letterSpacing: "0.12em",
                        borderBottom: "1px solid #F0F0F0",
                        color: pathname === item.href ? "#5C2D8F" : "#6B6B6B",
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto">
              <Link
                href="/collections"
                className="block w-full text-center text-white font-barlow-cond font-bold text-[11px] tracking-[0.16em] uppercase py-3 transition-opacity duration-200 hover:opacity-80"
                style={{ background: "#5C2D8F" }}
              >
                Shop Now
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
