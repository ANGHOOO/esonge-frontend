import type { ReactNode } from 'react';
import { Package } from 'lucide-react';
import { Button } from '../Button';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  const classNames = [styles.container, className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <div className={styles.iconWrapper}>{icon || <Package className={styles.defaultIcon} />}</div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} className={styles.action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
