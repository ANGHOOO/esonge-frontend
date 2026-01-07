import { useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '@/components/layout';
import { ROUTES } from '@/constants/routes';
import { EmptyState, ProductCardSkeleton } from '@/components/ui';
import { ShoppingBag } from 'lucide-react';
import styles from './ProductsPage.module.css';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const breadcrumbItems = [
    { label: '전체 상품', href: ROUTES.PRODUCTS },
    ...(category ? [{ label: getCategoryName(category) }] : []),
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.header}>
          <h1 className={styles.title}>
            {search ? `"${search}" 검색 결과` : category ? getCategoryName(category) : '전체 상품'}
          </h1>
          <p className={styles.count}>총 0개의 상품</p>
        </div>

        <div className={styles.content}>
          {/* Filter Sidebar - Placeholder */}
          <aside className={styles.sidebar}>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>필터</h3>
              <p className={styles.placeholder}>필터 UI가 여기에 표시됩니다</p>
            </div>
          </aside>

          {/* Product Grid */}
          <main className={styles.main}>
            {/* Sort Options - Placeholder */}
            <div className={styles.toolbar}>
              <span className={styles.placeholder}>정렬 옵션</span>
            </div>

            {/* Product List - Skeleton for now */}
            <div className={styles.productGrid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>

            {/* Empty State for when there are no products */}
            <EmptyState
              icon={<ShoppingBag />}
              title="상품이 없습니다"
              description="현재 등록된 상품이 없습니다. 곧 새로운 상품이 등록될 예정입니다."
              actionLabel="홈으로 이동"
              onAction={() => (window.location.href = ROUTES.HOME)}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

function getCategoryName(slug: string): string {
  const categories: Record<string, string> = {
    seafood: '수산물',
    'dried-seafood': '건수산물',
    agricultural: '농산물',
    livestock: '축산물',
    processed: '가공식품',
    seasoning: '양념/장류',
    living: '생활용품',
    health: '건강식품',
  };
  return categories[slug] || '전체 상품';
}
