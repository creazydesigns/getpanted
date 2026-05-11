"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { useShop } from "../context/shop-context";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Collections", href: "/collections" },
  { label: "Bespoke", href: "/bespoke" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, wishlistCount, openMiniCart } = useShop();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--gp-header)] backdrop-blur-md border-b border-[rgb(var(--gp-fg-rgb) / 0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-cormorant text-2xl font-light tracking-[0.18em] uppercase text-[var(--gp-fg)]">
            Get<span className="text-[var(--gp-accent)]">Panted</span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex gap-8 list-none">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`text-[11px] tracking-[0.14em] uppercase transition-colors duration-200 ${
                    pathname === item.href
                      ? "text-[var(--gp-accent)]"
                      : "text-[rgb(var(--gp-fg-rgb) / 0.55)] hover:text-[var(--gp-accent)]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <ThemeToggle />
            <Link href="/collections" aria-label="Search products" className="text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 bg-[var(--gp-accent)] rounded-full text-[var(--gp-accent-ink)] text-[9px] font-medium flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Cart"
              onClick={openMiniCart}
              className="relative text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 bg-[var(--gp-accent)] rounded-full text-[var(--gp-accent-ink)] text-[9px] font-medium flex items-center justify-center">
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
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 text-[rgb(var(--gp-fg-rgb) / 0.7)] hover:text-[var(--gp-accent)] transition-colors"
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
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute top-0 right-0 h-full w-[min(80vw,320px)] bg-[var(--gp-canvas)] border-l border-[rgb(var(--gp-fg-rgb) / 0.1)] flex flex-col pt-20 px-8 pb-10">
            <nav>
              <ul className="space-y-1 list-none">
                {NAV_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`block py-3 text-[13px] tracking-[0.14em] uppercase border-b border-[rgb(var(--gp-fg-rgb) / 0.06)] transition-colors duration-200 ${
                        pathname === item.href
                          ? "text-[var(--gp-accent)]"
                          : "text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)]"
                      }`}
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
                className="block w-full text-center bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] py-3 text-[11px] font-medium tracking-[0.16em] uppercase hover:bg-[var(--gp-accent-hover)] transition-colors"
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
