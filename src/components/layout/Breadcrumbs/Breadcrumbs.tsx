import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumbs({ items, showHome = true, className = '' }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: '홈', href: ROUTES.HOME }, ...items]
    : items;

  const classNames = [styles.breadcrumbs, className].filter(Boolean).join(' ');

  return (
    <nav className={classNames} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isHome = index === 0 && showHome;

          return (
            <li key={index} className={styles.item}>
              {!isLast && item.href ? (
                <>
                  <Link to={item.href} className={styles.link}>
                    {isHome ? <Home className={styles.homeIcon} aria-label="홈" /> : item.label}
                  </Link>
                  <ChevronRight className={styles.separator} aria-hidden="true" />
                </>
              ) : (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
