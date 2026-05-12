import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;           // product id (uuid or numeric string)
  name: string;
  price: string;        // formatted e.g. "₦45,000"
  priceRaw: number;     // numeric e.g. 45000
  size: string;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  // Actions
  openCart:  () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem:    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart:  () => void;
  // Computed helpers (as getters via selectors)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (newItem) => {
        const qty = newItem.quantity ?? 1;
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === newItem.id && i.size === newItem.size
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id && i.size === newItem.size
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: qty }] };
        });
      },

      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.size === size)),
        })),

      updateQuantity: (id, size, quantity) => {
        if (quantity < 1) {
          get().removeItem(id, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.size === size ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "gp-cart",
    }
  )
);

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectCartCount    = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
export const selectCartSubtotal = (s: CartState) => s.items.reduce((t, i) => t + i.priceRaw * i.quantity, 0);
