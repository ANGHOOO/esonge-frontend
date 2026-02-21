import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useProductFilters } from './useProductFilters';

describe('useProductFilters', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useProductFilters.getState().resetAll();
    });
  });

  describe('initial state', () => {
    it('should have default filter values', () => {
      const { filters } = useProductFilters.getState();
      expect(filters.categories).toEqual([]);
      expect(filters.origins).toEqual([]);
      expect(filters.grades).toEqual([]);
      expect(filters.priceMin).toBeNull();
      expect(filters.priceMax).toBeNull();
      expect(filters.freeShippingOnly).toBe(false);
      expect(filters.inStockOnly).toBe(false);
    });

    it('should have default sort and view mode', () => {
      const { sort, viewMode } = useProductFilters.getState();
      expect(sort).toBe('newest');
      expect(viewMode).toBe('grid');
    });

    it('should have default pagination', () => {
      const { currentPage, itemsPerPage } = useProductFilters.getState();
      expect(currentPage).toBe(1);
      expect(itemsPerPage).toBe(12);
    });
  });

  describe('setFilters', () => {
    it('should update all filters at once', () => {
      act(() => {
        useProductFilters.getState().setFilters({
          categories: ['premium-gift'],
          origins: ['국내산'],
          grades: ['특상'],
          priceMin: 10000,
          priceMax: 100000,
          freeShippingOnly: true,
          inStockOnly: true,
        });
      });

      const { filters } = useProductFilters.getState();
      expect(filters.categories).toEqual(['premium-gift']);
      expect(filters.origins).toEqual(['국내산']);
      expect(filters.grades).toEqual(['특상']);
      expect(filters.priceMin).toBe(10000);
      expect(filters.priceMax).toBe(100000);
      expect(filters.freeShippingOnly).toBe(true);
      expect(filters.inStockOnly).toBe(true);
    });

    it('should reset currentPage to 1', () => {
      act(() => {
        useProductFilters.getState().setCurrentPage(3);
        useProductFilters.getState().setFilters({
          categories: ['test'],
          origins: [],
          grades: [],
          priceMin: null,
          priceMax: null,
          freeShippingOnly: false,
          inStockOnly: false,
        });
      });

      expect(useProductFilters.getState().currentPage).toBe(1);
    });
  });

  describe('setFilter', () => {
    it('should update single filter key', () => {
      act(() => {
        useProductFilters.getState().setFilter('categories', ['premium-gift', 'wild-ginseng']);
      });

      expect(useProductFilters.getState().filters.categories).toEqual([
        'premium-gift',
        'wild-ginseng',
      ]);
    });

    it('should update boolean filter', () => {
      act(() => {
        useProductFilters.getState().setFilter('freeShippingOnly', true);
      });

      expect(useProductFilters.getState().filters.freeShippingOnly).toBe(true);
    });

    it('should update price filter', () => {
      act(() => {
        useProductFilters.getState().setFilter('priceMin', 50000);
      });

      expect(useProductFilters.getState().filters.priceMin).toBe(50000);
    });

    it('should reset currentPage to 1', () => {
      act(() => {
        useProductFilters.getState().setCurrentPage(5);
        useProductFilters.getState().setFilter('categories', ['test']);
      });

      expect(useProductFilters.getState().currentPage).toBe(1);
    });
  });

  describe('clearFilters', () => {
    it('should reset all filters to initial values', () => {
      act(() => {
        useProductFilters.getState().setFilters({
          categories: ['premium-gift'],
          origins: ['국내산'],
          grades: ['특상'],
          priceMin: 10000,
          priceMax: 100000,
          freeShippingOnly: true,
          inStockOnly: true,
        });
        useProductFilters.getState().clearFilters();
      });

      const { filters } = useProductFilters.getState();
      expect(filters.categories).toEqual([]);
      expect(filters.origins).toEqual([]);
      expect(filters.grades).toEqual([]);
      expect(filters.priceMin).toBeNull();
      expect(filters.priceMax).toBeNull();
      expect(filters.freeShippingOnly).toBe(false);
      expect(filters.inStockOnly).toBe(false);
    });

    it('should reset currentPage to 1', () => {
      act(() => {
        useProductFilters.getState().setCurrentPage(10);
        useProductFilters.getState().clearFilters();
      });

      expect(useProductFilters.getState().currentPage).toBe(1);
    });
  });

  describe('setSort', () => {
    it('should update sort option', () => {
      act(() => {
        useProductFilters.getState().setSort('price-asc');
      });

      expect(useProductFilters.getState().sort).toBe('price-asc');
    });

    it('should reset currentPage to 1', () => {
      act(() => {
        useProductFilters.getState().setCurrentPage(3);
        useProductFilters.getState().setSort('price-desc');
      });

      expect(useProductFilters.getState().currentPage).toBe(1);
    });
  });

  describe('setViewMode', () => {
    it('should update view mode to list', () => {
      act(() => {
        useProductFilters.getState().setViewMode('list');
      });

      expect(useProductFilters.getState().viewMode).toBe('list');
    });

    it('should update view mode back to grid', () => {
      act(() => {
        useProductFilters.getState().setViewMode('list');
        useProductFilters.getState().setViewMode('grid');
      });

      expect(useProductFilters.getState().viewMode).toBe('grid');
    });

    it('should NOT reset currentPage', () => {
      act(() => {
        useProductFilters.getState().setCurrentPage(5);
        useProductFilters.getState().setViewMode('list');
      });

      expect(useProductFilters.getState().currentPage).toBe(5);
    });
  });

  describe('setSearchQuery', () => {
    it('should update search query', () => {
      act(() => {
        useProductFilters.getState().setSearchQuery('송이버섯');
      });

      expect(useProductFilters.getState().searchQuery).toBe('송이버섯');
    });

    it('should reset currentPage to 1', () => {
      act(() => {
        useProductFilters.getState().setCurrentPage(3);
        useProductFilters.getState().setSearchQuery('테스트');
      });

      expect(useProductFilters.getState().currentPage).toBe(1);
    });
  });

  describe('setCurrentPage', () => {
    it('should update current page', () => {
      act(() => {
        useProductFilters.getState().setCurrentPage(5);
      });

      expect(useProductFilters.getState().currentPage).toBe(5);
    });
  });

  describe('resetAll', () => {
    it('should reset filters, sort, searchQuery, and currentPage', () => {
      act(() => {
        useProductFilters.getState().setFilters({
          categories: ['test'],
          origins: ['국내산'],
          grades: [],
          priceMin: 1000,
          priceMax: null,
          freeShippingOnly: true,
          inStockOnly: false,
        });
        useProductFilters.getState().setSort('price-desc');
        useProductFilters.getState().setSearchQuery('검색어');
        useProductFilters.getState().setCurrentPage(10);
        useProductFilters.getState().resetAll();
      });

      const state = useProductFilters.getState();
      expect(state.filters.categories).toEqual([]);
      expect(state.sort).toBe('newest');
      expect(state.searchQuery).toBe('');
      expect(state.currentPage).toBe(1);
    });

    it('should NOT reset viewMode', () => {
      act(() => {
        useProductFilters.getState().setViewMode('list');
        useProductFilters.getState().resetAll();
      });

      expect(useProductFilters.getState().viewMode).toBe('list');
    });
  });

  describe('getActiveFiltersCount', () => {
    it('should return 0 when no filters active', () => {
      const count = useProductFilters.getState().getActiveFiltersCount();
      expect(count).toBe(0);
    });

    it('should count category filters', () => {
      act(() => {
        useProductFilters.getState().setFilter('categories', ['cat1', 'cat2']);
      });

      const count = useProductFilters.getState().getActiveFiltersCount();
      expect(count).toBe(2);
    });

    it('should count origin filters', () => {
      act(() => {
        useProductFilters.getState().setFilter('origins', ['국내산']);
      });

      const count = useProductFilters.getState().getActiveFiltersCount();
      expect(count).toBe(1);
    });

    it('should count grade filters', () => {
      act(() => {
        useProductFilters.getState().setFilter('grades', ['특상', '상']);
      });

      const count = useProductFilters.getState().getActiveFiltersCount();
      expect(count).toBe(2);
    });

    it('should count price range as 1 when either min or max is set', () => {
      act(() => {
        useProductFilters.getState().setFilter('priceMin', 10000);
      });

      expect(useProductFilters.getState().getActiveFiltersCount()).toBe(1);

      act(() => {
        useProductFilters.getState().setFilter('priceMax', 50000);
      });

      // Still 1 because price range counts as one filter
      expect(useProductFilters.getState().getActiveFiltersCount()).toBe(1);
    });

    it('should count boolean filters', () => {
      act(() => {
        useProductFilters.getState().setFilter('freeShippingOnly', true);
        useProductFilters.getState().setFilter('inStockOnly', true);
      });

      const count = useProductFilters.getState().getActiveFiltersCount();
      expect(count).toBe(2);
    });

    it('should count all active filters correctly', () => {
      act(() => {
        useProductFilters.getState().setFilters({
          categories: ['cat1', 'cat2'], // 2
          origins: ['국내산'], // 1
          grades: ['특상'], // 1
          priceMin: 10000, // 1 (with priceMax counts as 1)
          priceMax: 50000,
          freeShippingOnly: true, // 1
          inStockOnly: true, // 1
        });
      });

      const count = useProductFilters.getState().getActiveFiltersCount();
      expect(count).toBe(7); // 2+1+1+1+1+1
    });
  });
});
