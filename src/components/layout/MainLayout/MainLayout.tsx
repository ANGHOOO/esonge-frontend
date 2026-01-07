import { useState, type ReactNode } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MobileDrawer } from '../MobileDrawer';
import styles from './MainLayout.module.css';

export interface MainLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export function MainLayout({ children, hideFooter = false }: MainLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // TODO: Replace with actual auth state from Zustand store
  const isAuthenticated = false;
  const userName = '';
  const cartItemCount = 0;

  return (
    <div className={styles.layout}>
      <Header
        isAuthenticated={isAuthenticated}
        userName={userName}
        cartItemCount={cartItemCount}
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
