import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/mocks/products';

const CART_STORAGE_KEY = 'cart';
const FREE_SHIPPING_THRESHOLD = 50000;
const DEFAULT_SHIPPING_FEE = 3000;

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

interface CartState {
  items: CartItem[];

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getShippingFee: () => number;
  getFinalPrice: () => number;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.product.id === product.id);

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            const currentQuantity = newItems[existingIndex].quantity;
            const newQuantity = Math.min(currentQuantity + quantity, product.stock);
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newQuantity,
            };
            return { items: newItems };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: Math.min(quantity, product.stock),
                addedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const newItems = state.items.map((item) => {
            if (item.product.id === productId) {
              const validQuantity = Math.max(1, Math.min(quantity, item.product.stock));
              return { ...item, quantity: validQuantity };
            }
            return item;
          });
          return { items: newItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getShippingFee: () => {
        const { items } = get();
        if (items.length === 0) return 0;

        const hasFreeShippingItem = items.some((item) => item.product.freeShipping);
        const totalPrice = get().getTotalPrice();

        if (hasFreeShippingItem || totalPrice >= FREE_SHIPPING_THRESHOLD) {
          return 0;
        }
        return DEFAULT_SHIPPING_FEE;
      },

      getFinalPrice: () => {
        return get().getTotalPrice() + get().getShippingFee();
      },

      isInCart: (productId) => {
        return get().items.some((item) => item.product.id === productId);
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((item) => item.product.id === productId);
        return item?.quantity ?? 0;
      },
    }),
    {
      name: CART_STORAGE_KEY,
    }
  )
);
