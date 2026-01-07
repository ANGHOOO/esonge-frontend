import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';
import styles from './Header.module.css';

export interface HeaderProps {
  cartItemCount?: number;
  isAuthenticated?: boolean;
  userName?: string;
  onMenuClick?: () => void;
}

export function Header({
  cartItemCount = 0,
  isAuthenticated = false,
  userName,
  onMenuClick,
}: HeaderProps) {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="메뉴 열기"
          type="button"
        >
          <Menu />
        </button>

        {/* Logo */}
        <Link to={ROUTES.HOME} className={styles.logo}>
          <span className={styles.logoText}>Esonge</span>
          <span className={styles.logoSubtext}>동성유통</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link to={ROUTES.PRODUCTS} className={styles.navLink}>
            전체 상품
          </Link>
          <Link to={`${ROUTES.PRODUCTS}?category=seafood`} className={styles.navLink}>
            수산물
          </Link>
          <Link to={`${ROUTES.PRODUCTS}?category=dried-seafood`} className={styles.navLink}>
            건수산물
          </Link>
          <Link to={`${ROUTES.PRODUCTS}?category=agricultural`} className={styles.navLink}>
            농산물
          </Link>
          <Link to={`${ROUTES.PRODUCTS}?category=processed`} className={styles.navLink}>
            가공식품
          </Link>
        </nav>

        {/* Desktop Search Bar */}
        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="상품 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Mobile Search Toggle */}
          <button
            className={styles.iconButton}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label={isSearchOpen ? '검색 닫기' : '검색 열기'}
            type="button"
          >
            {isSearchOpen ? <X /> : <Search />}
          </button>

          {/* Cart */}
          <Link to={ROUTES.CART} className={styles.cartButton} aria-label="장바구니">
            <ShoppingCart />
            {cartItemCount > 0 && <span className={styles.cartBadge}>{cartItemCount}</span>}
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <Link to={ROUTES.PROFILE} className={styles.userButton} aria-label="내 계정">
              <User />
              <span className={styles.userName}>{userName}</span>
            </Link>
          ) : (
            <div className={styles.authButtons}>
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>
                로그인
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                회원가입
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className={styles.mobileSearch}>
          <form onSubmit={handleSearchSubmit}>
            <div className={styles.mobileSearchWrapper}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                className={styles.mobileSearchInput}
                placeholder="상품 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
