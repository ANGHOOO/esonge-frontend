import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Phone } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';
import styles from './HomePage.module.css';

const CATEGORIES = [
  { id: 'seafood', name: '수산물', slug: 'seafood', emoji: '' },
  { id: 'dried-seafood', name: '건수산물', slug: 'dried-seafood', emoji: '' },
  { id: 'agricultural', name: '농산물', slug: 'agricultural', emoji: '' },
  { id: 'livestock', name: '축산물', slug: 'livestock', emoji: '' },
  { id: 'processed', name: '가공식품', slug: 'processed', emoji: '' },
  { id: 'seasoning', name: '양념/장류', slug: 'seasoning', emoji: '' },
  { id: 'living', name: '생활용품', slug: 'living', emoji: '' },
  { id: 'health', name: '건강식품', slug: 'health', emoji: '' },
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
      <section className={styles.hero}>
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
      </section>

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
