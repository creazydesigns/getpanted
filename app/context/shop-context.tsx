"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useCartStore, selectCartCount, selectCartSubtotal } from "../../store/cartStore";
import type { CartItem as ZustandCartItem } from "../../store/cartStore";

// ── Legacy types (kept for backward-compat with existing components) ───────────
export interface ShopProduct {
  id: number;
  name: string;
  price: string;  // formatted e.g. "₦45,000"
  image?: string;
  size?: string;
}

export interface CartItem extends ShopProduct {
  quantity: number;
}

export interface CheckoutDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderRecord {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: CheckoutDetails;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  text: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function parsePriceToNumber(price: string): number {
  return Number(price.replace(/[^\d]/g, "") || 0);
}

function legacyToZustand(product: ShopProduct, quantity: number): ZustandCartItem {
  return {
    id: String(product.id),
    name: product.name,
    price: product.price,
    priceRaw: parsePriceToNumber(product.price),
    size: product.size ?? "",
    quantity,
    image: product.image,
  };
}

function zustandToLegacy(item: ZustandCartItem): CartItem {
  return {
    id: Number(item.id) || 0,
    name: item.name,
    price: item.price,
    image: item.image,
    size: item.size || undefined,
    quantity: item.quantity,
  };
}

// ── Context ────────────────────────────────────────────────────────────────────
interface ShopContextValue {
  cartItems: CartItem[];
  wishlistItems: ShopProduct[];
  orders: OrderRecord[];
  toasts: ToastMessage[];
  miniCartOpen: boolean;
  cartCount: number;
  wishlistCount: number;
  cartSubtotal: number;
  addToCart: (product: ShopProduct, quantity?: number) => void;
  removeFromCart: (id: number, size?: string) => void;
  updateCartQuantity: (id: number, quantity: number, size?: string) => void;
  clearCart: () => void;
  isWishlisted: (id: number) => boolean;
  toggleWishlist: (product: ShopProduct) => void;
  dismissToast: (id: string) => void;
  openMiniCart: () => void;
  closeMiniCart: () => void;
  placeOrder: (customer: CheckoutDetails) => OrderRecord;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const WISHLIST_STORAGE_KEY = "getpanted_wishlist_v1";
const ORDERS_STORAGE_KEY   = "getpanted_orders_v1";

export function ShopProvider({ children }: { children: React.ReactNode }) {
  // ── Zustand cart (source of truth for cart) ────────────────────────────────
  const zustandItems   = useCartStore((s) => s.items);
  const cartCount      = useCartStore(selectCartCount);
  const cartSubtotal   = useCartStore(selectCartSubtotal);
  const zustandAdd     = useCartStore((s) => s.addItem);
  const zustandRemove  = useCartStore((s) => s.removeItem);
  const zustandUpdate  = useCartStore((s) => s.updateQuantity);
  const zustandClear   = useCartStore((s) => s.clearCart);
  const miniCartOpen   = useCartStore((s) => s.isOpen);
  const openMiniCart   = useCartStore((s) => s.openCart);
  const closeMiniCart  = useCartStore((s) => s.closeCart);

  // ── Local state (wishlist, toasts, orders) ─────────────────────────────────
  const [wishlistItems, setWishlistItems] = useState<ShopProduct[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) ?? "[]"); }
    catch { return []; }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(window.localStorage.getItem(ORDERS_STORAGE_KEY) ?? "[]"); }
    catch { return []; }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600);
  };

  // ── Cart adapters ──────────────────────────────────────────────────────────
  const cartItems: CartItem[] = useMemo(() => zustandItems.map(zustandToLegacy), [zustandItems]);

  const addToCart = (product: ShopProduct, quantity = 1) => {
    zustandAdd(legacyToZustand(product, quantity));
    showToast(`${product.name} added to cart`);
  };

  const removeFromCart = (id: number, size?: string) => {
    const found = zustandItems.find((i) => i.id === String(id) && i.size === (size ?? ""));
    if (found) showToast(`${found.name} removed from cart`);
    zustandRemove(String(id), size ?? "");
  };

  const updateCartQuantity = (id: number, quantity: number, size?: string) => {
    zustandUpdate(String(id), size ?? "", quantity);
  };

  const clearCart = () => zustandClear();

  // ── Wishlist ───────────────────────────────────────────────────────────────
  const isWishlisted = (id: number) => wishlistItems.some((i) => i.id === id);

  const toggleWishlist = (product: ShopProduct) => {
    setWishlistItems((prev) => {
      if (prev.some((i) => i.id === product.id)) {
        showToast(`${product.name} removed from wishlist`);
        const next = prev.filter((i) => i.id !== product.id);
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
        return next;
      }
      showToast(`${product.name} added to wishlist`);
      const next = [...prev, product];
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // ── Toasts ─────────────────────────────────────────────────────────────────
  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // ── Place order (local, legacy) ────────────────────────────────────────────
  const placeOrder = (customer: CheckoutDetails): OrderRecord => {
    const subtotal = cartSubtotal;
    const shipping = subtotal > 50000 ? 0 : 3500;
    const total    = subtotal + shipping;
    const order: OrderRecord = {
      id: `GP-${Date.now().toString().slice(-8)}`,
      items: cartItems,
      subtotal,
      shipping,
      total,
      customer,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => {
      const next = [order, ...prev];
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    clearCart();
    closeMiniCart();
    showToast(`Order ${order.id} placed!`);
    return order;
  };

  const value = useMemo<ShopContextValue>(
    () => ({
      cartItems,
      wishlistItems,
      orders,
      toasts,
      miniCartOpen,
      cartCount,
      wishlistCount: wishlistItems.length,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      isWishlisted,
      toggleWishlist,
      dismissToast,
      openMiniCart,
      closeMiniCart,
      placeOrder,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartItems, wishlistItems, orders, toasts, miniCartOpen, cartCount, cartSubtotal]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
