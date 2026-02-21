import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumbs } from '@/components/layout';
import { EmptyState } from '@/components/ui';
import { ProductGrid, FilterPanel, SortDropdown, ViewToggle } from '@/components/product';
import { useProductFilters, useCart, useWishlist } from '@/stores';
import { products, CATEGORIES, type Product } from '@/mocks/products';
import { ROUTES } from '@/constants/routes';
import styles from './ProductsPage.module.css';

const ITEMS_PER_PAGE = 12;

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const {
    filters,
    sort,
    viewMode,
    currentPage,
    setFilters,
    clearFilters,
    setSort,
    setViewMode,
    setCurrentPage,
    getActiveFiltersCount,
    setFilter,
  } = useProductFilters();

  const { addItem } = useCart();
  const { productIds: wishlistIds, toggleItem: toggleWishlist, isInWishlist } = useWishlist();

  // Sync URL category param with filters
  useEffect(() => {
    if (categoryParam && !filters.categories.includes(categoryParam)) {
      setFilter('categories', [categoryParam]);
    }
  }, [categoryParam, filters.categories, setFilter]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchParam) {
      const query = searchParam.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.categoryName.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Origin filter
    if (filters.origins.length > 0) {
      result = result.filter((p) => filters.origins.includes(p.origin));
    }

    // Grade filter
    if (filters.grades.length > 0) {
      result = result.filter((p) => filters.grades.includes(p.grade));
    }

    // Price filter
    if (filters.priceMin !== null) {
      result = result.filter((p) => p.price >= filters.priceMin!);
    }
    if (filters.priceMax !== null) {
      result = result.filter((p) => p.price <= filters.priceMax!);
    }

    // Free shipping filter
    if (filters.freeShippingOnly) {
      result = result.filter((p) => p.freeShipping);
    }

    // In stock filter
    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sorting
    switch (sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'best-seller':
        result.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [filters, sort, searchParam]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Get page title
  const getPageTitle = () => {
    if (searchParam) return `"${searchParam}" 검색 결과`;
    if (categoryParam) {
      const category = CATEGORIES.find((c) => c.id === categoryParam);
      return category?.name || '전체 상품';
    }
    return '전체 상품';
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: '전체 상품', href: ROUTES.PRODUCTS },
    ...(categoryParam
      ? [{ label: CATEGORIES.find((c) => c.id === categoryParam)?.name || categoryParam }]
      : []),
  ];

  const activeFiltersCount = getActiveFiltersCount();

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error('품절된 상품입니다.');
      return;
    }
    addItem(product);
    toast.success(`${product.name}이(가) 장바구니에 추가되었습니다.`);
  };

  const handleToggleWishlist = (product: Product) => {
    toggleWishlist(product.id);
    if (isInWishlist(product.id)) {
      toast.success('찜 목록에서 삭제되었습니다.');
    } else {
      toast.success('찜 목록에 추가되었습니다.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.header}>
          <h1 className={styles.title}>{getPageTitle()}</h1>
          <p className={styles.count}>총 {filteredProducts.length}개의 상품</p>
        </div>

        <div className={styles.content}>
          {/* Filter Sidebar */}
          <aside className={styles.sidebar}>
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </aside>

          {/* Main Content */}
          <main className={styles.main}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                <span className={styles.resultCount}>{filteredProducts.length}개 상품</span>
              </div>
              <div className={styles.toolbarRight}>
                <ViewToggle value={viewMode} onChange={setViewMode} />
                <SortDropdown value={sort} onChange={setSort} />
              </div>
            </div>

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <ProductGrid
                  products={paginatedProducts}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistIds={wishlistIds}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.pageButton}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      이전
                    </button>
                    <div className={styles.pageNumbers}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`${styles.pageNumber} ${page === currentPage ? styles.active : ''}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      className={styles.pageButton}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={<ShoppingBag />}
                title="상품이 없습니다"
                description={
                  activeFiltersCount > 0
                    ? '필터 조건에 맞는 상품이 없습니다. 필터를 변경해 보세요.'
                    : '현재 등록된 상품이 없습니다.'
                }
                actionLabel={activeFiltersCount > 0 ? '필터 초기화' : '홈으로 이동'}
                onAction={
                  activeFiltersCount > 0 ? clearFilters : () => (window.location.href = ROUTES.HOME)
                }
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
