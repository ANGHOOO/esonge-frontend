import { Grid, List } from 'lucide-react';
import styles from './ViewToggle.module.css';

export type ViewMode = 'grid' | 'list';

export interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className={styles.container} role="group" aria-label="보기 방식 선택">
      <button
        type="button"
        className={`${styles.button} ${value === 'grid' ? styles.active : ''}`}
        onClick={() => onChange('grid')}
        aria-pressed={value === 'grid'}
        aria-label="그리드 보기"
      >
        <Grid className={styles.icon} />
      </button>
      <button
        type="button"
        className={`${styles.button} ${value === 'list' ? styles.active : ''}`}
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        aria-label="리스트 보기"
      >
        <List className={styles.icon} />
      </button>
    </div>
  );
}
