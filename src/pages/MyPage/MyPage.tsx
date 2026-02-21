import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Package,
  Edit2,
} from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import { Breadcrumbs } from '@/components/layout';
import { Button } from '@/components/ui';
import { useAuth, useCart, useWishlist } from '@/stores';
import styles from './MyPage.module.css';

export function MyPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, addresses, logout, updateProfile } = useAuth();
  const { getTotalItems: getCartTotal } = useCart();
  const { getTotalItems: getWishlistTotal } = useWishlist();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const breadcrumbItems = [{ label: '마이페이지' }];

  const handleLogout = () => {
    logout();
    toast.success('로그아웃 되었습니다.');
    navigate(ROUTES.HOME);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
    toast.success('프로필이 수정되었습니다.');
  };

  const defaultAddress = addresses.find((addr) => addr.isDefault);

  // Not logged in state
  if (!isAuthenticated || !user) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumbs items={breadcrumbItems} />
          <div className={styles.notLoggedIn}>
            <User className={styles.notLoggedInIcon} />
            <h1 className={styles.notLoggedInTitle}>로그인이 필요합니다</h1>
            <p className={styles.notLoggedInText}>마이페이지를 이용하시려면 로그인해주세요.</p>
            <div className={styles.notLoggedInActions}>
              <Button onClick={() => navigate(ROUTES.LOGIN)}>로그인</Button>
              <Button variant="outline" onClick={() => navigate(ROUTES.REGISTER)}>
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className={styles.pageTitle}>마이페이지</h1>

        <div className={styles.content}>
          {/* Profile Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <User className={styles.sectionIcon} />내 정보
              </h2>
              {!isEditing && (
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => {
                    setEditForm({ name: user.name, phone: user.phone });
                    setIsEditing(true);
                  }}
                >
                  <Edit2 />
                  수정
                </button>
              )}
            </div>

            {isEditing ? (
              <form className={styles.editForm} onSubmit={handleEditSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>이름</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editForm.name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>연락처</label>
                  <input
                    type="tel"
                    className={styles.input}
                    value={editForm.phone}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>이메일</label>
                  <input type="email" className={styles.input} value={user.email} disabled />
                  <span className={styles.helpText}>이메일은 변경할 수 없습니다.</span>
                </div>
                <div className={styles.formActions}>
                  <Button type="submit" size="sm">
                    저장
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    취소
                  </Button>
                </div>
              </form>
            ) : (
              <div className={styles.profileInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>이름</span>
                  <span className={styles.infoValue}>{user.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>이메일</span>
                  <span className={styles.infoValue}>{user.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>연락처</span>
                  <span className={styles.infoValue}>{user.phone}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>가입일</span>
                  <span className={styles.infoValue}>
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Quick Stats */}
          <section className={styles.statsSection}>
            <Link to={ROUTES.CART} className={styles.statCard}>
              <ShoppingBag className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>장바구니</span>
                <span className={styles.statValue}>{getCartTotal()}개</span>
              </div>
              <ChevronRight className={styles.statArrow} />
            </Link>
            <Link to={ROUTES.WISHLIST} className={styles.statCard}>
              <Heart className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>찜 목록</span>
                <span className={styles.statValue}>{getWishlistTotal()}개</span>
              </div>
              <ChevronRight className={styles.statArrow} />
            </Link>
            <Link to={ROUTES.ORDERS} className={styles.statCard}>
              <Package className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>주문내역</span>
                <span className={styles.statValue}>보기</span>
              </div>
              <ChevronRight className={styles.statArrow} />
            </Link>
          </section>

          {/* Address Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <MapPin className={styles.sectionIcon} />
                배송지 관리
              </h2>
              <Link to={ROUTES.ADDRESSES} className={styles.linkButton}>
                전체 보기
                <ChevronRight />
              </Link>
            </div>

            {defaultAddress ? (
              <div className={styles.addressCard}>
                <div className={styles.addressHeader}>
                  <span className={styles.addressName}>{defaultAddress.name}</span>
                  <span className={styles.defaultBadge}>기본 배송지</span>
                </div>
                <p className={styles.addressRecipient}>
                  {defaultAddress.recipient} · {defaultAddress.phone}
                </p>
                <p className={styles.addressText}>
                  [{defaultAddress.zipCode}] {defaultAddress.address} {defaultAddress.addressDetail}
                </p>
              </div>
            ) : (
              <div className={styles.emptyAddress}>
                <p>등록된 배송지가 없습니다.</p>
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.ADDRESSES)}>
                  배송지 추가
                </Button>
              </div>
            )}
          </section>

          {/* Menu Links */}
          <section className={styles.menuSection}>
            <Link to={ROUTES.SETTINGS} className={styles.menuItem}>
              <Settings className={styles.menuIcon} />
              <span>설정</span>
              <ChevronRight className={styles.menuArrow} />
            </Link>
            <button type="button" className={styles.menuItem} onClick={handleLogout}>
              <LogOut className={styles.menuIcon} />
              <span>로그아웃</span>
              <ChevronRight className={styles.menuArrow} />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
