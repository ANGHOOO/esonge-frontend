import { create } from 'zustand';
import type { ProductFilters } from '@/components/product/FilterPanel';
import type { SortOption } from '@/components/product/SortDropdown';
import type { ViewMode } from '@/components/product/ViewToggle';

interface ProductFiltersState {
  filters: ProductFilters;
  sort: SortOption;
  viewMode: ViewMode;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;

  // Actions
  setFilters: (filters: ProductFilters) => void;
  setFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  clearFilters: () => void;
  setSort: (sort: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  resetAll: () => void;

  // Computed
  getActiveFiltersCount: () => number;
}

const initialFilters: ProductFilters = {
  categories: [],
  origins: [],
  grades: [],
  priceMin: null,
  priceMax: null,
  freeShippingOnly: false,
  inStockOnly: false,
};

export const useProductFilters = create<ProductFiltersState>((set, get) => ({
  filters: initialFilters,
  sort: 'newest',
  viewMode: 'grid',
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 12,

  setFilters: (filters) => set({ filters, currentPage: 1 }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      currentPage: 1,
    })),

  clearFilters: () => set({ filters: initialFilters, currentPage: 1 }),

  setSort: (sort) => set({ sort, currentPage: 1 }),

  setViewMode: (viewMode) => set({ viewMode }),

  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  resetAll: () =>
    set({
      filters: initialFilters,
      sort: 'newest',
      searchQuery: '',
      currentPage: 1,
    }),

  getActiveFiltersCount: () => {
    const { filters } = get();
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.origins.length > 0) count += filters.origins.length;
    if (filters.grades.length > 0) count += filters.grades.length;
    if (filters.priceMin !== null || filters.priceMax !== null) count += 1;
    if (filters.freeShippingOnly) count += 1;
    if (filters.inStockOnly) count += 1;
    return count;
  },
}));
