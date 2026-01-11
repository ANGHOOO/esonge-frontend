import { X } from 'lucide-react';
import { Checkbox, Button } from '@/components/ui';
import { CATEGORIES } from '@/mocks/products';
import styles from './FilterPanel.module.css';

export interface ProductFilters {
  categories: string[];
  origins: string[];
  grades: string[];
  priceMin: number | null;
  priceMax: number | null;
  freeShippingOnly: boolean;
  inStockOnly: boolean;
}

export interface FilterPanelProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

const ORIGINS = [
  { id: '국내산', label: '국내산' },
  { id: '수입산', label: '수입산' },
];

const GRADES = [
  { id: '특상', label: '특상' },
  { id: '상', label: '상' },
  { id: '중', label: '중' },
];

const PRICE_RANGES = [
  { min: null, max: 50000, label: '5만원 이하' },
  { min: 50000, max: 100000, label: '5만원 ~ 10만원' },
  { min: 100000, max: 300000, label: '10만원 ~ 30만원' },
  { min: 300000, max: 500000, label: '30만원 ~ 50만원' },
  { min: 500000, max: null, label: '50만원 이상' },
];

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
}: FilterPanelProps) {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId);
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleOriginChange = (origin: string, checked: boolean) => {
    const newOrigins = checked
      ? [...filters.origins, origin]
      : filters.origins.filter((o) => o !== origin);
    onFilterChange({ ...filters, origins: newOrigins });
  };

  const handleGradeChange = (grade: string, checked: boolean) => {
    const newGrades = checked
      ? [...filters.grades, grade]
      : filters.grades.filter((g) => g !== grade);
    onFilterChange({ ...filters, grades: newGrades });
  };

  const handlePriceRangeChange = (min: number | null, max: number | null) => {
    const isSameRange = filters.priceMin === min && filters.priceMax === max;
    if (isSameRange) {
      onFilterChange({ ...filters, priceMin: null, priceMax: null });
    } else {
      onFilterChange({ ...filters, priceMin: min, priceMax: max });
    }
  };

  const handleFreeShippingChange = (checked: boolean) => {
    onFilterChange({ ...filters, freeShippingOnly: checked });
  };

  const handleInStockChange = (checked: boolean) => {
    onFilterChange({ ...filters, inStockOnly: checked });
  };

  const isPriceRangeSelected = (min: number | null, max: number | null) => {
    return filters.priceMin === min && filters.priceMax === max;
  };

  return (
    <aside className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>필터</h3>
        {activeFiltersCount > 0 && (
          <button type="button" className={styles.clearButton} onClick={onClearFilters}>
            초기화
            <X className={styles.clearIcon} />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>카테고리</h4>
        <div className={styles.checkboxGroup}>
          {CATEGORIES.map((category) => (
            <Checkbox
              key={category.id}
              id={`category-${category.id}`}
              label={category.name}
              checked={filters.categories.includes(category.id)}
              onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
            />
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>가격대</h4>
        <div className={styles.priceRanges}>
          {PRICE_RANGES.map((range, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.priceButton} ${isPriceRangeSelected(range.min, range.max) ? styles.active : ''}`}
              onClick={() => handlePriceRangeChange(range.min, range.max)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Origin */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>원산지</h4>
        <div className={styles.checkboxGroup}>
          {ORIGINS.map((origin) => (
            <Checkbox
              key={origin.id}
              id={`origin-${origin.id}`}
              label={origin.label}
              checked={filters.origins.includes(origin.id)}
              onChange={(e) => handleOriginChange(origin.id, e.target.checked)}
            />
          ))}
        </div>
      </div>

      {/* Grade */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>등급</h4>
        <div className={styles.checkboxGroup}>
          {GRADES.map((grade) => (
            <Checkbox
              key={grade.id}
              id={`grade-${grade.id}`}
              label={grade.label}
              checked={filters.grades.includes(grade.id)}
              onChange={(e) => handleGradeChange(grade.id, e.target.checked)}
            />
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>기타</h4>
        <div className={styles.checkboxGroup}>
          <Checkbox
            id="free-shipping"
            label="무료배송만"
            checked={filters.freeShippingOnly}
            onChange={(e) => handleFreeShippingChange(e.target.checked)}
          />
          <Checkbox
            id="in-stock"
            label="재고있는 상품만"
            checked={filters.inStockOnly}
            onChange={(e) => handleInStockChange(e.target.checked)}
          />
        </div>
      </div>
    </aside>
  );
}

// Mobile Filter Button Component
export interface MobileFilterButtonProps {
  activeFiltersCount: number;
  onClick: () => void;
}

export function MobileFilterButton({ activeFiltersCount, onClick }: MobileFilterButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className={styles.mobileButton}>
      필터
      {activeFiltersCount > 0 && <span className={styles.filterBadge}>{activeFiltersCount}</span>}
    </Button>
  );
}
