import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}: SkeletonProps) {
  const classNames = [styles.skeleton, styles[variant], className].filter(Boolean).join(' ');

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (count > 1) {
    return (
      <div className={styles.group}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={classNames} style={style} />
        ))}
      </div>
    );
  }

  return <div className={classNames} style={style} />;
}

// Preset Skeletons for common use cases
export function ProductCardSkeleton() {
  return (
    <div className={styles.productCard}>
      <Skeleton variant="rectangular" height={200} />
      <div className={styles.productCardContent}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className={styles.listItem}>
      <Skeleton variant="circular" width={48} height={48} />
      <div className={styles.listItemContent}>
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="50%" />
      </div>
    </div>
  );
}
