import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import styles from './HomePage.module.css';

const BANNER_IMAGES = [
  { src: 'https://esonge.cafe24.com/web/upload/mainbanner1.jpg', alt: '강원송이총판 배너 1' },
  { src: 'https://esonge.cafe24.com/web/upload/mainbanner2.jpg', alt: '강원송이총판 배너 2' },
  { src: 'https://esonge.cafe24.com/web/upload/mainbanner3.jpg', alt: '강원송이총판 배너 3' },
  { src: 'https://esonge.cafe24.com/web/upload/mainbanner4.jpg', alt: '강원송이총판 배너 4' },
  { src: 'https://esonge.cafe24.com/web/upload/mainbanner5.jpg', alt: '강원송이총판 배너 5' },
];
const AUTO_SLIDE_INTERVAL_MS = 3000;

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % BANNER_IMAGES.length),
      AUTO_SLIDE_INTERVAL_MS
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.hero} aria-label="메인 배너">
      {BANNER_IMAGES.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={`${styles.slide} ${i === currentIndex ? styles.slideActive : ''}`}
        />
      ))}

      <div className={styles.heroOverlay}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            강원도 청정 자연에서
            <br />
            직접 전하는 신선함
          </h1>
          <p className={styles.heroDescription}>
            동성유통에서 엄선한 최고 품질의 수산물, 농산물을 만나보세요.
            <br />
            산지 직송으로 신선함을 그대로 전달합니다.
          </p>
          <div className={styles.heroActions}>
            <Button
              size="lg"
              rightIcon={<ArrowRight />}
              onClick={() => (window.location.href = ROUTES.PRODUCTS)}
            >
              쇼핑 시작하기
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.heroDots} role="tablist" aria-label="배너 탐색">
        {BANNER_IMAGES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === currentIndex}
            className={`${styles.heroDot} ${i === currentIndex ? styles.heroDotActive : ''}`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`배너 ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
