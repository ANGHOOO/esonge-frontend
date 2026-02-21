import { Link } from 'react-router-dom';
import { Truck, Shield, Phone } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';
import { HeroBanner } from './HeroBanner';
import styles from './HomePage.module.css';

const CATEGORIES = [
  { id: 'premium-gift', name: '선물용 명품', slug: 'premium-gift', emoji: '🎁' },
  { id: 'natural-songi', name: '자연산 송이 가정용', slug: 'natural-songi', emoji: '🍄' },
  { id: 'frozen-mushroom', name: '냉동송이/능이버섯', slug: 'frozen-mushroom', emoji: '❄️' },
  { id: 'wild-mushroom', name: '능이/싸리/곰버섯', slug: 'wild-mushroom', emoji: '🌿' },
  { id: 'wild-ginseng', name: '산삼/산양산삼', slug: 'wild-ginseng', emoji: '🌱' },
  { id: 'deodeok-doraji', name: '더덕/도라지', slug: 'deodeok-doraji', emoji: '🥕' },
  { id: 'apple-plum', name: '사과/자두', slug: 'apple-plum', emoji: '🍎' },
];

const FEATURES = [
  {
    icon: Truck,
    title: '빠른 배송',
    description: '신선한 상품을 빠르게 배송해 드립니다',
  },
  {
    icon: Shield,
    title: '품질 보장',
    description: '최고 품질의 상품만을 엄선합니다',
  },
  {
    icon: Phone,
    title: '고객 지원',
    description: '033-644-6077로 언제든 문의하세요',
  },
];

export function HomePage() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <HeroBanner />

      {/* Categories Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>카테고리</h2>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`${ROUTES.PRODUCTS}?category=${category.slug}`}
                className={styles.categoryCard}
              >
                <span className={styles.categoryEmoji}>{category.emoji}</span>
                <span className={styles.categoryName}>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <feature.icon />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>지금 바로 신선한 상품을 만나보세요</h2>
            <p className={styles.ctaDescription}>회원가입하고 다양한 혜택을 누리세요</p>
            <div className={styles.ctaActions}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => (window.location.href = ROUTES.REGISTER)}
              >
                회원가입
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => (window.location.href = ROUTES.PRODUCTS)}
              >
                둘러보기
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
