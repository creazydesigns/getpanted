"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface ShopProduct {
  id: number;
  name: string;
  price: string;
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

const CART_STORAGE_KEY = "getpanted_cart_v1";
const WISHLIST_STORAGE_KEY = "getpanted_wishlist_v1";
const ORDERS_STORAGE_KEY = "getpanted_orders_v1";

function parsePriceToNumber(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  return Number(digits || 0);
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<ShopProduct[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  const showToast = (text: string) => {
    const toastId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id: toastId, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    }, 2600);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
      const rawWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      const rawOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);

      if (rawCart) {
        setCartItems(JSON.parse(rawCart) as CartItem[]);
      }

      if (rawWishlist) {
        setWishlistItems(JSON.parse(rawWishlist) as ShopProduct[]);
      }

      if (rawOrders) {
        setOrders(JSON.parse(rawOrders) as OrderRecord[]);
      }
    } catch {
      // Ignore corrupted localStorage payloads and keep defaults.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: ShopProduct, quantity = 1) => {
    showToast(`${product.name} added to cart`);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === product.size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id: number, size?: string) => {
    setCartItems((prev) => {
      const removed = prev.find((item) => item.id === id && item.size === size);
      if (removed) {
        showToast(`${removed.name} removed from cart`);
      }
      return prev.filter((item) => !(item.id === id && item.size === size));
    });
  };

  const updateCartQuantity = (id: number, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const isWishlisted = (id: number) => wishlistItems.some((item) => item.id === id);

  const toggleWishlist = (product: ShopProduct) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        showToast(`${product.name} removed from wishlist`);
        return prev.filter((item) => item.id !== product.id);
      }
      showToast(`${product.name} added to wishlist`);
      return [...prev, product];
    });
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const openMiniCart = () => setMiniCartOpen(true);
  const closeMiniCart = () => setMiniCartOpen(false);

  const placeOrder = (customer: CheckoutDetails): OrderRecord => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + parsePriceToNumber(item.price) * item.quantity,
      0
    );
    const shipping = subtotal > 0 ? 3500 : 0;
    const total = subtotal + shipping;
    const order: OrderRecord = {
      id: `GP-${Date.now().toString().slice(-8)}`,
      items: cartItems,
      subtotal,
      shipping,
      total,
      customer,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
    setMiniCartOpen(false);
    showToast(`Order ${order.id} placed successfully`);
    return order;
  };

  const value = useMemo<ShopContextValue>(() => {
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = wishlistItems.length;
    const cartSubtotal = cartItems.reduce(
      (sum, item) => sum + parsePriceToNumber(item.price) * item.quantity,
      0
    );

    return {
      cartItems,
      wishlistItems,
      orders,
      toasts,
      miniCartOpen,
      cartCount,
      wishlistCount,
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
    };
  }, [cartItems, wishlistItems, orders, toasts, miniCartOpen]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return ctx;
}
