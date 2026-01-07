import { Home, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>페이지를 찾을 수 없습니다</h2>
        <p className={styles.description}>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          주소를 다시 확인해주세요.
        </p>
        <div className={styles.actions}>
          <Button
            variant="primary"
            leftIcon={<Home />}
            onClick={() => (window.location.href = ROUTES.HOME)}
          >
            홈으로 이동
          </Button>
          <Button variant="outline" leftIcon={<ArrowLeft />} onClick={() => window.history.back()}>
            이전 페이지
          </Button>
        </div>
      </div>
    </div>
  );
}
