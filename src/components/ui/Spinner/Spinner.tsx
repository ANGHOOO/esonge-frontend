import { Loader2 } from 'lucide-react';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const classNames = [styles.spinner, styles[size], className].filter(Boolean).join(' ');

  return (
    <div className={classNames} role="status" aria-label="로딩 중">
      <Loader2 className={styles.icon} />
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}
