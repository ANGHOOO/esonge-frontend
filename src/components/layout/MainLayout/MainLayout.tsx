import { useState, type ReactNode } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MobileDrawer } from '../MobileDrawer';
import { useCart, useWishlist, useAuth } from '@/stores';
import styles from './MainLayout.module.css';

export interface MainLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export function MainLayout({ children, hideFooter = false }: MainLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { getTotalItems: getCartTotal } = useCart();
  const { getTotalItems: getWishlistTotal } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const userName = user?.name || '';
  const cartItemCount = getCartTotal();
  const wishlistItemCount = getWishlistTotal();

  return (
    <div className={styles.layout}>
      <Header
        isAuthenticated={isAuthenticated}
        userName={userName}
        cartItemCount={cartItemCount}
        wishlistItemCount={wishlistItemCount}
        onMenuClick={() => setIsDrawerOpen(true)}
      />

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isAuthenticated={isAuthenticated}
        userName={userName}
      />

      <main className={styles.main}>{children}</main>

      {!hideFooter && <Footer />}
    </div>
  );
}
