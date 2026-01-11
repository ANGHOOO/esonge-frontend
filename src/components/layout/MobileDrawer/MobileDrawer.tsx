import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';
import styles from './MobileDrawer.module.css';

const CATEGORIES = [
  { id: 'premium-gift', name: '선물용 명품', slug: 'premium-gift' },
  { id: 'natural-songi', name: '자연산 송이 가정용', slug: 'natural-songi' },
  { id: 'frozen-mushroom', name: '냉동송이/능이버섯', slug: 'frozen-mushroom' },
  { id: 'wild-mushroom', name: '능이/싸리/곰버섯', slug: 'wild-mushroom' },
  { id: 'wild-ginseng', name: '산삼/산양산삼', slug: 'wild-ginseng' },
  { id: 'deodeok-doraji', name: '더덕/도라지', slug: 'deodeok-doraji' },
  { id: 'apple-plum', name: '사과/자두', slug: 'apple-plum' },
];

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  isAuthenticated = false,
  userName,
  onLogout,
}: MobileDrawerProps) {
  const navigate = useNavigate();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    onLogout?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="메뉴">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.userSection}>
            {isAuthenticated ? (
              <>
                <div className={styles.avatar}>
                  <User />
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{userName}님</span>
                  <span className={styles.userWelcome}>환영합니다!</span>
                </div>
              </>
            ) : (
              <div className={styles.authPrompt}>
                <p>로그인하고 더 많은 혜택을 받으세요</p>
                <div className={styles.authButtons}>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => handleNavigation(ROUTES.LOGIN)}
                  >
                    로그인
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => handleNavigation(ROUTES.REGISTER)}
                  >
                    회원가입
                  </Button>
                </div>
              </div>
            )}
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="메뉴 닫기">
            <X />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Quick Links */}
          {isAuthenticated && (
            <div className={styles.quickLinks}>
              <button className={styles.quickLink} onClick={() => handleNavigation(ROUTES.ORDERS)}>
                <ShoppingBag />
                <span>주문 내역</span>
              </button>
              <button className={styles.quickLink} onClick={() => handleNavigation('/wishlist')}>
                <Heart />
                <span>찜 목록</span>
              </button>
              <button
                className={styles.quickLink}
                onClick={() => handleNavigation(ROUTES.SETTINGS)}
              >
                <Settings />
                <span>설정</span>
              </button>
            </div>
          )}

          {/* Categories */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>카테고리</h3>
            <nav className={styles.categoryList}>
              <Link to={ROUTES.PRODUCTS} className={styles.categoryItem} onClick={onClose}>
                <span>전체 상품</span>
                <ChevronRight className={styles.chevron} />
              </Link>
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={`${ROUTES.PRODUCTS}?category=${category.slug}`}
                  className={styles.categoryItem}
                  onClick={onClose}
                >
                  <span>{category.name}</span>
                  <ChevronRight className={styles.chevron} />
                </Link>
              ))}
            </nav>
          </div>

          {/* Support Links */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>고객 지원</h3>
            <nav className={styles.supportList}>
              <Link to="/faq" className={styles.supportItem} onClick={onClose}>
                <HelpCircle />
                <span>자주 묻는 질문</span>
              </Link>
              <Link to="/notices" className={styles.supportItem} onClick={onClose}>
                <span>공지사항</span>
              </Link>
              <Link to="/contact" className={styles.supportItem} onClick={onClose}>
                <span>문의하기</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Footer */}
        {isAuthenticated && (
          <div className={styles.footer}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <LogOut />
              <span>로그아웃</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
