import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const WISHLIST_STORAGE_KEY = 'wishlist';

interface WishlistState {
  productIds: string[];

  // Actions
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  clearWishlist: () => void;

  // Computed
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addItem: (productId) => {
        set((state) => {
          if (state.productIds.includes(productId)) {
            return state;
          }
          return { productIds: [...state.productIds, productId] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        }));
      },

      toggleItem: (productId) => {
        const { productIds } = get();
        if (productIds.includes(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },

      clearWishlist: () => {
        set({ productIds: [] });
      },

      isInWishlist: (productId) => {
        return get().productIds.includes(productId);
      },

      getTotalItems: () => {
        return get().productIds.length;
      },
    }),
    {
      name: WISHLIST_STORAGE_KEY,
    }
  )
);
