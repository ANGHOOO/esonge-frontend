import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { products } from '@/mocks/products';
import styles from './SearchBar.module.css';

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;
const DEBOUNCE_DELAY = 300;

const POPULAR_KEYWORDS = ['송이버섯', '능이버섯', '산양산삼', '더덕', '사과'];

export interface SearchBarProps {
  onClose?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export function SearchBar({
  onClose,
  autoFocus = false,
  placeholder = '상품 검색...',
}: SearchBarProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<typeof products>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const filtered = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.categoryName.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5);
      setSuggestions(filtered);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [query]);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;

      saveRecentSearch(trimmed);
      setQuery('');
      setIsOpen(false);
      onClose?.();
      navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(trimmed)}`);
    },
    [navigate, saveRecentSearch, onClose]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleRemoveRecentSearch = (searchQuery: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== searchQuery);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      onClose?.();
    }
  };

  const showDropdown = isOpen && (query.trim() || recentSearches.length > 0);

  return (
    <div className={styles.container} ref={containerRef} onKeyDown={handleKeyDown}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <Search className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            aria-label="상품 검색"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="검색어 지우기"
            >
              <X />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className={styles.dropdown}>
          {/* Product Suggestions */}
          {suggestions.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>상품 추천</span>
              </div>
              <ul className={styles.suggestionList}>
                {suggestions.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      className={styles.suggestionItem}
                      onClick={() => {
                        setIsOpen(false);
                        onClose?.();
                        navigate(`${ROUTES.PRODUCTS}/${product.id}`);
                      }}
                    >
                      <div className={styles.productInfo}>
                        <span className={styles.productName}>{product.name}</span>
                        <span className={styles.productCategory}>{product.categoryName}</span>
                      </div>
                      <span className={styles.productPrice}>
                        {new Intl.NumberFormat('ko-KR').format(product.price)}원
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent Searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>
                  <Clock className={styles.sectionIcon} />
                  최근 검색어
                </span>
                <button
                  type="button"
                  className={styles.clearAllButton}
                  onClick={handleClearAllRecent}
                >
                  전체 삭제
                </button>
              </div>
              <ul className={styles.recentList}>
                {recentSearches.map((search) => (
                  <li key={search}>
                    <button
                      type="button"
                      className={styles.recentItem}
                      onClick={() => handleSearch(search)}
                    >
                      <span>{search}</span>
                      <X
                        className={styles.removeIcon}
                        onClick={(e) => handleRemoveRecentSearch(search, e)}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Popular Keywords */}
          {!query.trim() && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>
                  <TrendingUp className={styles.sectionIcon} />
                  인기 검색어
                </span>
              </div>
              <div className={styles.popularKeywords}>
                {POPULAR_KEYWORDS.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    className={styles.keywordChip}
                    onClick={() => handleSearch(keyword)}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
