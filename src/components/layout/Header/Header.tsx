import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingCart, Heart, User, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';
import { SearchBar } from '@/components/product';
import styles from './Header.module.css';

export interface HeaderProps {
  cartItemCount?: number;
  wishlistItemCount?: number;
  isAuthenticated?: boolean;
  userName?: string;
  onMenuClick?: () => void;
}

export function Header({
  cartItemCount = 0,
  wishlistItemCount = 0,
  isAuthenticated = false,
  userName,
  onMenuClick,
}: HeaderProps) {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
          <span className={styles.logoText}>강원송이총판</span>
          <span className={styles.logoSubtext}>동성유통</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link to={ROUTES.PRODUCTS} className={styles.navLink}>
            전체 상품
          </Link>
          <Link to={`${ROUTES.PRODUCTS}?category=premium-gift`} className={styles.navLink}>
            선물용 명품
          </Link>
          <Link to={`${ROUTES.PRODUCTS}?category=natural-songi`} className={styles.navLink}>
            자연산 송이
          </Link>
          <Link to={`${ROUTES.PRODUCTS}?category=frozen-mushroom`} className={styles.navLink}>
            냉동송이/능이
          </Link>
          <Link to={`${ROUTES.PRODUCTS}?category=wild-ginseng`} className={styles.navLink}>
            산삼/산양산삼
          </Link>
        </nav>

        {/* Desktop Search Bar */}
        <div className={styles.searchContainer}>
          <SearchBar />
        </div>

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

          {/* Wishlist */}
          <Link to={ROUTES.WISHLIST} className={styles.iconButton} aria-label="찜 목록">
            <Heart />
            {wishlistItemCount > 0 && (
              <span className={styles.wishlistBadge}>{wishlistItemCount}</span>
            )}
          </Link>

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
          <SearchBar autoFocus onClose={() => setIsSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
